/**
 * 滚动/渲染探针（默认关闭）。
 *
 * 目的：把「为什么跳了一下」变成可读的数据，而不是靠肉眼回忆。
 *
 * 打开方式（三选一）：
 * - 地址栏加 hash：`#caui-probe`
 * - 控制台：`localStorage.setItem('caui:probe', '1')` 后刷新
 * - 打开后在控制台用：`__cauiProbe.tail(40)` / `.dump()` / `.save()` / `.clear()` / `.off()`
 *
 * 记录的是**事实**：每帧的 scrollTop / 内容高度 / 底部余量 / 跟随器内部量，
 * 每次 scroll 事件（区分程序写入与用户滚动）、每次 DOM 变更。
 *
 * 状态挂在 `window.__cauiProbeState` 上而不是模块作用域：插件 bundle 可能被
 * 宿主求值不止一次，模块级的 `entries` 会分裂成两份（HUD 有数、API 读出 0）。
 * 关闭时所有函数都是空操作。
 */

import { cls } from './classes'
import { frameRecord, type FollowFrame } from './scroll-frame'
import { MOTION } from './motion-config'
import { resolveScroller as resolveOwnedScroller } from './scroll-ownership'

export interface ProbeEntry {
  t: number
  kind: string
  [key: string]: unknown
}

interface ProbeState {
  entries: ProbeEntry[]
  active: boolean
  installed: boolean
  hud: HTMLElement | null
  hudAt: number
  lastTickAt: number
  fpsFrames: number
  fpsAt: number
  fps: number
}

const RING = 6000
const STATE_KEY = '__cauiProbeState'

function state (): ProbeState | null {
  if (typeof window === 'undefined') return null
  const scope = window as unknown as Record<string, ProbeState | undefined>
  const existing = scope[STATE_KEY]
  if (existing !== undefined) return existing
  const created: ProbeState = {
    entries: [],
    active: false,
    installed: false,
    hud: null,
    hudAt: 0,
    lastTickAt: 0,
    fpsFrames: 0,
    fpsAt: 0,
    fps: 0,
  }
  scope[STATE_KEY] = created
  return created
}

/** 是否被要求记录（hash 或 localStorage）。 */
export function probeEnabled (): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (window.location.hash.toLowerCase().includes('caui-probe')) return true
    return window.localStorage.getItem('caui:probe') === '1'
  } catch {
    return false
  }
}

/** 探针是否正在记（给「要不要做较贵采样」的分支用）。 */
export function probeLogged (): boolean {
  return state()?.active === true
}

/** 记一条（关闭时零成本）。 */
export function probeLog (kind: string, data: Record<string, unknown> = {}): void {
  const current = state()
  if (current === null || !current.active) return
  current.entries.push({ t: Math.round(performance.now()), kind, ...data })
  if (current.entries.length > RING) current.entries.splice(0, current.entries.length - RING)
}

/**
 * 每帧 tick 的节流记录（50ms）。
 * @param frame - 跟随器这一帧的观测；字段就是 FollowFrame 的八个键。
 */
export function probeTick (frame: FollowFrame): void {
  const current = state()
  if (current === null || !current.active) return
  const now = performance.now()
  if (now - current.lastTickAt < 50) return
  current.lastTickAt = now
  probeLog('tick', frameRecord(frame))
}

/** 更新 HUD（节流 100ms）。 */
export function probeHud (lines: readonly string[]): void {
  const current = state()
  if (current === null || !current.active) return
  const now = performance.now()
  current.fpsFrames += 1
  if (current.fpsAt === 0) current.fpsAt = now
  if (now - current.hudAt < 100) return
  current.hudAt = now
  const elapsed = now - current.fpsAt
  if (elapsed >= 500) {
    current.fps = Math.round((current.fpsFrames * 1000) / elapsed)
    current.fpsFrames = 0
    current.fpsAt = now
  }
  if (current.hud === null || !current.hud.isConnected) installHud(current)
  if (current.hud !== null) {
    current.hud.textContent = lines.concat('fps ' + current.fps + ' · ' + current.entries.length + ' 条').join('\n')
  }
}

