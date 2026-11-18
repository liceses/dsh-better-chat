/**
 * 贴底滚动（预开余量 + 弹簧）。
 *
 * 不再是「贴到最底部再被顶上去」，而是：
 * - 用生成速度算出底部该留多少余量（`scroll.lead × 速度`，上限 `headroomMax`），
 *   新内容落地时离下沿还有一截，读者不会一直追着屏幕边缘；
 * - 余量在生成期间只涨不缩，最后一句话结束后才慢慢收回；
 * - 位置用弹簧积分推进，有速度有阻尼，观感是「滑」而不是「跳」。
 *
 * 仍然尊重用户：一旦往上滚就停止跟随，滚回目标 40px 以内再恢复。
 * 用 MutationObserver（文本/子节点）+ ResizeObserver（尺寸）+ revision 三路触发，
 * 但只有一条 rAF 循环在推进。
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cls } from './classes'
import { MOTION } from './motion-config'
import { createFollowState, stepFollow, type FollowState } from './scroll-follow'
import { probeHud, probeInstall, probeLog, probeLogged, probeTick } from './scroll-probe'
import { cx } from './util'
import { reducedMotion } from './motion'

/** 距离底部多少像素以内算「贴底」。 */
export const STICK_THRESHOLD = 40

/** 只需要一个可读的 current，避免把 React 的 RefObject 类型写死。 */
export interface StickToBottomRef<E extends HTMLElement = HTMLElement> {
  readonly current: E | null
}

export interface UseStickToBottomOptions<E extends HTMLElement = HTMLElement> {
  containerRef: StickToBottomRef<E>
  contentRef: StickToBottomRef<E>
  revision?: unknown
  /** 强制使用本视图自己的滚动容器，忽略外层原生滚动体。 */
  forceInner?: boolean
  /** 消息流末尾的可变占位：跟随器每帧写它的高度（不触发 React 重渲染）。 */
  tailRef?: StickToBottomRef<HTMLElement>
}

export interface StickToBottomResult {
  atBottom: boolean
  /** 外层 [data-conversation-scroll] 拥有滚动时 true。 */
  outer: boolean
  scrollToBottom: (behavior?: ScrollBehavior) => void
}

/** 原生会话壳在消息流外层提供滚动容器；有它时不要再套一层内部滚动。 */
function resolveOwner (container: HTMLElement | null, forceInner = false): HTMLElement | null {
  if (container === null) return null
  if (forceInner) return container
  const outer = container.closest('[data-conversation-scroll]')
  return outer instanceof HTMLElement ? outer : container
}

/** SSR 下 useLayoutEffect 会告警，这里退化到 useEffect。 */
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

