// @vitest-environment jsdom

/**
 * 反馈回路：**用户自己上滚之后，跟随器不许再改写 scrollTop**。
 *
 * 这是用户报的确切症状的反面（「自己滚动时页面莫名其妙往上跳一下」= 跟随器
 * 又把他往下拽了）。jsdom 没有布局，所以用一个「假滚动容器」把 scrollHeight /
 * clientHeight / scrollTop 换成可控值，让 useStickToBottom 真正跑起来。
 *
 * 红/绿信号：
 *   - 绿：用户把位置放到 3300 之后，过 20 帧位置仍在 3300±2，且 atBottom=false
 *   - 红：跟随器继续写 scrollTop，位置被拉回底部
 */

import { act } from 'react-dom/test-utils'
import { createElement, useEffect, useRef, useState, type ReactElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useStickToBottom } from '../src/client/chat-a2ui/ScrollToBottom'

const CONTENT = 4000
const VIEWPORT = 500
const BOTTOM = CONTENT - VIEWPORT

let height = CONTENT
let top = BOTTOM
let scrollWrites = 0

/** 只对带 data-mock-scroller 的元素生效的假滚动容器。 */
function installMockScroller (): void {
  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get (this: HTMLElement) {
      return this.dataset.mockScroller === '1' ? height : 0
    },
  })
  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get (this: HTMLElement) {
      return this.dataset.mockScroller === '1' ? VIEWPORT : 0
    },
  })
  Object.defineProperty(HTMLElement.prototype, 'scrollTop', {
    configurable: true,
    get (this: HTMLElement) {
      return this.dataset.mockScroller === '1' ? top : 0
    },
    set (this: HTMLElement, value: number) {
      if (this.dataset.mockScroller !== '1') return
      scrollWrites += 1
      top = Math.max(0, Math.min(value, height - VIEWPORT))
    },
  })
}

interface HarnessHandle {
  /** 递增 revision：等价于「消息流里又多了一段」，会真正驱动跟随循环跑一帧。 */
  bump: () => void
}

declare global {
  interface Window { __harness?: HarnessHandle }
}

function Harness (): ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [revision, setRevision] = useState(0)
  const { atBottom } = useStickToBottom({ containerRef, contentRef, revision, forceInner: true })
  useEffect(() => {
    window.__harness = { bump: () => setRevision(value => value + 1) }
    return () => { delete window.__harness }
  }, [])
  return createElement('div', { ref: containerRef, 'data-mock-scroller': '1' },
    createElement('div', { ref: contentRef }),
    createElement('span', { 'data-testid': 'at-bottom' }, atBottom ? '1' : '0'),
  )
}

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  height = CONTENT
  top = BOTTOM
  scrollWrites = 0
  installMockScroller()
  ;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => { root.unmount() })
  container.remove()
})

/** 让 rAF 循环跑若干帧（jsdom 的 rAF 走定时器，约 16ms 一帧）。 */
async function frames (count: number): Promise<void> {
  for (let index = 0; index < count; index += 1) {
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 20)) })
  }
}

describe('用户上滚之后，跟随器必须让位', () => {
  it('上滚 200px 后 20 帧内不再改写 scrollTop，且 atBottom 变 false', async () => {
    act(() => { root.render(createElement(Harness)) })
    await frames(6)
    // 初始化阶段允许它落到底部
    expect(top).toBeLessThanOrEqual(BOTTOM)
    await frames(4)

    // 模拟用户上滚：改位置 + 派发 scroll（浏览器就是这么通知的）
    const userTop = BOTTOM - 200
    top = userTop
    const scroller = container.querySelector('[data-mock-scroller="1"]')
    act(() => { scroller?.dispatchEvent(new Event('scroll')) })
    const writesBefore = scrollWrites

    await frames(20)

    // 判据 1：位置不被拉回（允许 2px 的取整误差）
    expect(Math.abs(top - userTop)).toBeLessThanOrEqual(2)
    // 判据 2：这 20 帧里跟随器至多写 0 次（它应该已经让位）
    expect(scrollWrites - writesBefore).toBe(0)
    // 判据 3：UI 知道自己不在底部了
    const flag = container.querySelector('[data-testid="at-bottom"]')
    expect(flag?.textContent).toBe('0')
  })

  it('内容继续增长（流式）时，用户的位置也不被拽走', async () => {
    act(() => { root.render(createElement(Harness)) })
    await frames(8)

    const userTop = BOTTOM - 220
    top = userTop

    // 模拟流式：内容每 3 帧长 120px（bump 等价于「又来了一段」）
    for (let step = 0; step < 6; step += 1) {
      height += 120
      act(() => { window.__harness?.bump() })
      await frames(3)
    }

    expect(Math.abs(top - userTop)).toBeLessThanOrEqual(2)
  })

  it('增长本身会驱动跟随（这条用例证明 harness 不是空转）', async () => {
    act(() => { root.render(createElement(Harness)) })
    await frames(8)
    const before = top
    height += 400
    act(() => { window.__harness?.bump() })
    await frames(20)
    // 跟着增长往下走（被夹在内容底部）
    expect(top).toBeGreaterThan(before + 100)
  })
})
