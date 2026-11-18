/**
 * 贴底滚动。
 *
 * 聊天流的通用需求：新消息或流式 token 到达时，如果用户本来就在底部，
 * 就继续跟到底；用户一旦往上滚就停止跟随，滚回底部 40px 以内再恢复。
 * 用 MutationObserver（文本与子节点变化）+ ResizeObserver（尺寸变化）双保险，
 * 并用 requestAnimationFrame 合并同一帧内的多次触发。
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cls } from './classes'
import { MOTION } from './motion-config'
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
}: UseStickToBottomOptions<E>): StickToBottomResult {
  const [atBottom, setAtBottom] = useState(true)
  const [outer, setOuter] = useState(false)
  const stickRef = useRef(true)
  const ownerRef = useRef<HTMLElement | null>(null)
  const frameRef = useRef<number | null>(null)
  /** 程序化平滑滚动的时间窗，窗口内的位移不算「用户上滚」。 */
  const programmaticUntilRef = useRef(0)
  /** 贴底补间的帧句柄。 */
  const tweenRef = useRef<number | null>(null)
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
    const top = element.scrollHeight
    if (behavior === 'auto' || typeof element.scrollTo !== 'function') {
      element.scrollTop = top
      return
    }
    try {
      element.scrollTo({ top, behavior })
    } catch {
      // 某些环境（jsdom / 旧 WebView）没有平滑滚动实现，退回直接赋值。
      element.scrollTop = top
    }
  }, [containerRef, forceInner])

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    stickRef.current = true
    setAtBottom(true)
    cancelTween()
    const resolved: ScrollBehavior = reducedMotion() ? 'auto' : behavior
    if (resolved !== 'auto') programmaticUntilRef.current = Date.now() + 900
    follow(resolved)
  }, [follow])

  const cancelTween = useCallback(() => {
    if (tweenRef.current === null) return
    if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(tweenRef.current)
    tweenRef.current = null
  }, [])

  /**
   * 贴底的平滑版：分几帧挪到目标位置，而不是一次 scrollTop = scrollHeight。
   *
   * 宿主把助手正文按整段提交，一段常常三四百像素高；一次落位就是肉眼可见的
   * 整屏跳跃。这里每帧最多走 remaining*0.35（12~220px），大跨度（切换会话、
   * 重新贴底）仍然直接落位，免得慢慢滑半屏。
   */
  const settle = useCallback(function step (): void {
    if (!stickRef.current) return
    // 已经有一条补间在跑就让它继续（每一步都会重新读 scrollHeight），
    // 否则 MutationObserver 和 revision 各起一条链，速度翻倍。
    if (tweenRef.current !== null) return
    const base = containerRef.current
    const element = base === null ? null : resolveOwner(base, forceInner)
    if (element === null) return

    const target = element.scrollHeight - element.clientHeight
    const from = element.scrollTop
    const distance = target - from
    if (distance <= 1) {
      element.scrollTop = target
      return
    }
    // 跨度太大（切会话、恢复滚动位置）就落位，别慢慢滑半屏。
    if (distance > MOTION.scroll.instantAbove) {
      element.scrollTop = target
      return
    }

    // 时长跟距离挂钩、按真实时间推进：帧率高低不影响「多久滑完」，
    // 大段落（宿主一次能提交近一屏）才会有明确的滑行感。
    const { duration, maxDuration } = MOTION.scroll
    const total = Math.min(maxDuration, duration * Math.min(2, Math.max(0.6, distance / 320)))
    const startedAt = typeof performance === 'object' ? performance.now() : Date.now()
    const now = (): number => (typeof performance === 'object' ? performance.now() : Date.now())

    const tick = (): void => {
      tweenRef.current = null
      if (!stickRef.current) return
      const elapsed = now() - startedAt
      const progress = Math.min(1, elapsed / (total * 1000))
      const eased = 1 - Math.pow(1 - progress, 3)
      const end = element.scrollHeight - element.clientHeight
      const next = from + (end - from) * eased
      element.scrollTop = Math.min(next, end)
      if (progress >= 1 && end - element.scrollTop <= 1) {
        element.scrollTop = end
        return
      }
      // 进度走完但内容又长了一截，就接着滑（相邻两段补间看起来是连续的）
      tweenRef.current = requestAnimationFrame(progress >= 1 ? step : tick)
    }
    tweenRef.current = requestAnimationFrame(tick)
  }, [containerRef, forceInner])

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
    const container = containerRef.current
    if (container === null) return
    const content = contentRef.current
    const owner = resolveOwner(container, forceInner)
    if (owner === null) return
    ownerRef.current = owner
    lastTopRef.current = owner.scrollTop
    setOuter(owner !== container)

    const scheduleFollow = () => {
      if (!stickRef.current) return
      if (typeof requestAnimationFrame !== 'function') {
        follow()
        return
      }
      if (frameRef.current !== null) return
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null
        if (stickRef.current) settle()
      })
    }

    const onScroll = () => {
      // 距离要按真正滚动的那一层算：宿主外层滚动时 container 自己是不滚的。
      const distance = owner.scrollHeight - owner.scrollTop - owner.clientHeight
      const currentTop = owner.scrollTop
      const delta = currentTop - lastTopRef.current
      lastTopRef.current = currentTop
      if (distance <= STICK_THRESHOLD) {
        programmaticUntilRef.current = 0
        setStick(true)
        return
      }
      if (Date.now() < programmaticUntilRef.current) return
      // 只有 scrollTop 真的减少才算用户上滚。流式内容变高时，浏览器滚动锚定
      // 会把 scrollTop 往下推（delta > 0），那不是用户意图，不能停止跟随。
      if (delta < -2) {
        programmaticUntilRef.current = 0
        cancelTween()
        setStick(false)
      }
    }

    owner.addEventListener('scroll', onScroll, { passive: true })

    const mutation = typeof MutationObserver === 'function'
      ? new MutationObserver(() => scheduleFollow())
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
      cancelTween()
      mutation?.disconnect()
      resize?.disconnect()
      if (frameRef.current !== null) {
        if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }
    // revision 变化时重挂一次：容器若是后挂载的（空态 → 消息流），也能接上观察器。
  }, [containerRef, contentRef, revision, follow, settle, cancelTween, setStick, forceInner])

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