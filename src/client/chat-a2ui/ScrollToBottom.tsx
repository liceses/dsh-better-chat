/**
 * 贴底滚动的适配层：把 DOM、rAF、观察器接到跟随状态机上。
 *
 * 决定都在 `follow-controller.ts`（贴不贴底、写多少、什么时候让位）；
 * 这里只做三件事：解析容器、把五个入口接进控制器、把探针与 React state 同步出去。
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cls } from './classes'
import { MOTION } from './motion-config'
import {
  createFollowController,
  STICK_THRESHOLD,
  type FollowController,
  type FollowTarget,
} from './follow-controller'
import { createOwnership, resolveScroller, type Ownership } from './scroll-ownership'
import { probeHud, probeInstall, probeLog, probeLogged, probeTick } from './scroll-probe'
import { cx } from './util'
import { reducedMotion } from './motion'

export { STICK_THRESHOLD }

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

/** SSR 下 useLayoutEffect 会告警，这里退化到 useEffect。 */
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

/** 把元素包成状态机认识的读写面。 */
function targetOf (element: HTMLElement): FollowTarget {
  return {
    readTop: () => element.scrollTop,
    readContent: () => element.scrollHeight,
    readViewport: () => element.clientHeight,
    writeTop: (top: number) => { element.scrollTop = top },
    smoothTo: (top: number, behavior: 'smooth'): boolean => {
      if (typeof element.scrollTo !== 'function') return false
      try {
        element.scrollTo({ top, behavior })
        return true
      } catch {
        // jsdom / 旧 WebView 没有平滑滚动实现，交给调用方退回直接赋值。
        return false
      }
    },
  }
}

/**
 * 贴底滚动：所有判断交给 `createFollowController`，这里只管接线。
 * @param options - 容器 / 内容 / revision / forceInner。
 * @returns 贴底状态、外层标志、以及「回到底部」。
 */
