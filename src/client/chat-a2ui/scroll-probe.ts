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
    /** 打一条自定义标记（例如 scrolled=a 之类的场景切分）。 */
    mark: (kind = 'mark', data: string = ''): string => { probeLog(kind, { note: data }); return 'marked ' + kind },
    /** 打一条会话切换标记：B4「切会话单次落位」只有打了标记才判。 */
    session: (id = ''): string => { probeLog('session', { id: String(id).slice(0, 12) }); return 'session ' + id },
    /** 模拟用户上滚（给自动化用）。 */
    scrollUp: (px = 180): string => {
      const target = findProbeViewport()
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

  // B5「运行期 JS 错误 = 0」必须有测量来源：错误直接进同一份日志。
  const onError = (event: ErrorEvent): void => {
    probeLog('error', { message: String(event.message ?? '').slice(0, 140) })
  }
  const onRejection = (event: PromiseRejectionEvent): void => {
    probeLog('error', { message: String(event.reason ?? '').slice(0, 140) })
  }
  window.addEventListener('error', onError)
  window.addEventListener('unhandledrejection', onRejection)

  ;(window as unknown as { __cauiProbe: typeof api }).__cauiProbe = api
  probeLog('install', { hash: window.location.hash.slice(0, 40) })
}

/** 一条判据的三种结局：通过 / 不通过 / 没测到。 */
export interface Verdict {
  ok: boolean
  measured: boolean
}

/** `checkEntries` 的返回值：与 README「滚动跟随的验收标准」逐条对应。 */
export interface CheckResult {
  /** 全部判据都测到且都通过才算过。 */
  pass: boolean
  /** 所有判据都测到了（false 时看 unverified）。 */
  complete: boolean
  /** 没测到的判据编号（B1 / B2 / B4 …）。 */
  unverified: string[]
  evidence: { ticks: number; enough: boolean }
  /** A1 / C1：可见位移的速度上限（px/s）。 */
  move: { maxVelocity: number; limit: number; ok: boolean }
  /** A3：停止后距真底部（px）。 */
  settle: { gap: number | null; limit: number; ok: boolean; measured: boolean }
  /** A4 / C2：生成期底部余量的最小值。 */
  margin: { min: number | null; floor: number; c2: number; ok: boolean; measured: boolean }
  /** B1：用户上滚后 500ms 内的跟随器写入次数。 */
  quiet: { unsticks: number; violations: number; windowMs: number; ok: boolean; measured: boolean }
  /** B2：用户上滚后 1s 内的位置漂移（px）。 */
  drift: { max: number; limit: number; ok: boolean; measured: boolean }
  /** B3：重新吸附只发生在用户往下滚过之后。 */
  restick: { resticks: number; suspicious: number; threshold: number; ok: boolean; measured: boolean }
  /** B4：切会话单次落位，之后 10 帧不再动。 */
  switchLanding: { landings: number; ok: boolean; measured: boolean }
  /** B5：运行期 JS 错误。 */
  errors: { count: number; ok: boolean }
}

/** 各判据的阈值，全部来自 README 的表格（只有 `margin` 的 C2 线是正文里的 120）。 */
const LIMITS = {
  /** A3：距真底部 ≤ 1px。 */
  settle: 1,
  /** B1：用户上滚后的观察窗。 */
  quietMs: 500,
  /** B2：上滚后 1s 内漂移 ≤ 2px。 */
  driftMs: 1000,
  drift: 2,
  /** B3：用户往下滚超过 2px 才允许重新吸附。 */
  restick: 2,
  /** B4：落位之后要求静止的帧数。 */
  landingFrames: 10,
  /** C2：生成期间底部余量。 */
  marginC2: 120,
  /** 证据下限：少于这么多帧直接不算过。 */
  minTicks: 10,
} as const

/** 读一条 tick 的数值字段。 */
function num (entry: ProbeEntry, key: string): number {
  const value = Number(entry[key] ?? 0)
  return Number.isFinite(value) ? value : 0
}

/** 在 [from, from+window) 内找某类条目。 */
function within (entries: ProbeEntry[], from: number, windowMs: number, kind: string): ProbeEntry[] {
  return entries.filter(entry => entry.kind === kind && entry.t >= from && entry.t < from + windowMs)
}

/**
 * 按验收标准检查一份日志。
 *
 * 与 README「滚动跟随的验收标准」逐条对应，**只读这一份日志、只用这一处阈值**：
 * - A1 / C1 move：速度 ≤ `scroll.maxSpeed`（与帧率无关）
 * - A3 settle：落点 ≤ 1px（用户中途接管则视为没测到）
 * - A4 / C2 margin：跟随帧的最小余量 ≥ `minMargin × 0.6`，且 C2 线 ≥ 120
 * - B1 quiet：用户上滚后 500ms 内跟随器写入 0 次
 * - B2 drift：同一窗口之后 1s 内累计漂移 ≤ 2px
 * - B3 restick：重新吸附只发生在用户往下滚过 2px 之后
 * - B4 switchLanding：打了 `session` 标记后单次落位、随后 10 帧不动
 * - B5 errors：日志里 `error` 条目为 0
 *
 * 没测到的判据记进 `unverified`，且**不给 pass**——缺测量不等于通过。
 * @param entries - 探针日志。
 */