export function useStickToBottom<E extends HTMLElement = HTMLElement> ({
  containerRef,
  contentRef,
  revision,
  forceInner = false,
  tailRef,
}: UseStickToBottomOptions<E>): StickToBottomResult {
  const [atBottom, setAtBottom] = useState(true)
  const [outer, setOuter] = useState(false)
  const stickRef = useRef(true)
  const ownerRef = useRef<HTMLElement | null>(null)
  const frameRef = useRef<number | null>(null)
  /** 程序化平滑滚动的时间窗，窗口内的位移不算「用户上滚」。 */
  const programmaticUntilRef = useRef(0)
  /** 跟随循环的帧句柄。 */
  const tweenRef = useRef<number | null>(null)
  /** 弹簧状态（位置 / 速度 / 余量）。 */
  const followRef = useRef<FollowState | null>(null)
  /** 上一次由程序写进去的 scrollTop：用来区分「我们的位移」和「用户上滚」。 */
  const writtenRef = useRef(-1)
  /** 用户最近一次自己滚动的时刻：避免在他滚动时做「直接落位」之类的动作。 */
  const userScrollAtRef = useRef(0)
  /** 探针用：最近一次 scrollTop 变化的来源与幅度。 */
  const lastMoveRef = useRef<{ delta: number; source: string }>({ delta: 0, source: '-' })
  /** 当前写进尾部占位的高度（px）。 */
  const spaceRef = useRef(0)

  /** 把余量写进占位元素（直接改 style，不经过 React）。 */
  const applySpace = useCallback((next: number): void => {
    const previous = spaceRef.current
    spaceRef.current = next
    if (Math.abs(next - previous) >= 0.5) probeLog('space', { from: Math.round(previous), to: Math.round(next) })
    const tail = tailRef?.current ?? null
    if (tail === null) return
    tail.style.height = (next > 0.5 ? next.toFixed(1) : '0') + 'px'
  }, [tailRef])
  /** 挂载后第一次贴底直接落位（打开会话不要从顶部一路滑下来），之后都走补间。 */
  const primedRef = useRef(false)
  /** 上一次 scroll 事件的位置，用来区分用户上滚和内容增长引起的滚动锚定。 */
  const lastTopRef = useRef(0)

  const setStick = useCallback((next: boolean) => {
    if (stickRef.current === next) return
    stickRef.current = next
    setAtBottom(next)
  }, [])

  const follow = useCallback((behavior: ScrollBehavior = 'auto') => {
    // 动态解析宿主滚动容器：effect 的注册顺序不该影响「跟到底」命中谁。
    const base = containerRef.current
    const element = base === null ? null : resolveOwner(base, forceInner)
    if (element === null) return
    applySpace(0)
    const top = element.scrollHeight
    if (behavior === 'auto' || typeof element.scrollTo !== 'function') {
      element.scrollTop = top
      writtenRef.current = element.scrollTop
      followRef.current = null
      return
    }
    try {
      element.scrollTo({ top, behavior })
    } catch {
      // 某些环境（jsdom / 旧 WebView）没有平滑滚动实现，退回直接赋值。
      element.scrollTop = top
    }
  }, [containerRef, forceInner, applySpace])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    stickRef.current = true
    setAtBottom(true)
    cancelTween()
    const resolved: ScrollBehavior = reducedMotion() ? 'auto' : behavior
    if (resolved !== 'auto') programmaticUntilRef.current = Date.now() + 900
    follow(resolved)
  }, [follow])

  const cancelTween = useCallback(() => {
    if (tweenRef.current !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(tweenRef.current)
    }
    tweenRef.current = null
    followRef.current = null
  }, [])

  /**
   * 推进跟随：一条 rAF 循环，每帧把弹簧往「内容底部 - 余量」推。
   *
   * 不持有 from/end 快照，也不按固定时长走曲线：新内容到达只是改变目标，
   * 位置与速度是连续的，所以观感是持续滑动而不是一段段跳。
   */
  const settle = useCallback(function step (): void {
    // 注意：这里**不**因为「不贴底」就直接返回——占位（余量）必须能收回去，
    // 否则用户上滚之后末尾会永远空出一截。是否移动滚动位置在 tick 里判断。
    if (tweenRef.current !== null) return
    const base = containerRef.current
    const element = base === null ? null : resolveOwner(base, forceInner)
    if (element === null) return

    const now = (): number => (typeof performance === 'object' ? performance.now() : Date.now())

    const tick = (): void => {
      tweenRef.current = null
      const sticking = stickRef.current
      const at = now()
      const viewport = element.clientHeight
      const applied = spaceRef.current
      // scrollHeight 里已经含了尾部占位，扣掉才是「内容高度」。
      const contentHeight = Math.max(0, element.scrollHeight - applied)

      // 跨度太大（切会话、恢复滚动位置）：直接落位，别慢慢滑半屏。
      const busyUser = Date.now() - userScrollAtRef.current < 600
      if (!busyUser && element.scrollHeight - element.clientHeight - element.scrollTop > MOTION.scroll.instantAbove) {
        applySpace(0)
        if (sticking) {
          element.scrollTop = element.scrollHeight
          writtenRef.current = element.scrollTop
        }
        followRef.current = null
        return
      }

      // 兜底：scroll 事件在某些环境下会被推迟（后台标签、被遮挡的窗口），
      // 所以这里每帧自查一次「位置是不是被别人动过」。自己写的值记在 writtenRef，
      // 只要实际值和它差 ≥2px，就说明是用户（或浏览器夹边）动了。
      const expectedTop = writtenRef.current
      const actualTop = element.scrollTop
      if (expectedTop >= 0 && Math.abs(actualTop - expectedTop) >= 2) {
        const delta = actualTop - lastTopRef.current
        lastTopRef.current = actualTop
        probeLog('external', { top: Math.round(actualTop), delta: Math.round(delta), stick: sticking ? 1 : 0 })
        userScrollAtRef.current = Date.now()
        if (delta < -2 && sticking) {
          cancelTween()
          setStick(false)
          settle()
          return
        }
      }

      const state = followRef.current ?? createFollowState(at, contentHeight, applied)
      const result = stepFollow(state, { height: contentHeight, viewport, at, config: MOTION.scroll })
      followRef.current = result.state
      let nextSpace = result.space
      if (!sticking) {
        // 不跟随时只负责把占位收回去；但收缩量不能超过「当前位置到真底部」的
        // 距离，否则浏览器会把 scrollTop 夹一下——那就是一次可见的跳动。
        const gap = Math.max(0, element.scrollHeight - element.scrollTop - element.clientHeight)
        nextSpace = Math.min(nextSpace, gap)
      }
      applySpace(nextSpace)
      const before = element.scrollTop
      if (sticking) {
        // 每帧都写、每帧都记：这样 writtenRef 永远是「我们最后一次摆的位置」，
        // 下一帧的自查才有基准（占位收缩时浏览器会夹一次 scrollTop）。
        element.scrollTop = result.scrollTop
        writtenRef.current = element.scrollTop
      }
      const moved = element.scrollTop - before
      if (Math.abs(moved) >= 0.5) lastMoveRef.current = { delta: moved, source: 'loop' }
      probeTick({
        top: Math.round(element.scrollTop),
        content: Math.round(contentHeight),
        space: Math.round(result.space),
        vel: Math.round(result.state.velocity),
        pace: Math.round(result.pace),
        stick: sticking ? 1 : 0,
        moved: Math.round(moved),
      })
      probeHud([
        'top ' + Math.round(element.scrollTop) + '  content ' + Math.round(contentHeight) + '  tail ' + Math.round(result.space),
        'vel ' + Math.round(result.state.velocity) + '  pace ' + Math.round(result.pace) + '  stick ' + (sticking ? 1 : 0),
        'Δ ' + Math.round(moved) + ' (' + lastMoveRef.current.source + ')',
      ])
      if (result.idle) {
        if (spaceRef.current > 0.5) applySpace(0)
        return
      }
      tweenRef.current = requestAnimationFrame(tick)
    }
    tweenRef.current = requestAnimationFrame(tick)
  }, [containerRef, forceInner, applySpace])

  // revision 变化（新消息 / 新 token）时：贴底就立即跟到底；挂载时同样执行一次。
  useIsoLayoutEffect(() => {
    if (!stickRef.current) return
    // 首次（打开会话 / 挂载）直接落位；之后新增行、新 token 都补间过去，
    // 否则「新行出现」这一下的整段高度会一次性顶上来，看着就是跳一下。
    if (!primedRef.current) {
      primedRef.current = true
      follow()
      return
    }
    settle()
  }, [revision, follow, settle])

  useIsoLayoutEffect(() => {
    probeInstall()
    const container = containerRef.current
    if (container === null) return
    const content = contentRef.current
    const owner = resolveOwner(container, forceInner)
    if (owner === null) return
    ownerRef.current = owner
    lastTopRef.current = owner.scrollTop
    setOuter(owner !== container)

    const scheduleFollow = () => {
      if (typeof requestAnimationFrame !== 'function') {
        if (stickRef.current) follow()
        return
      }
      if (frameRef.current !== null) return
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null
        settle()
      })
    }

    const onScroll = () => {
      const currentTop = owner.scrollTop
      const delta = currentTop - lastTopRef.current
      lastTopRef.current = currentTop
      // 只把自己写进去的那个值当成「程序位移」；不能因为跟随循环正在跑就忽略
      // 所有滚动事件——那会把用户的上滚吞掉，然后他被强行拉回底部（看起来就是
      // 「自己滚着滚着突然往上一跳」）。
      const ours = writtenRef.current >= 0 && Math.abs(currentTop - writtenRef.current) < 4
      probeLog('scroll', {
        top: Math.round(currentTop),
        delta: Math.round(delta),
        ours: ours ? 1 : 0,
        stick: stickRef.current ? 1 : 0,
        h: Math.round(owner.scrollHeight),
      })
      if (ours) return
      lastMoveRef.current = { delta, source: 'user' }
      userScrollAtRef.current = Date.now()

      const wasSticking = stickRef.current
      // 距离要按真正滚动的那一层算。余量现在是**布局里的占位**而不是滚动偏移，
      // 所以这里不用扣：贴底时距离本来就是 0。
      const distance = owner.scrollHeight - currentTop - owner.clientHeight
      // 只有「用户自己往下滚回底部」才重新吸附。我们清占位时浏览器会夹一次
      // scrollTop，那会让距离瞬间变 0；如果按距离吸附，就会立刻又被拉到底部，
      // 用户看到的就是「滚一下、被弹回去」。
      if (distance <= STICK_THRESHOLD && delta > 2) {
        programmaticUntilRef.current = 0
        setStick(true)
        if (!wasSticking) settle()
        return
      }
      if (distance <= STICK_THRESHOLD) return
      if (Date.now() < programmaticUntilRef.current) return
      // 只有 scrollTop 真的减少才算用户上滚。流式内容变高时，浏览器滚动锚定
      // 会把 scrollTop 往下推（delta > 0），那不是用户意图，不能停止跟随。
      if (delta < -2) {
        programmaticUntilRef.current = 0
        cancelTween()
        setStick(false)
        settle()
      }
    }

    owner.addEventListener('scroll', onScroll, { passive: true })

    // 滚轮/触摸一旦朝上，立刻让位：等 scroll 事件再判断会晚一帧，
    // 那一帧里跟随循环可能已经把他拉回去了。
    const onWheel = (event: WheelEvent): void => {
      if (event.deltaY >= 0) return
      probeLog('unstick', { by: 'wheel', delta: Math.round(event.deltaY) })
      if (stickRef.current === false) return
      programmaticUntilRef.current = Date.now() + 200
      cancelTween()
      setStick(false)
      // 循环还要跑：不跟随时它只负责把占位收回，不碰滚动位置。
      settle()
    }
    const onTouchStart = (): void => {
      probeLog('unstick', { by: 'touch' })
      if (stickRef.current === false) return
      programmaticUntilRef.current = Date.now() + 200
      cancelTween()
      setStick(false)
      settle()
    }
    owner.addEventListener('wheel', onWheel, { passive: true })
    owner.addEventListener('touchstart', onTouchStart, { passive: true })

    const mutation = typeof MutationObserver === 'function'
      ? new MutationObserver((records) => {
          if (probeLogged()) {
            const flow = contentRef.current
            const rows = flow === null ? null : flow.querySelectorAll('.caui-row')
            const lastRow = rows === null || rows.length === 0 ? null : (rows[rows.length - 1] ?? null)
            probeLog('mut', {
              n: records.length,
              h: Math.round(owner.scrollHeight),
              top: Math.round(owner.scrollTop),
              rows: rows === null ? null : rows.length,
              lastH: lastRow === null ? null : Math.round(lastRow.getBoundingClientRect().height),
            })
          }
          scheduleFollow()
        })
      : null
    mutation?.observe(content ?? container, {
      childList: true,
      characterData: true,
      subtree: true,
    })

    const resize = typeof ResizeObserver === 'function'
      ? new ResizeObserver(() => scheduleFollow())
      : null
    if (resize !== null) {
      resize.observe(owner)
      if (content !== null) resize.observe(content)
    }

    return () => {
      owner.removeEventListener('scroll', onScroll)
      owner.removeEventListener('wheel', onWheel)
      owner.removeEventListener('touchstart', onTouchStart)
      cancelTween()
      mutation?.disconnect()
      resize?.disconnect()
      if (frameRef.current !== null) {
        if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }
    // revision 变化时重挂一次：容器若是后挂载的（空态 → 消息流），也能接上观察器。
  }, [containerRef, contentRef, revision, follow, settle, cancelTween, applySpace, setStick, forceInner])

  return { atBottom, outer, scrollToBottom }
}

export interface ScrollToBottomButtonProps {
  atBottom: boolean
  onScrollToBottom: () => void
}

/** 回到底部的悬浮按钮：贴底时淡出并移出 tab 顺序（CSS visibility 控制）。 */
export function ScrollToBottomButton ({ atBottom, onScrollToBottom }: ScrollToBottomButtonProps) {
  return (
    <button
      type="button"
      className={cx(cls.scrollButton, !atBottom && cls.scrollButtonVisible)}
      onClick={onScrollToBottom}
      aria-label="回到底部"
      title="回到底部"
    >
      <svg
        viewBox="0 0 16 16"
        width="16"
        height="16"
        aria-hidden="true"
        focusable="false"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 3.5v8M4.6 8.4 8 11.8l3.4-3.4" />
      </svg>
    </button>
  )
}