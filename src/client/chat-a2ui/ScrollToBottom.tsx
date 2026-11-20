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
import { type FollowFrame } from './scroll-frame'
import { createOwnership, resolveScroller, type Ownership } from './scroll-ownership'
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
}

export interface StickToBottomResult {
  atBottom: boolean
  /** 外层 [data-conversation-scroll] 拥有滚动时 true。 */
  outer: boolean
  scrollToBottom: (behavior?: ScrollBehavior) => void
}

/**
 * 惰性建一个稳定的位移归属句柄：每次渲染都新建会把基准丢掉。
 * @param ref - 保存句柄的可空 ref。
 * @returns 本组件实例唯一的归属句柄。
 */
function ensureOwnership (ref: { current: Ownership | null }): Ownership {
  if (ref.current === null) {
    ref.current = createOwnership({ tolerance: MOTION.scroll.ownershipTolerance })
  }
  return ref.current
}

/** SSR 下 useLayoutEffect 会告警，这里退化到 useEffect。 */
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

export function useStickToBottom<E extends HTMLElement = HTMLElement> ({
  containerRef,
  contentRef,
  revision,
  forceInner = false,
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
  /** 上一帧时刻（只用于探针记录 dt）。 */
  const lastTickAtRef = useRef(0)
  /** 位移归属：记住我们最后写进去的 scrollTop，用来区分「我们的位移」和「用户上滚」。 */
  const ownershipRef = useRef<Ownership | null>(null)
  const ownership = ensureOwnership(ownershipRef)
  /** 用户最近一次自己滚动的时刻：避免在他滚动时做「直接落位」之类的动作。 */
  const userScrollAtRef = useRef(0)
  /** 探针用：最近一次 scrollTop 变化的来源与幅度。 */
  const lastMoveRef = useRef<{ delta: number; source: string }>({ delta: 0, source: '-' })

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
    const element = base === null ? null : resolveScroller({ container: base, forceInner }).element
    if (element === null) return
    const top = element.scrollHeight
    if (behavior === 'auto' || typeof element.scrollTo !== 'function') {
      element.scrollTop = top
      ownership.write(element.scrollTop)
      followRef.current = null
      return
    }
    try {
      element.scrollTo({ top, behavior })
    } catch {
      // 某些环境（jsdom / 旧 WebView）没有平滑滚动实现，退回直接赋值。
      element.scrollTop = top
    }
  }, [containerRef, forceInner, ownership])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    stickRef.current = true
    setAtBottom(true)
    cancelTween()
    const resolved: ScrollBehavior = reducedMotion() ? 'auto' : behavior
    if (resolved !== 'auto') programmaticUntilRef.current = Date.now() + MOTION.scroll.smoothWindowMs
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
   * 推进跟随：一条 rAF 循环，每帧把 scrollTop 往「内容底部 - 余量」挪。
   *
   * 位移上限由核心算法保证（maxSpeed × dt），所以宿主一次投喂多少像素都不会
   * 变成一帧跳过去——900px 的整段到达也只是一段约 0.35s 的滑行。
   */
  const settle = useCallback(function step (): void {
    if (tweenRef.current !== null) return
    const base = containerRef.current
    const element = base === null ? null : resolveScroller({ container: base, forceInner }).element
    if (element === null) return

    const now = (): number => (typeof performance === 'object' ? performance.now() : Date.now())

    const tick = (): void => {
      tweenRef.current = null
      const at = now()
      const viewport = element.clientHeight
      const contentHeight = element.scrollHeight
      const frameMs = lastTickAtRef.current === 0 ? 0 : Math.max(0, at - lastTickAtRef.current)
      lastTickAtRef.current = at

      // 跨度太大（切会话、恢复滚动位置）：直接落位，别慢慢滑半屏。
      const busyUser = Date.now() - userScrollAtRef.current < MOTION.scroll.userScrollWindowMs
      if (!busyUser && element.scrollHeight - element.clientHeight - element.scrollTop > MOTION.scroll.instantAbove) {
        if (stickRef.current) {
          element.scrollTop = element.scrollHeight
          ownership.write(element.scrollTop)
        }
        followRef.current = null
        return
      }

      // 兜底：scroll 事件在某些环境下会被推迟（后台标签、被遮挡的窗口），
      // 所以这里每帧自查一次「位置是不是被别人动过」：实际值与基准（我们最后
      // 写进去的坐标）差得超过容差，就说明是别人动了。
      const actualTop = element.scrollTop
      const verdict = ownership.classify(actualTop)
      if (verdict.source === 'external') {
        lastTopRef.current = actualTop
        probeLog('external', {
          top: Math.round(actualTop),
          delta: Math.round(verdict.delta),
          stick: stickRef.current ? 1 : 0,
        })
        userScrollAtRef.current = Date.now()
        if (verdict.direction === 'up' && stickRef.current) {
          cancelTween()
          setStick(false)
          settle()
          return
        }
      }

      if (!stickRef.current) {
        // 不跟随时也留一条记录：验收要能证明「上滚之后确实有帧在跑、且没写」。
        const idleFrame: FollowFrame = {
          top: Math.round(element.scrollTop),
          content: Math.round(contentHeight),
          margin: 0,
          target: Math.round(Math.max(0, element.scrollHeight - viewport)),
          rate: 0,
          moved: 0,
          dt: Math.round(frameMs),
          stick: 0,
        }
        probeTick(idleFrame)
        return
      }

      const state = followRef.current ?? createFollowState(at, contentHeight, element.scrollTop)
      const result = stepFollow(state, { height: contentHeight, viewport, at, config: MOTION.scroll })
      followRef.current = result.state

      const before = element.scrollTop
      element.scrollTop = result.position
      ownership.write(element.scrollTop)
      const moved = element.scrollTop - before
      if (Math.abs(moved) >= 0.5) lastMoveRef.current = { delta: moved, source: 'loop' }
      const frame: FollowFrame = {
        top: Math.round(element.scrollTop),
        content: Math.round(contentHeight),
        margin: Math.round(result.margin),
        target: Math.round(result.target),
        rate: Math.round(result.rate),
        moved: Math.round(moved),
        dt: Math.round(frameMs),
        stick: 1,
      }
      probeTick(frame)
      probeHud([
        'top ' + Math.round(element.scrollTop) + '  content ' + Math.round(contentHeight) + '  margin ' + Math.round(result.margin),
        'rate ' + Math.round(result.rate) + '  target ' + Math.round(result.target),
        'Δ ' + Math.round(moved) + ' (' + lastMoveRef.current.source + ')',
      ])
      if (result.idle) return
      tweenRef.current = requestAnimationFrame(tick)
    }
    tweenRef.current = requestAnimationFrame(tick)
  }, [containerRef, forceInner, ownership])

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
    const resolved = resolveScroller({ container, forceInner })
    const owner = resolved.element
    if (owner === null) return
    // 只有「滚动容器真的换了」才重置基准。这个 effect 在每次 revision
    // （新消息 / 新 token / 新行）变化时都会重跑——如果每次都把 lastTopRef
    // 改成当前位置，就会把用户刚刚的上滚抹平：external 自查算出 delta=0，
    // 于是不认账、继续把他拽回底部。那正是「自己滚着滚着往上跳一下」。
    if (ownerRef.current !== owner) {
      ownerRef.current = owner
      lastTopRef.current = owner.scrollTop
      // 基准必须是一个真实坐标，不能留空：挂载时 revision effect 可能已经先写过
      // 一次，这里把基准对齐到当前位置，自查才不会永远跳过。
      ownership.write(owner.scrollTop)
      followRef.current = null
      setOuter(resolved.reason === 'outer')
    }

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
      const verdict = ownership.classify(currentTop)
      probeLog('scroll', {
        top: Math.round(currentTop),
        delta: Math.round(delta),
        w: Math.round(ownership.baseline ?? currentTop),
        ours: verdict.source === 'ours' ? 1 : 0,
        stick: stickRef.current ? 1 : 0,
        h: Math.round(owner.scrollHeight),
      })
      if (verdict.source === 'ours') return
      lastMoveRef.current = { delta, source: 'user' }
      userScrollAtRef.current = Date.now()

      const wasSticking = stickRef.current
      const distance = owner.scrollHeight - currentTop - owner.clientHeight
      // 只有「用户自己往下滚回底部」才重新吸附。判据不是事件之间的 delta
      // （每帧自查会把它抹成 0），而是「当前位置在我们最后一次写入的下方」：
      // 浏览器夹边只会往上夹，用户往下滚才会越过基准。
      const movedDownByUser = verdict.direction === 'down'
      if (distance <= STICK_THRESHOLD && movedDownByUser) {
        programmaticUntilRef.current = 0
        setStick(true)
        if (!wasSticking) settle()
        return
      }
      if (distance <= STICK_THRESHOLD) return
      if (Date.now() < programmaticUntilRef.current) return
      // 只有 scrollTop 真的减少（超过容差）才算用户上滚。流式内容变高时，
      // 浏览器滚动锚定会把 scrollTop 往下推（delta > 0），那不是用户意图。
      if (delta < -MOTION.scroll.ownershipTolerance) {
        probeLog('unstick', { by: 'scroll', delta: Math.round(delta) })
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
      programmaticUntilRef.current = Date.now() + MOTION.scroll.yieldWindowMs
      cancelTween()
      setStick(false)
      // 循环还要跑：不跟随时它只负责把占位收回，不碰滚动位置。
      settle()
    }
    const onTouchStart = (): void => {
      probeLog('unstick', { by: 'touch' })
      if (stickRef.current === false) return
      programmaticUntilRef.current = Date.now() + MOTION.scroll.yieldWindowMs
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
  }, [containerRef, contentRef, revision, follow, settle, cancelTween, setStick, forceInner, ownership])

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