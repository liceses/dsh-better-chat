// @vitest-environment jsdom

/**
 * 流式尾巴的模糊渐入：只包「这一帧新长出来的那几个字」。
 * 这里直接渲染 Markdown 组件，按 token 增长重渲染，数 span 的数量与位置。
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { act } from 'react-dom/test-utils'
import { Markdown } from '../src/client/chat-a2ui/Markdown'
import { MOTION } from '../src/client/chat-a2ui/motion-config'

const CHAR_CLASS = '.caui-md-stream-char'

let container: HTMLDivElement
let root: Root

beforeEach(() => {
  (globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
})

afterEach(() => {
  act(() => { root.unmount() })
  container.remove()
})

function render (text: string, streaming: boolean): void {
  act(() => { root.render(createElement(Markdown, { text, streaming })) })
}

/** 容器里的纯文本（span 包住之后 textContent 仍是连续文字）。 */
function textOf (): string {
  return (container.textContent ?? '').replace(/\s+$/, '')
}

describe('流式尾巴的模糊渐入', () => {
  it('首帧只包末尾最多 maxChars 个字，且包住的正好是结尾', () => {
    const text = '第一段已经写完，这里是第二段的开头。'
    render(text, true)
    const chars = container.querySelectorAll(CHAR_CLASS)
    expect(chars.length).toBe(Math.min(text.length, MOTION.stream.maxChars))
    // 包住的内容拼起来 = 原文本的结尾
    const wrapped = Array.from(chars).map(el => el.textContent ?? '').join('')
    expect(text.endsWith(wrapped)).toBe(true)
    expect(textOf()).toBe(text)
  })

  it('增长时只包新长出来的那一段，之前的字保持清晰', () => {
    const head = '第一段。'
    render(head, false)
    // 首次挂载且不在流式态：不包（打开历史会话不该整段闪）
    expect(container.querySelectorAll(CHAR_CLASS).length).toBe(0)

    const added = '后来又补了一句。'
    render(head + added, false)
    const chars = container.querySelectorAll(CHAR_CLASS)
    expect(chars.length).toBe(Math.min(added.length, MOTION.stream.maxChars))
    const wrapped = Array.from(chars).map(el => el.textContent ?? '').join('')
    expect(wrapped).toBe(added)
  })

  it('宿主没把 running 传下来时，靠「变长了」也能触发', () => {
    render('开头。', false)
    expect(container.querySelectorAll(CHAR_CLASS).length).toBe(0)
    render('开头。多写几个字。', false)
    const chars = Array.from(container.querySelectorAll(CHAR_CLASS)).map(el => el.textContent ?? '').join('')
    expect(chars).toBe('多写几个字。')
  })

  it('超过 maxChars 时只包最后 maxChars 个字', () => {
    const base = '开头。'
    render(base, true)
    const long = base + 'x'.repeat(MOTION.stream.maxChars + 6)
    render(long, true)
    expect(container.querySelectorAll(CHAR_CLASS).length).toBe(MOTION.stream.maxChars)
  })

  it('流式结束后不再有包住的字符（正文回到整段 HTML）', () => {
    render('第一段。', true)
    expect(container.querySelectorAll(CHAR_CLASS).length).toBeGreaterThan(0)
    render('第一段。', false)
    expect(container.querySelectorAll(CHAR_CLASS).length).toBe(0)
  })

  it('tail 打开时，块被套进一个可补间高度的容器里', () => {
    // jsdom 不做布局，scrollHeight 恒为 0；这里给它一个固定高度便于断言
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, get () { return 320 } })
    try {
      act(() => { root.render(createElement(Markdown, { text: '一段话。', tail: true })) })
      const clip = container.querySelector('.caui-md-clip') as HTMLElement | null
      expect(clip).not.toBeNull()
      expect(clip?.classList.contains('caui-md-clip-animated')).toBe(true)
      expect(clip?.style.height).toBe('320px')
      expect(clip?.querySelector('.caui-markdown')).not.toBeNull()
    } finally {
      Object.defineProperty(HTMLElement.prototype, 'scrollHeight', { configurable: true, get () { return 0 } })
    }
  })

  it('不在 tail / 流式态时不裁剪高度（保持 auto）', () => {
    render('一段话。', false)
    const clip = container.querySelector('.caui-md-clip') as HTMLElement | null
    expect(clip).not.toBeNull()
    expect(clip?.classList.contains('caui-md-clip-animated')).toBe(false)
    expect(clip?.style.height).toBe('')
  })

  it('带上 --caui-stream-* 变量，动画参数来自配置', () => {
    render('一段话。', true)
    const host = container.querySelector('.caui-markdown') as HTMLElement
    expect(host.style.getPropertyValue('--caui-stream-duration')).toBe(MOTION.stream.duration + 's')
    expect(host.style.getPropertyValue('--caui-stream-blur')).toBe(MOTION.stream.blur + 'px')
  })
})