export function useStickToBottom<E extends HTMLElement = HTMLElement> ({
  containerRef,
  contentRef,
  revision,
  forceInner = false,
}: UseStickToBottomOptions<E>): StickToBottomResult {
  const [atBottom, setAtBottom] = useState(true)
  const [outer, setOuter] = useState(false)
  const controllerRef = useRef<FollowController | null>(null)
  const ownerRef = useRef<HTMLElement | null>(null)
  const tweenRef = useRef<number | null>(null)
  const ownershipRef = useRef<Ownership | null>(null)
  /** 挂载后第一次贴底直接落位（打开会话不要从顶部一路滑下来），之后都走补间。 */
  const primedRef = useRef(false)
  /** 探针日志用的上一次位置（与状态机的 lastTop 无关，只为了让 scroll 记录带 delta）。 */
  const logTopRef = useRef(0)

  const resolveOwner = useCallback((): { element: HTMLElement | null; outer: boolean } => {
    const base = containerRef.current
    if (base === null) return { element: null, outer: false }
    const resolved = resolveScroller({ container: base, forceInner })
    return { element: resolved.element, outer: resolved.reason === 'outer' }
  }, [containerRef, forceInner])

  /** 取（必要时建）当前容器对应的控制器。 */
  const ensureController = useCallback((): FollowController | null => {
    const resolved = resolveOwner()
    if (resolved.element === null) return null
    if (ownershipRef.current === null) {
      ownershipRef.current = createOwnership({ tolerance: MOTION.scroll.ownershipTolerance })
    }
    const existing = controllerRef.current
    if (existing !== null && ownerRef.current === resolved.element) return existing
    const ownership = ownershipRef.current
    const controller = createFollowController(targetOf(resolved.element), {
      ownership,
      onStickChange: (stick) => { setAtBottom(stick) },
      onFrame: (frame) => { probeTick(frame) },
      onExternal: (info) => {
        probeLog('external', {
          top: Math.round(info.top),
          delta: Math.round(info.delta),
          stick: info.stick ? 1 : 0,
        })
      },
      onUnstick: (info) => {
        probeLog('unstick', info.delta === undefined
          ? { by: info.by }
          : { by: info.by, delta: Math.round(info.delta) })
      },
    })
    ownerRef.current = resolved.element
    setOuter(resolved.outer)
    controller.attach()
    controllerRef.current = controller
    return controller
  }, [resolveOwner])

  /** 下一帧推进。 */
  const runFrame = useCallback((): void => {
    tweenRef.current = null
    const controller = controllerRef.current
    if (controller === null) return
    const more = controller.step()
    const owner = ownerRef.current
    if (owner !== null) {
      probeHud([
        'top ' + Math.round(owner.scrollTop) + '  content ' + Math.round(owner.scrollHeight),
        'stick ' + (controller.sticking ? 'on' : 'off'),
      ])
    }
    if (!more) return
    if (typeof requestAnimationFrame !== 'function') return
    tweenRef.current = requestAnimationFrame(runFrame)
  }, [])

  const scheduleStep = useCallback((): void => {
    if (typeof requestAnimationFrame !== 'function') return
    if (tweenRef.current !== null) return
    tweenRef.current = requestAnimationFrame(runFrame)
  }, [runFrame])

  const cancelTween = useCallback((): void => {
    if (tweenRef.current !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(tweenRef.current)
    }
    tweenRef.current = null
  }, [])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth'): void => {
    const controller = ensureController()
    if (controller === null) return
    primedRef.current = true
    cancelTween()
    const resolved: ScrollBehavior = reducedMotion() ? 'auto' : behavior
    controller.jump(resolved)
    scheduleStep()
  }, [ensureController, cancelTween, scheduleStep])

  // revision 变化（新消息 / 新 token）时：贴底就立即跟到底；挂载时同样执行一次。
  useIsoLayoutEffect(() => {
    const controller = ensureController()
    if (controller === null) return
    if (!controller.sticking) return
    if (!primedRef.current) {
      // 首次（打开会话 / 挂载）直接落位；之后新增行、新 token 都补间过去。
      primedRef.current = true
      controller.jump('auto')
      return
    }
    scheduleStep()
  }, [revision, ensureController, scheduleStep])

  useIsoLayoutEffect(() => {
    probeInstall()
    const controller = ensureController()
    if (controller === null) return
    const owner = ownerRef.current
    if (owner === null) return
    const content = contentRef.current
    logTopRef.current = owner.scrollTop

    const scheduleFollow = (): void => { scheduleStep() }

    const onScroll = (): void => {
      const top = owner.scrollTop
      const delta = top - logTopRef.current
      logTopRef.current = top
      const baseline = ownershipRef.current?.baseline ?? top
      const verdict = ownershipRef.current?.classify(top)
      probeLog('scroll', {
        top: Math.round(top),
        delta: Math.round(delta),
        w: Math.round(baseline),
        ours: verdict?.source === 'ours' ? 1 : 0,
        stick: controller.sticking ? 1 : 0,
        h: Math.round(owner.scrollHeight),
      })
      const wasSticking = controller.sticking
      controller.onScroll()
      // 重新吸附：状态机把 stick 翻回 true 之后，循环要立刻接上。
      if (!wasSticking && controller.sticking) scheduleStep()
    }

    // 滚轮 / 触摸一旦朝上，立刻让位：等 scroll 事件再判断会晚一帧。
    const onWheel = (event: WheelEvent): void => {
      if (event.deltaY >= 0) return
      controller.onIntent('wheel', event.deltaY)
      scheduleStep()
    }
    const onTouchStart = (): void => {
      controller.onIntent('touch')
      scheduleStep()
    }

    owner.addEventListener('scroll', onScroll, { passive: true })
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
    mutation?.observe(content ?? owner, {
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
    }
  }, [containerRef, contentRef, revision, ensureController, scheduleStep, cancelTween])

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