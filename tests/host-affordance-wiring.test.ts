// @vitest-environment jsdom

/**
 * ChatWorkspace 的捕获拦截与挂载自检（接线级测试）。
 *
 * 纯判据在 host-affordance.test.ts 里逐条钉住；这里验的是**接线**：
 * 判据挂到 document/window 的捕获阶段之后，
 *   1. 宿主的点击真的到不了宿主处理器（用挂在 window 冒泡阶段的监听代表宿主 startSession）；
 *   2. 命中的快捷键真的转成 controller.enterNew()，含 macOS 上报 key='Dead' 的那条；
 *   3. 不匹配的点击 / 组合键原样放行；
 *   4. 800ms 自检：页面上有宿主入口时不吭声，判据失效时告警一次且只一次。
 *
 * 挂载用最小桩：ChatWorkspace 只消费 controller / useSession / useSessions / renderFactorySlot。
 */

import { act } from 'react-dom/test-utils'
import { createElement, type ComponentType } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ChatWorkspace } from '../src/client/chat-mode/ChatWorkspace'
import type { ChatModeController } from '../src/client/chat-mode/controller'

/** 被测试组件的最小可挂载形态：桩函数不满足宿主 Hook 的精确签名。 */
const Workspace = ChatWorkspace as unknown as ComponentType<Record<string, unknown>>

let container: HTMLDivElement | null = null
let root: Root | null = null
let enterNew: ReturnType<typeof vi.fn>
let hostHandled: ReturnType<typeof vi.fn>

/** 宿主处理器：代表外壳 startSession() 的位置。 */
function hostHandler (): void {
  hostHandled()
}

/**
 * 挂载一个 Chat 工作区。
 * @returns 宿主的 enterNew 桩，用来断言拦截是否真的把动作接过来了。
 */
function mountWorkspace (): ReturnType<typeof vi.fn> {
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  const create = vi.fn(async () => 'new-chat')
  const controller = { enterNew: create, back: () => {} } as unknown as ChatModeController
  act(() => {
    root!.render(createElement(Workspace, {
      sessionId: 's1',
      controller,
      useSession: () => ({ blank: false, running: false }),
      useSessions: (selector: (state: unknown) => unknown) => selector({ byId: { s1: { displayTitle: '标题' } } }),
      renderFactorySlot: () => null,
    }))
  })
  enterNew = create
  return create
}

beforeEach(() => {
  ;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  hostHandled = vi.fn()
  window.addEventListener('click', hostHandler)
})

afterEach(() => {
  window.removeEventListener('click', hostHandler)
  if (root !== null) {
    const current = root
    act(() => { current.unmount() })
    root = null
  }
  container?.remove()
  container = null
  document.body.innerHTML = ''
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('捕获拦截：宿主的「新建会话」不再落到宿主的处理器上', () => {
  it('点击侧栏那颗按钮只调用 Chat 的 enterNew，宿主处理器收不到事件', () => {
    const create = mountWorkspace()
    const host = document.createElement('button')
    host.setAttribute('aria-label', '新建会话')
    document.body.append(host)
    const event = new MouseEvent('click', { bubbles: true, cancelable: true })
    host.dispatchEvent(event)
    expect(create).toHaveBeenCalledTimes(1)
    expect(event.defaultPrevented).toBe(true)
    expect(hostHandled).not.toHaveBeenCalled()
  })

  it('点按钮内部的图标（target 不是按钮本身）也拦得住', () => {
    const create = mountWorkspace()
    const host = document.createElement('button')
    host.setAttribute('aria-keyshortcuts', 'Control+Alt+N')
    const icon = document.createElement('span')
    host.append(icon)
    document.body.append(host)
    icon.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    expect(create).toHaveBeenCalledTimes(1)
    expect(hostHandled).not.toHaveBeenCalled()
  })

  it('其它按钮的点击原样放行', () => {
    const create = mountWorkspace()
    const other = document.createElement('button')
    other.setAttribute('aria-label', '发送消息')
    document.body.append(other)
    other.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    expect(create).not.toHaveBeenCalled()
    expect(hostHandled).toHaveBeenCalledTimes(1)
  })

  it('Ctrl+N 转成 enterNew', () => {
    const create = mountWorkspace()
    const event = new KeyboardEvent('keydown', { key: 'n', code: 'KeyN', ctrlKey: true, bubbles: true, cancelable: true })
    document.body.dispatchEvent(event)
    expect(create).toHaveBeenCalledTimes(1)
    expect(event.defaultPrevented).toBe(true)
  })

  it('宿主 Web 端的 Ctrl+Alt+N 也转成 enterNew（旧判据在 macOS 上会漏）', () => {
    const create = mountWorkspace()
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'n', code: 'KeyN', ctrlKey: true, altKey: true, bubbles: true, cancelable: true }))
    expect(create).toHaveBeenCalledTimes(1)
  })

  it('macOS 上报 key="Dead" 的 Option+Command+N 也转成 enterNew', () => {
    const create = mountWorkspace()
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Dead', code: 'KeyN', metaKey: true, altKey: true, bubbles: true, cancelable: true }))
    expect(create).toHaveBeenCalledTimes(1)
  })

  it('Ctrl+Shift+N 与单独 N 都不拦', () => {
    const create = mountWorkspace()
    const shifted = new KeyboardEvent('keydown', { key: 'n', code: 'KeyN', ctrlKey: true, shiftKey: true, bubbles: true, cancelable: true })
    document.body.dispatchEvent(shifted)
    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'n', code: 'KeyN', bubbles: true, cancelable: true }))
    expect(create).not.toHaveBeenCalled()
    expect(shifted.defaultPrevented).toBe(false)
  })
})

describe('挂载自检', () => {
  it('页面上有宿主入口时不告警', () => {
    vi.useFakeTimers()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const host = document.createElement('button')
    host.setAttribute('aria-label', '新建会话')
    document.body.append(host)
    mountWorkspace()
    act(() => { vi.advanceTimersByTime(900) })
    expect(warn).not.toHaveBeenCalled()
  })

  it('判据失效时告警一次，且只告警一次', () => {
    vi.useFakeTimers()
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    // 页面上没有任何被认出的控件：宿主可能已改版，也可能侧栏被收起。
    mountWorkspace()
    act(() => { vi.advanceTimersByTime(900) })
    expect(warn).toHaveBeenCalledTimes(1)
    const message = String(warn.mock.calls[0]![0])
    expect(message).toContain('新建会话')
    expect(message).toContain('host-affordance.ts')
    // 换一处再挂一次：模块级一次性，不再刷屏。
    const again = mountWorkspace()
    expect(again).toBeDefined()
    act(() => { vi.advanceTimersByTime(900) })
    expect(warn).toHaveBeenCalledTimes(1)
  })
})