function installHud (current: ProbeState): void {
  if (typeof document === 'undefined') return
  const existing = document.querySelector('#caui-probe-hud')
  if (existing instanceof HTMLElement) {
    current.hud = existing
    return
  }
  const element = document.createElement('div')
  element.id = 'caui-probe-hud'
  element.setAttribute('aria-hidden', 'true')
  element.style.cssText = [
    'position: fixed',
    'right: 12px',
    'bottom: 12px',
    'z-index: 9999',
    'padding: 6px 8px',
    'border-radius: 6px',
    'background: rgba(12, 16, 22, 0.78)',
    'color: #8ef0d4',
    'font: 11px/1.45 ui-monospace, SFMono-Regular, Consolas, monospace',
    'white-space: pre',
    'pointer-events: none',
    'box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25)',
  ].join(';')
  element.textContent = 'caui probe'
  document.body.appendChild(element)
  current.hud = element
}

function removeHud (): void {
  const current = state()
  if (current === null) return
  if (current.hud !== null) current.hud.remove()
  current.hud = null
  const existing = document.querySelector('#caui-probe-hud')
  if (existing !== null) existing.remove()
}

/**
 * 安装全局 API（只在开启时真的做事）。重复调用幂等，多份 bundle 也共享同一份状态。
 */
export function probeInstall (): void {
  if (typeof window === 'undefined') return
  const current = state()
  if (current === null || current.installed || !probeEnabled()) return
  current.installed = true
  current.active = true

  const api = {
    on: (): string => { current.active = true; return 'on' },
    off: (): string => { current.active = false; removeHud(); return 'off' },
    clear: (): string => { current.entries = []; return 'cleared' },
    tail: (count = 40): string => JSON.stringify(current.entries.slice(-count), null, 1),
    dump: (): string => JSON.stringify(current.entries, null, 1),
    overlay: (show = true): string => { if (show) installHud(current); else removeHud(); return show ? 'on' : 'off' },
    save: (name = 'caui-probe.json'): string => {
      try {
        const blob = new Blob([JSON.stringify(current.entries, null, 1)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = name
        anchor.click()
        setTimeout(() => URL.revokeObjectURL(url), 2000)
        return 'saved ' + current.entries.length
      } catch (error) {
        return 'save failed: ' + String(error)
      }
    },
    /** 模拟用户上滚（给自动化用）。 */
    scrollUp: (px = 180): string => {
      const target = resolveScroller()
      if (target === null) return 'no scroller'
      target.scrollTop = Math.max(0, target.scrollTop - px)
      return 'top ' + Math.round(target.scrollTop)
    },
    /**
     * 按「验收标准」检查当前这份日志，返回每条判据的通过情况。
     * 这是唯一需要看的东西：`__cauiProbe.check()` 一行就能说清过没过。
     */
    check: (): string => JSON.stringify(checkEntries(current.entries), null, 1),
  }
  ;(window as unknown as { __cauiProbe: typeof api }).__cauiProbe = api
  probeLog('install', { hash: window.location.hash.slice(0, 40) })
}

/**
 * 按验收标准检查一份日志。
 *
 * 判据（速度上限来自 motion.config.json 的 `scroll.maxSpeed`，和 README 的表格一一对应）：
 * - move ≤ maxSpeed×1.05  可见位移的速度不超过上限（与帧率无关）
 * - settle ≤ 2px          停下来之后贴在底部
 * - quiet                 每次用户上滚之后 40 条日志内跟随器没有再写 scrollTop
 * - restick               重新吸附只发生在「用户自己往下滚」之后
 * @param entries - 探针日志。
 */
export function checkEntries (entries: ProbeEntry[]): {
  pass: boolean
  evidence: { ticks: number; enough: boolean }
  move: { maxVelocity: number; limit: number; ok: boolean }
  settle: { gap: number | null; ok: boolean; takenOver: boolean }
  quiet: { unstick: number; violated: number; ok: boolean }
  restick: { resticks: number; suspicious: number; ok: boolean }
  errors: number
} {
  // 判据是**速度**而不是每帧像素：30fps 下走 78px 与 60fps 下走 39px 是同一个
  // 速度，都合法；按每帧像素判会把掉帧误判成缺陷。
  const limit = MOTION.scroll.maxSpeed * 1.05
  const ticks = entries.filter(entry => entry.kind === 'tick')
  const maxVelocity = ticks.reduce((max, entry) => {
    const dt = Number(entry.dt ?? 0)
    const moved = Math.abs(Number(entry.moved ?? 0))
    if (dt <= 0) return max
    return Math.max(max, (moved / dt) * 1000)
  }, 0)
  // 落点只在「最后仍在跟随」时判：用户中途接管后，target 与 top 本来就差一截，
  // 拿那一帧判落点会冤枉跟随器（实测过：滑行到最后 8px 时用户滚轮接管）。
  const lastTick = ticks[ticks.length - 1]
  const lastIndex = lastTick === undefined ? -1 : entries.lastIndexOf(lastTick)
  const takenOver = lastTick !== undefined && (
    Number(lastTick.stick ?? 1) === 0
    || entries.slice(lastIndex + 1).some(entry => entry.kind === 'unstick')
  )
  const gap = lastTick === undefined || takenOver
    ? null
    : Math.abs(Number(lastTick.target ?? 0) - Number(lastTick.top ?? 0))

  let violated = 0
  let unsticks = 0
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index]
    if (entry === undefined || entry.kind !== 'unstick') continue
    unsticks += 1
    const window = entries.slice(index + 1, index + 40)
    const moved = window.some(next => next.kind === 'tick' && Math.abs(Number(next.moved ?? 0)) >= 1)
    if (moved) violated += 1
  }

  let resticks = 0
  let suspicious = 0
  for (let index = 1; index < entries.length; index += 1) {
    const entry = entries[index]
    const previous = entries[index - 1]
    if (entry === undefined || previous === undefined) continue
    if (entry.kind !== 'scroll' || previous.kind !== 'scroll') continue
    if (previous.stick === 0 && entry.stick === 1) {
      resticks += 1
      // 合规的重新吸附：发生在「用户滚到我们最后一次写入位置的下方」之后。
      const written = Number(entry.w ?? entry.top ?? 0)
      if (Number(entry.top ?? 0) <= written + 2) suspicious += 1
    }
  }

  // 证据不足不算通过：空日志 / 没几帧的日志给出 pass 是假绿。
  const enough = ticks.length >= 10
  // 被用户接管 = 这条判据不适用（不是通过，也不是失败），所以记 takenOver。
  const settleOk = takenOver ? true : (gap === null ? false : gap <= 2)
  const pass = enough && maxVelocity <= limit && settleOk && violated === 0 && suspicious === 0
  return {
    pass,
    evidence: { ticks: ticks.length, enough },
    move: { maxVelocity: Math.round(maxVelocity), limit, ok: maxVelocity <= limit },
    settle: { gap: gap === null ? null : Math.round(gap), ok: settleOk, takenOver },
    quiet: { unstick: unsticks, violated, ok: violated === 0 },
    restick: { resticks, suspicious, ok: suspicious === 0 },
    errors: 0,
  }
}

/**
 * 找到真正在滚动的那一层。
 *
 * 归属判定只有一处（scroll-ownership.ts）：探针只负责按类名找到容器节点，
 * 谁拥有滚动由 `resolveScroller` 决定，不再用「scrollHeight 比 clientHeight 大」
 * 这种高度启发猜一次。
 * @returns 当前滚动体；没有挂载或没有 DOM 时为 null。
 */
export function resolveScroller (): HTMLElement | null {
  if (typeof document === 'undefined') return null
  const container = document.querySelector('.' + cls.viewport)
  if (!(container instanceof HTMLElement)) return null
  return resolveOwnedScroller({ container }).element
}
