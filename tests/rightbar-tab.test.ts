// @vitest-environment jsdom

/**
 * 右栏 Chat tab 的接线级测试：下拉 → retain → SessionProvider 覆盖 → release。
 *
 * 纯判据（列哪些行、当前项是谁、要不要 retain）在 rightbar-picker.test.ts 里逐条钉住；
 * 这里验的是**React 一侧的时序**：
 *   1. 默认继承 tab 自己的会话绑定，一次 retain 都不发生；
 *   2. 选别的会话时 retain 一份引用，并用 <SessionProvider session={引用}> 显式覆盖子 slot；
 *   3. 切回 / 再切走 / 卸载都 release，不留悬空绑定（引用与目标 id 一起进 state）；
 *   4. retain 抛错时退回「只显示本会话」并 console.warn，不白屏；
 *   5. 旧宿主没有 retain、或只有一个会话时，不画那个选不出东西的下拉。
 *
 * 挂载用最小桩：tab 正文只消费 sessionId / sessions / useSessions / SessionProvider / renderSlot。
 */

import { createElement, type ComponentType, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { act } from 'react-dom/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { SessionListSnapshot, SessionReferenceLike, SessionsApi } from '../src/client/chat-a2ui/types'
import { RIGHTBAR_CHAT_CONVERSATION, RightbarChatTab } from '../src/client/chat-mode/rightbar'
import { RIGHTBAR_SESSION_SOURCE } from '../src/client/constants'

/** 被测试组件的最小可挂载形态：宿主 Hook 的精确签名不是这里的重点。 */
const Tab = RightbarChatTab as unknown as ComponentType<Record<string, unknown>>

/** 每次渲染时 SessionProvider 收到的会话：'@inherit' 表示「继承外层绑定」。 */
let provided: string[] = []
let container: HTMLDivElement | null = null
let root: Root | null = null
let rerender: ((props: Record<string, unknown>) => void) | null = null

/** 宿主 SessionProvider 的替身：把收到的 session 记下来，再画一个可断言的壳。 */
function TestProvider ({ session, children }: { session?: SessionReferenceLike; children?: ReactNode }): ReactNode {
  const id = session === undefined ? '@inherit' : session.sessionId
  provided.push(id)
  return createElement('div', { 'data-provider': id }, children)
}

/** 子 slot 的渲染器替身：只标出「哪个 slot 被要求渲染」。 */
function renderSlot (name: string): ReactNode {
  return createElement('div', { 'data-slot': name }, '对话正文')
}

/** 两个 Chat 会话 + 一个本 tab 会话的列表快照。 */
function chatSnapshot (ids: readonly string[] = ['a', 'b', 'c']): SessionListSnapshot {
  const titles: Record<string, string> = { a: '当前对话', b: '旅行计划', c: '周报' }
  const byId: Record<string, { id: string; displayTitle: string; updatedAt: number; projectionValues: { agentPreset: string } }> = {}
  for (const id of ids) {
    byId[id] = {
      id,
      displayTitle: titles[id] ?? id,
      updatedAt: 0,
      projectionValues: { agentPreset: 'chat' },
    }
  }
  return { ids, byId }
}

/** 一次测试用的 retain/release 台账。 */
interface Harness {
  sessions: SessionsApi
  retain: ReturnType<typeof vi.fn>
  retained: string[]
  released: string[]
  /** retain / release 的调用顺序，用来证明「先放旧的，再拿新的」。 */
  trace: string[]
}

/**
 * 造宿主 sessions 替身。
 * @param options.failOn - 这些会话 id 的 retain 直接抛错（宿主对未知会话就是这么抛的）。
 * @param options.canRetain - false 时模拟旧宿主：根本没有 retain 方法。
 */
function makeSessions (options: { failOn?: readonly string[]; canRetain?: boolean } = {}): Harness {
  const retained: string[] = []
  const released: string[] = []
  const trace: string[] = []
  const retain = vi.fn((target: string, opts: { source: string }) => {
    void opts
    if (options.failOn?.includes(target) === true) {
      throw new Error('sessions.retain: unknown session ' + target)
    }
    retained.push(target)
    trace.push('retain:' + target)
    const reference: SessionReferenceLike = {
      sessionId: target,
      binding: {},
      ready: Promise.resolve({}),
      release: () => {
        released.push(target)
        trace.push('release:' + target)
      },
    }
    return reference
  })
  const sessions = {
    create: () => Promise.resolve('new'),
    fork: () => Promise.resolve('child'),
    list: { getSnapshot: () => chatSnapshot(), subscribe: () => () => {} },
  } as unknown as SessionsApi
  if (options.canRetain !== false) sessions.retain = retain
  return { sessions, retain, retained, released, trace }
}

/**
 * 挂载一次 tab 正文。
 * @param harness - sessions 台账。
 * @param options - 覆盖默认 props（sessionId / snapshot / useSessions）。
 */
function mount (harness: Harness, options: {
  sessionId?: string
  snapshot?: SessionListSnapshot
  useSessions?: (selector: (state: SessionListSnapshot) => unknown) => unknown
} = {}): void {
  const snapshot = options.snapshot ?? chatSnapshot()
  const props: Record<string, unknown> = {
    sessionId: options.sessionId ?? 'a',
    sessions: harness.sessions,
    useSessions: options.useSessions ?? ((selector: (state: SessionListSnapshot) => unknown) => selector(snapshot)),
    SessionProvider: TestProvider,
    renderSlot,
  }
  container = document.createElement('div')
  document.body.append(container)
  root = createRoot(container)
  rerender = (next) => { root!.render(createElement(Tab, next)) }
  act(() => { root!.render(createElement(Tab, props)) })
}

/** 最近一次渲染里 SessionProvider 拿到的会话。 */
function lastProvided (): string | undefined {
  return provided[provided.length - 1]
}

/** 下拉控件（没有下拉时为 null）。 */
function picker (): HTMLSelectElement | null {
  return container?.querySelector('select') ?? null
}

/** 读出下拉的可选行文本。 */
function optionLabels (): string[] {
  return [...(picker()?.options ?? [])].map(option => option.textContent ?? '')
}

/** 在界面上真的选一下（React 的 onChange 走原生 change 事件）。 */
function chooseInUi (value: string): void {
  const select = picker()
  if (select === null) throw new Error('下拉没有渲染出来')
  select.value = value
  act(() => { select.dispatchEvent(new Event('change', { bubbles: true })) })
}

/** 正文里是否还有那个 slot 的内容（用来证明「没白屏」）。 */
function conversationMounted (): boolean {
  return container?.querySelector('[data-slot="' + RIGHTBAR_CHAT_CONVERSATION + '"]') !== null
}

beforeEach(() => {
  ;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  provided = []
})

afterEach(() => {
  if (root !== null) {
    const current = root
    act(() => { current.unmount() })
    root = null
  }
  container?.remove()
  container = null
  rerender = null
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('默认：只显示 tab 自己的会话', () => {
  it('不 retain、不覆盖 SessionProvider，下拉里本会话排第一并高亮', () => {
    const harness = makeSessions()
    mount(harness)

    expect(harness.retain).not.toHaveBeenCalled()
    expect(provided).toStrictEqual(['@inherit'])
    expect(conversationMounted()).toBe(true)

    const select = picker()
    expect(select).not.toBeNull()
    expect(select?.value).toBe('a')
    expect(optionLabels()).toStrictEqual(['当前对话（本 tab）', '旅行计划', '周报'])
  })

  it('只有一个会话时不画那个选不出东西的下拉', () => {
    mount(makeSessions(), { snapshot: chatSnapshot(['a']) })
    expect(picker()).toBeNull()
    expect(lastProvided()).toBe('@inherit')
  })
})

describe('切换：retain 一份引用并覆盖子 slot', () => {
  it('选别的会话后 retain 它，SessionProvider 收到它的引用', () => {
    const harness = makeSessions()
    mount(harness)

    chooseInUi('b')

    expect(harness.retain).toHaveBeenCalledTimes(1)
    expect(harness.retain).toHaveBeenCalledWith('b', { source: RIGHTBAR_SESSION_SOURCE })
    expect(harness.retained).toStrictEqual(['b'])
    expect(lastProvided()).toBe('b')
    expect(conversationMounted()).toBe(true)
    expect(picker()?.value).toBe('b')
  })

  it('选回本会话：release 掉那份引用，正文回到继承绑定', () => {
    const harness = makeSessions()
    mount(harness)
    chooseInUi('b')

    chooseInUi('a')

    expect(harness.retain).toHaveBeenCalledTimes(1)
    expect(harness.released).toStrictEqual(['b'])
    expect(lastProvided()).toBe('@inherit')
    expect(conversationMounted()).toBe(true)
  })

  it('直接换到第三个会话：先放旧的，再拿新的', () => {
    const harness = makeSessions()
    mount(harness)
    chooseInUi('b')

    chooseInUi('c')

    expect(harness.retained).toStrictEqual(['b', 'c'])
    // 「先放旧的，再拿新的」：同一条 effect 的 cleanup 一定早于下一次 body。
    expect(harness.trace).toStrictEqual(['retain:b', 'release:b', 'retain:c'])
    // c 的引用还在手里，只有 b 被放掉。
    expect(harness.released).toStrictEqual(['b'])
    expect(lastProvided()).toBe('c')
  })

  it('卸载时把最后一份引用放掉', () => {
    const harness = makeSessions()
    mount(harness)
    chooseInUi('b')
    expect(harness.released).toStrictEqual([])

    const current = root
    root = null
    act(() => { current!.unmount() })

    expect(harness.released).toStrictEqual(['b'])
  })

  it('tab 被换到别的会话上：回到新会话的绑定，并放掉之前那份引用', () => {
    const harness = makeSessions()
    mount(harness)
    chooseInUi('b')
    expect(lastProvided()).toBe('b')

    const snapshot = chatSnapshot()
    act(() => {
      rerender!({
        sessionId: 'c',
        sessions: harness.sessions,
        useSessions: (selector: (state: SessionListSnapshot) => unknown) => selector(snapshot),
        SessionProvider: TestProvider,
        renderSlot,
      })
    })

    expect(harness.released).toStrictEqual(['b'])
    expect(lastProvided()).toBe('@inherit')
    expect(picker()?.value).toBe('c')
    expect(optionLabels()[0]).toBe('周报（本 tab）')
  })
})

describe('失败与降级', () => {
  it('retain 抛错时退回本会话，告警一次并给出提示，不白屏', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const harness = makeSessions({ failOn: ['b'] })
    mount(harness)

    chooseInUi('b')

    expect(harness.retain).toHaveBeenCalledTimes(1)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(String(warn.mock.calls[0]?.[0])).toContain('右栏切换会话失败')
    // 仍然显示 tab 自己的会话（继承绑定），而且对话还在。
    expect(lastProvided()).toBe('@inherit')
    expect(conversationMounted()).toBe(true)
    // 下拉的选中项拨回本会话，与正文一致。
    expect(picker()?.value).toBe('a')
    const notice = container?.querySelector('[data-caui-rightbar] [role="status"]')
    expect(notice?.textContent).toContain('切换会话失败')
  })

  it('宿主没有 retain（旧宿主）时保持原样：不画下拉，只显示本会话', () => {
    const harness = makeSessions({ canRetain: false })
    mount(harness)

    expect(picker()).toBeNull()
    expect(harness.retain).not.toHaveBeenCalled()
    expect(lastProvided()).toBe('@inherit')
    expect(conversationMounted()).toBe(true)
  })

  it('没有 sessionId / useSessions 的注入面时退回最朴素的正文', () => {
    container = document.createElement('div')
    document.body.append(container)
    root = createRoot(container)
    const harness = makeSessions()
    act(() => {
      root!.render(createElement(Tab, {
        sessions: harness.sessions,
        SessionProvider: TestProvider,
        renderSlot,
      }))
    })

    expect(picker()).toBeNull()
    expect(lastProvided()).toBe('@inherit')
    expect(conversationMounted()).toBe(true)
  })
})
