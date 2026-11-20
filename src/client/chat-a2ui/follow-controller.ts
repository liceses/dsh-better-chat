/**
 * 跟随状态机：把「贴不贴底、写多少、什么时候让位」收成一个有名字的对象。
 *
 * 以前这些散在 `ScrollToBottom.tsx` 的八个 ref 里（stick / follow / lastTop /
 * userScrollAt / programmaticUntil / primed / owner / lastMove），谁也说不清
 * 「现在到底是谁说了算」。现在它们合成一个状态机，**五个入口都只问它**：
 * 循环（step）、滚动事件（onScroll）、滚轮（onIntent）、触摸（onIntent）、
 * 回到底部（jump）。
 *
 * 与 DOM 无关：容器通过 `FollowTarget` 注入，时间与观测通过回调导出，
 * 所以它可以脱离 React 与浏览器单测。
 */

import { MOTION } from './motion-config'
import { createFollowState, stepFollow, type FollowState } from './scroll-follow'
import type { FollowFrame } from './scroll-frame'
import type { Ownership } from './scroll-ownership'

/** 距离底部多少像素以内算「贴底」。 */
export const STICK_THRESHOLD = 40

/** 滚动容器的只读面 + 写入口；由适配器（hook）实现。 */
export interface FollowTarget {
  /** 当前 scrollTop。 */
  readTop: () => number
  /** 内容总高度（scrollHeight）。 */
  readContent: () => number
  /** 视口高度（clientHeight）。 */
  readViewport: () => number
  /** 直接写 scrollTop。 */
  writeTop: (top: number) => void
  /** 平滑滚动；环境不支持时返回 false，由调用方退回直接赋值。 */
  smoothTo?: (top: number, behavior: 'smooth') => boolean
}

/** 用户意图的种类（让位时记录用）。 */
export type IntentKind = 'wheel' | 'touch'

/** 让位原因：滚动事件、滚轮、触摸。 */
export type UnstickReason = 'scroll' | IntentKind

export interface FollowControllerOptions {
  /** `motion.config.json` 的 `scroll` 一节。 */
  config?: typeof MOTION.scroll
  /** 位移归属句柄（由调用方持有，保证跨渲染稳定）。 */
  ownership: Ownership
  /** 贴底状态变化（组件用它同步 React state）。 */
  onStickChange?: (stick: boolean) => void
  /** 跟随帧（探针）。 */
  onFrame?: (frame: FollowFrame) => void
  /** 每帧自查发现「位置被别人动过」。 */
  onExternal?: (info: { top: number; delta: number; stick: boolean; direction: 'up' | 'down' | 'none' }) => void
  /** 停止跟随（让位）。 */
  onUnstick?: (info: { by: UnstickReason; delta?: number }) => void
  /** 时间源；默认 performance.now。 */
  now?: () => number
}

/** 一个控制器实例：所有决定都从这里出。 */
export interface FollowController {
  /** 当前是否贴底。 */
  readonly sticking: boolean
  /** 直接落位 / 平滑滚到底，并登记基准。 */
  jump: (behavior?: ScrollBehavior) => void
  /** 推进一帧；返回是否还需要下一帧。 */
  step: () => boolean
  /** scroll 事件入口。 */
  onScroll: () => void
  /** 滚轮 / 触摸入口。 */
  onIntent: (kind: IntentKind, deltaY?: number) => void
  /** 容器换了（挂载、切到外层滚动）：重置基准，别把用户的上滚抹平。 */
  attach: () => void
  /** 外部问「是不是外层在滚」。 */
  readonly outer: boolean
  /** 外部复位（卸载 / 重新挂载）。 */
  reset: () => void
}

/** 默认时钟：帧与时间窗用同一个，避免两套时基互相打架。 */
function defaultNow (): number {
  return typeof performance === 'object' ? performance.now() : Date.now()
}

/**
 * 建一个跟随状态机。
 * @param target - 滚动容器的读写面。
 * @param options - 配置、归属句柄与观测回调。
 * @returns 控制器；调用方负责把事件接进来、把 `step()` 放进 rAF。
 */