export function checkEntries (entries: ProbeEntry[]): CheckResult {
  const ticks = entries.filter(entry => entry.kind === 'tick')
  const unsticks = entries.filter(entry => entry.kind === 'unstick')
  const unverified: string[] = []

  // A1 / C1：速度而不是每帧像素（30fps 走 78px 与 60fps 走 39px 是同一速度）。
  const limit = MOTION.scroll.maxSpeed
  const maxVelocity = ticks.reduce((max, entry) => {
    const dt = num(entry, 'dt')
    if (dt <= 0) return max
    return Math.max(max, (Math.abs(num(entry, 'moved')) / dt) * 1000)
  }, 0)

  // A3：落点只在「最后仍在跟随」时判；用户中途接管后 target 与 top 本来就差一截。
  const lastTick = ticks[ticks.length - 1]
  const lastIndex = lastTick === undefined ? -1 : entries.lastIndexOf(lastTick)
  const takenOver = lastTick !== undefined && (
    num(lastTick, 'stick') === 0
    || entries.slice(lastIndex + 1).some(entry => entry.kind === 'unstick')
  )
  const gap = lastTick === undefined || takenOver
    ? null
    : Math.abs(num(lastTick, 'target') - num(lastTick, 'top'))
  const settleMeasured = gap !== null
  if (!settleMeasured) unverified.push('A3')

  // A4 / C2：跟随帧的最小余量。
  const followed = ticks.filter(entry => num(entry, 'stick') === 1)
  const minMargin = followed.length === 0
    ? null
    : followed.reduce((min, entry) => Math.min(min, num(entry, 'margin')), Number.POSITIVE_INFINITY)
  const marginFloor = MOTION.scroll.minMargin * 0.6
  if (minMargin === null) unverified.push('A4')

  // B1：每次用户上滚之后 500ms 内的跟随器写入。
  let quietViolations = 0
  let driftMax = 0
  for (const unstick of unsticks) {
    const at = unstick.t
    const quietTicks = within(entries, at, LIMITS.quietMs, 'tick')
    if (quietTicks.some(entry => Math.abs(num(entry, 'moved')) >= 1)) quietViolations += 1
    const driftTicks = within(entries, at, LIMITS.driftMs, 'tick')
    const drift = driftTicks.reduce((sum, entry) => sum + Math.abs(num(entry, 'moved')), 0)
    driftMax = Math.max(driftMax, drift)
  }
  const quietMeasured = unsticks.length > 0
  if (!quietMeasured) { unverified.push('B1'); unverified.push('B2') }

  // B3：重新吸附只发生在用户自己往下滚过之后。
  let resticks = 0
  let suspicious = 0
  for (let index = 1; index < entries.length; index += 1) {
    const entry = entries[index]
    const previous = entries[index - 1]
    if (entry === undefined || previous === undefined) continue
    if (entry.kind !== 'scroll' || previous.kind !== 'scroll') continue
    if (Number(previous.stick) === 0 && Number(entry.stick) === 1) {
      resticks += 1
      const written = num(entry, 'w')
      if (num(entry, 'top') <= written + LIMITS.restick) suspicious += 1
    }
  }

  // B4：会话切换标记之后，单次落位 + 随后 10 帧静止。
  const marks = entries.filter(entry => entry.kind === 'session')
  let landings = 0
  let landingOk = true
  let landingMeasured = marks.length > 0
  for (const mark of marks) {
    const after = entries.slice(entries.indexOf(mark) + 1)
    const landingAt = after.findIndex(entry => entry.kind === 'scroll')
    if (landingAt < 0) { landingMeasured = false; continue }
    const frames = after.slice(landingAt).filter(entry => entry.kind === 'tick').slice(0, LIMITS.landingFrames)
    if (frames.length < LIMITS.landingFrames) { landingMeasured = false; continue }
    landings += 1
    if (frames.some(entry => Math.abs(num(entry, 'moved')) > 1)) landingOk = false
  }
  if (!landingMeasured) unverified.push('B4')

  // B5：错误必须有测量来源（install 时挂上的 error / unhandledrejection 监听）。
  const errors = entries.filter(entry => entry.kind === 'error').length

  const enough = ticks.length >= LIMITS.minTicks
  const moveOk = maxVelocity <= limit
  const settleOk = settleMeasured && (gap ?? Number.POSITIVE_INFINITY) <= LIMITS.settle
  const marginOk = minMargin !== null && minMargin >= marginFloor && minMargin >= LIMITS.marginC2
  const quietOk = quietViolations === 0
  const driftOk = driftMax <= LIMITS.drift
  const restickOk = suspicious === 0
  const errorsOk = errors === 0
  const complete = enough && unverified.length === 0
  const pass = complete && moveOk && settleOk && marginOk && quietOk && driftOk && restickOk && landingOk && errorsOk

  return {
    pass,
    complete,
    unverified,
    evidence: { ticks: ticks.length, enough },
    move: { maxVelocity: Math.round(maxVelocity), limit, ok: moveOk },
    settle: { gap: gap === null ? null : Math.round(gap), limit: LIMITS.settle, ok: settleOk, measured: settleMeasured },
    margin: { min: minMargin === null ? null : Math.round(minMargin), floor: Math.round(marginFloor), c2: LIMITS.marginC2, ok: marginOk, measured: minMargin !== null },
    quiet: { unsticks: unsticks.length, violations: quietViolations, windowMs: LIMITS.quietMs, ok: quietOk, measured: quietMeasured },
    drift: { max: Math.round(driftMax), limit: LIMITS.drift, ok: driftOk, measured: quietMeasured },
    restick: { resticks, suspicious, threshold: LIMITS.restick, ok: restickOk, measured: resticks > 0 },
    switchLanding: { landings, ok: landingMeasured ? landingOk : false, measured: landingMeasured },
    errors: { count: errors, ok: errorsOk },
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
export function findProbeViewport (): HTMLElement | null {
  if (typeof document === 'undefined') return null
  const container = document.querySelector('.' + cls.viewport)
  if (!(container instanceof HTMLElement)) return null
  return resolveOwnedScroller({ container }).element
}