export function createFollowController (target: FollowTarget, options: FollowControllerOptions): FollowController {
  const config = options.config ?? MOTION.scroll
  const now = options.now ?? defaultNow
  const ownership = options.ownership

  let stick = true
  let outer = false
  let follow: FollowState | null = null
  let lastTickAt = 0
  /** 用户最近一次自己滚动的时刻：这期间不做「直接落位」。 */
  let userScrollAt = 0
  /** 平滑滚动的抑制窗：窗口内的位移不算用户上滚。 */
  let programmaticUntil = 0
  /** 上一次看到的位置（scroll 事件的 delta 来源）。 */
  let lastTop: number | null = null

  const setStick = (next: boolean): void => {
    if (stick === next) return
    stick = next
    options.onStickChange?.(next)
  }

  /** 取消进行中的补间（位置留在原地，由下一帧重新决定）。 */
  const cancelTween = (): void => { follow = null }

  const writeTop = (top: number): void => {
    target.writeTop(top)
    // 每次写入都要登记基准，否则下一次自查会把我们自己的位移当成「别人动的」。
    ownership.write(target.readTop())
  }

  const jump = (behavior: ScrollBehavior = 'auto'): void => {
    setStick(true)
    cancelTween()
    const content = target.readContent()
    if (behavior === 'smooth' && typeof target.smoothTo === 'function') {
      programmaticUntil = now() + config.smoothWindowMs
      // 平滑分支同样要登记基准：浏览器自己走完之后，位置会落在 content 附近。
      if (!target.smoothTo(content, 'smooth')) writeTop(content)
      else ownership.write(target.readTop())
      return
    }
    writeTop(content)
  }

  const attach = (): void => {
    lastTop = target.readTop()
    ownership.write(lastTop)
    cancelTween()
    userScrollAt = 0
    programmaticUntil = 0
  }

  const reset = (): void => {
    cancelTween()
    lastTickAt = 0
    lastTop = null
    userScrollAt = 0
    programmaticUntil = 0
    setStick(true)
  }

  /** 每帧：算 + 写。返回 false 表示收敛，可以不排下一帧。 */
  const step = (): boolean => {
    const at = now()
    const viewport = target.readViewport()
    const content = target.readContent()
    const frameMs = lastTickAt === 0 ? 0 : Math.max(0, at - lastTickAt)
    lastTickAt = at

    // 跨度太大（切会话、恢复滚动位置）：直接落位，别慢慢滑半屏。
    const busyUser = at - userScrollAt < config.userScrollWindowMs
    if (!busyUser && content - viewport - target.readTop() > config.instantAbove) {
      if (stick) writeTop(content)
      cancelTween()
      return false
    }

    // 兜底自查：scroll 事件在后台标签里会被推迟，所以每帧也问一次「位置是不是被别人动过」。
    const actualTop = target.readTop()
    const verdict = ownership.classify(actualTop)
    if (verdict.source === 'external') {
      lastTop = actualTop
      userScrollAt = at
      options.onExternal?.({ top: actualTop, delta: verdict.delta, stick, direction: verdict.direction })
      if (verdict.direction === 'up' && stick) {
        cancelTween()
        options.onUnstick?.({ by: 'scroll', delta: verdict.delta })
        setStick(false)
        return true
      }
    }

    if (!stick) {
      options.onFrame?.({
        top: Math.round(actualTop),
        content: Math.round(content),
        margin: 0,
        target: Math.round(Math.max(0, content - viewport)),
        rate: 0,
        moved: 0,
        dt: Math.round(frameMs),
        stick: 0,
      })
      return false
    }

    const state = follow ?? createFollowState(at, content, actualTop)
    const result = stepFollow(state, { height: content, viewport, at, config })
    follow = result.state

    const before = target.readTop()
    target.writeTop(result.position)
    ownership.write(target.readTop())
    const moved = target.readTop() - before
    options.onFrame?.({
      top: Math.round(target.readTop()),
      content: Math.round(content),
      margin: Math.round(result.margin),
      target: Math.round(result.target),
      rate: Math.round(result.rate),
      moved: Math.round(moved),
      dt: Math.round(frameMs),
      stick: 1,
    })
    return !result.idle
  }

  const onIntent = (kind: IntentKind, deltaY = 0): void => {
    options.onUnstick?.({ by: kind, delta: deltaY })
    if (!stick) return
    programmaticUntil = now() + config.yieldWindowMs
    cancelTween()
    setStick(false)
  }

  const onScroll = (): void => {
    const currentTop = target.readTop()
    const delta = lastTop === null ? 0 : currentTop - lastTop
    lastTop = currentTop
    const verdict = ownership.classify(currentTop)
    if (verdict.source === 'ours') return
    userScrollAt = now()
    const content = target.readContent()
    const viewport = target.readViewport()
    const distance = content - currentTop - viewport
    const wasSticking = stick

    // 只有「用户自己往下滚」才重新吸附：浏览器夹边只会往上夹，往下越过基准只可能是用户。
    if (distance <= STICK_THRESHOLD && verdict.direction === 'down') {
      programmaticUntil = 0
      setStick(true)
      if (!wasSticking) return
    }
    if (distance <= STICK_THRESHOLD) return
    if (now() < programmaticUntil) return
    // 内容变高时浏览器滚动锚定会把 scrollTop 往下推，那不是用户意图。
    if (delta < -config.ownershipTolerance) {
      options.onUnstick?.({ by: 'scroll', delta })
      programmaticUntil = 0
      cancelTween()
      setStick(false)
    }
  }

  return {
    get sticking () { return stick },
    get outer () { return outer },
    jump,
    step,
    onScroll,
    onIntent,
    attach,
    reset,
  }
}
