/** ChatModeController lifecycle, selection, creation, and branching. */

import { describe, expect, it, vi } from 'vitest'
import type { SessionSummaryLike, SessionsApi } from '../src/client/chat-a2ui/types'
import { CHAT_PANEL_ID } from '../src/client/constants'
import { ChatModeController } from '../src/client/chat-mode/controller'

interface Registered {
  options: Record<string, unknown>
  component: unknown
}

/** Build a controller plus observable fakes. */
function makeHarness (config: {
  rows?: Array<[string, SessionSummaryLike | undefined]>
  phase?: 'pending' | 'ready'
  create?: () => Promise<string>
  fork?: () => Promise<string>
  ensureChatWorkspace?: () => Promise<void>
  chatWorkspaceId?: () => string | undefined
} = {}): {
  controller: ChatModeController
  create: ReturnType<typeof vi.fn>
  fork: ReturnType<typeof vi.fn>
  selectPanel: ReturnType<typeof vi.fn>
  registered: Registered[]
  dispose: ReturnType<typeof vi.fn>
  /** 往列表里加一行（不发通知，配合 setPhase 一起用）。 */
  pushRow: (id: string, row: SessionSummaryLike) => void
  /** 把列表切到某个阶段并通知订阅者（模拟宿主拉到数据）。 */
  setPhase: (next: 'pending' | 'ready') => void
} {
  const rows = config.rows ?? []
  let phase: 'pending' | 'ready' = config.phase ?? 'ready'
  const listeners = new Set<() => void>()
  const create = vi.fn(config.create ?? (async () => 'new-1'))
  const fork = vi.fn(config.fork ?? (async () => 'child-1'))
  const sessions: SessionsApi = {
    create,
    fork,
    list: {
      getSnapshot: () => ({ ids: rows.map(([id]) => id), byId: Object.fromEntries(rows), phase }),
      subscribe: (listener: () => void) => {
        listeners.add(listener)
        return () => { listeners.delete(listener) }
      },
    },
  }
  const registered: Registered[] = []
  const dispose = vi.fn()
  const slots = {
    register: (options: Record<string, unknown>, component: unknown) => {
      registered.push({ options, component })
      return dispose
    },
  }
  const selectPanel = vi.fn()
  const controller = new ChatModeController({
    sessions,
    slots,
    layout: { selectPanel },
    sidebarComponent: () => null,
    ensureChatWorkspace: config.ensureChatWorkspace,
    chatWorkspaceId: config.chatWorkspaceId,
  })
  return {
    controller,
    create,
    fork,
    selectPanel,
    registered,
    dispose,
    pushRow: (id, row) => { rows.push([id, row]) },
    setPhase: (next) => {
      phase = next
      for (const listener of listeners) listener()
    },
  }
}

/** Wait until the controller leaves the opening phase. */
async function settled (controller: ChatModeController): Promise<void> {
  await vi.waitFor(() => {
    expect(controller.getSnapshot().phase).not.toBe('opening')
  })
}

describe('ChatModeController.mount', () => {
  it('installs the Chat sidebar and creates a Session when none exists', async () => {
    const harness = makeHarness()
    harness.controller.mount()
    expect(harness.controller.getSnapshot().mounted).toBe(true)
    expect(harness.registered).toHaveLength(1)
    expect(harness.registered[0]?.options.name).toBe('sidebar.workspaces')
    expect(harness.registered[0]?.options.priority).toBe(-10)

    await settled(harness.controller)
    expect(harness.create).toHaveBeenCalledTimes(1)
    expect(harness.controller.getSnapshot()).toMatchObject({
      mounted: true,
      activeSessionId: 'new-1',
      phase: 'ready',
      error: null,
    })
  })

  it('建会话前先确保 Chat 工作区，并把 id 传给 create（ADR 0003 的归属）', async () => {
    const order: string[] = []
    const harness = makeHarness({
      create: async () => { order.push('create'); return 'new-1' },
      ensureChatWorkspace: async () => { order.push('ensure') },
      chatWorkspaceId: () => 'ws-chat',
    })
    harness.controller.mount()
    await settled(harness.controller)

    expect(order).toEqual(['ensure', 'create'])
    expect(harness.create.mock.calls[0]?.[0]).toMatchObject({ agentPreset: 'chat', workspaceId: 'ws-chat' })
  })

  it('Chat 工作区准备失败时不阻断建会话（只退回归属）', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const harness = makeHarness({
      ensureChatWorkspace: async () => { throw new Error('mkdir failed') },
      chatWorkspaceId: () => undefined,
    })
    harness.controller.mount()
    await settled(harness.controller)
    expect(harness.create).toHaveBeenCalledTimes(1)
    expect(harness.create.mock.calls[0]?.[0]).toStrictEqual({ agentPreset: 'chat' })
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('selects the newest existing Chat Session without creating one', async () => {
    const harness = makeHarness({
      rows: [
        ['old', { id: 'old', updatedAt: 10, projectionValues: { agentPreset: 'chat' } }],
        ['new', { id: 'new', updatedAt: 20, projectionValues: { agentPreset: 'chat' } }],
        ['other', { id: 'other', updatedAt: 30, projectionValues: { agentPreset: 'writer' } }],
      ],
    })
    harness.controller.mount()
    await settled(harness.controller)
    expect(harness.create).not.toHaveBeenCalled()
    expect(harness.controller.getSnapshot().activeSessionId).toBe('new')
  })

  it('removes the occupant and keeps the selection on unmount', async () => {
    const harness = makeHarness({
      rows: [['a', { id: 'a', projectionValues: { agentPreset: 'chat' } }]],
    })
    harness.controller.mount()
    await settled(harness.controller)
    harness.controller.unmount()

    expect(harness.dispose).toHaveBeenCalledTimes(1)
    expect(harness.controller.getSnapshot()).toMatchObject({
      mounted: false,
      activeSessionId: 'a',
      phase: 'idle',
    })
    expect(harness.selectPanel).not.toHaveBeenCalled()
  })
})

describe('ChatModeController.enterNew', () => {
  it('opens the Chat panel first, then resolves with the created Session', async () => {
    const harness = makeHarness()
    const pending = harness.controller.enterNew()

    expect(harness.selectPanel).toHaveBeenCalledWith(CHAT_PANEL_ID)
    expect(harness.controller.getSnapshot()).toMatchObject({ pendingNew: true, mounted: false })

    harness.controller.mount()
    await expect(pending).resolves.toBe('new-1')
    expect(harness.controller.getSnapshot()).toMatchObject({
      activeSessionId: 'new-1',
      phase: 'ready',
      pendingNew: false,
    })
  })

  it('creates in place when already mounted', async () => {
    const harness = makeHarness({
      rows: [['a', { id: 'a', projectionValues: { agentPreset: 'chat' } }]],
    })
    harness.controller.mount()
    await settled(harness.controller)
    const created = await harness.controller.enterNew()

    expect(created).toBe('new-1')
    expect(harness.selectPanel).not.toHaveBeenCalled()
    expect(harness.controller.getSnapshot().activeSessionId).toBe('new-1')
  })
})

describe('ChatModeController.branch and openSession', () => {
  it('forks the given turn and activates the child', async () => {
    const harness = makeHarness({
      rows: [['source', { id: 'source', projectionValues: { agentPreset: 'chat' } }]],
    })
    const child = await harness.controller.branch('source', 9)

    expect(child).toBe('child-1')
    expect(harness.fork).toHaveBeenCalledWith({
      sessionId: 'source',
      atSeq: 9,
      increaseTitle: true,
    })
    expect(harness.controller.getSnapshot().activeSessionId).toBe('child-1')
    expect(harness.selectPanel).toHaveBeenCalledWith(CHAT_PANEL_ID)
  })

  it('does not reselect the panel when already mounted', async () => {
    const harness = makeHarness({
      rows: [['source', { id: 'source', projectionValues: { agentPreset: 'chat' } }]],
    })
    harness.controller.mount()
    await settled(harness.controller)
    harness.selectPanel.mockClear()

    await harness.controller.branch('source', 2)
    expect(harness.selectPanel).not.toHaveBeenCalled()
  })

  it('ignores empty openSession ids and accepts real ones', () => {
    const harness = makeHarness()
    harness.controller.openSession('')
    expect(harness.controller.getSnapshot().activeSessionId).toBeNull()
    harness.controller.openSession('abc')
    expect(harness.controller.getSnapshot()).toMatchObject({ activeSessionId: 'abc', phase: 'ready' })
  })

  it('returns to the native conversation on back', () => {
    const harness = makeHarness()
    harness.controller.back()
    expect(harness.selectPanel).toHaveBeenCalledWith(null)
  })
})
describe('ChatModeController 的就绪门（刷新后不能反复建空会话）', () => {
  it('列表还在 pending 时不建会话，等 ready 后选中已有的那条', async () => {
    const harness = makeHarness({ phase: 'pending' })
    harness.controller.mount()

    // 刷新后的头几百毫秒：列表还没到，此时绝不能建会话。
    await new Promise(resolve => setTimeout(resolve, 30))
    expect(harness.create).not.toHaveBeenCalled()
    expect(harness.controller.getSnapshot().phase).toBe('opening')

    // 宿主把列表拉回来了：先有行、再切 ready（顺序与真实推送一致）。
    harness.pushRow('existing', { id: 'existing', projectionValues: { agentPreset: 'chat' } })
    harness.setPhase('ready')
    await settled(harness.controller)

    expect(harness.create).not.toHaveBeenCalled()
    expect(harness.controller.getSnapshot()).toMatchObject({
      activeSessionId: 'existing',
      phase: 'ready',
    })
  })

  it('列表 ready 且确实为空时才建（旧宿主没有 phase 字段，按 ready 处理）', async () => {
    const harness = makeHarness({ phase: 'ready' })
    harness.controller.mount()
    await settled(harness.controller)
    expect(harness.create).toHaveBeenCalledTimes(1)
  })

  it('等不到就绪时卸载，不会在建完会话后才发现挂错了', async () => {
    const harness = makeHarness({ phase: 'pending' })
    harness.controller.mount()
    harness.controller.unmount()
    harness.pushRow('late', { id: 'late', projectionValues: { agentPreset: 'chat' } })
    harness.setPhase('ready')
    await new Promise(resolve => setTimeout(resolve, 20))
    expect(harness.create).not.toHaveBeenCalled()
  })
})

describe('ChatModeController.mount 的幂等性（切回 Chat 面板不能反复建空会话）', () => {
  it('重新挂载时，不会因为新建会话还没进 Chat 列表而再建一个', async () => {
    const harness = makeHarness({ create: async () => 'new-1' })
    harness.controller.mount()
    await settled(harness.controller)
    expect(harness.create).toHaveBeenCalledTimes(1)

    // 宿主列表里暂时还没有这个空会话（projection 未生成），切走再切回来
    harness.controller.unmount()
    harness.controller.mount()
    await settled(harness.controller)

    expect(harness.create).toHaveBeenCalledTimes(1)
    expect(harness.controller.getSnapshot().activeSessionId).toBe('new-1')
  })

  it('宿主快照里认得它、但还没有 chat 投影时也不重建', async () => {
    const rows: Array<[string, SessionSummaryLike | undefined]> = []
    const harness = makeHarness({ rows, create: async () => 'new-1' })
    harness.controller.mount()
    await settled(harness.controller)

    rows.push(['new-1', { id: 'new-1' }])
    harness.controller.unmount()
    harness.controller.mount()
    await settled(harness.controller)

    expect(harness.create).toHaveBeenCalledTimes(1)
  })

  it('显式新建仍然可以连续创建（幂等只约束自动路径）', async () => {
    let n = 0
    const harness = makeHarness({ create: async () => 'new-' + String(++n) })
    harness.controller.mount()
    await settled(harness.controller)
    await harness.controller.enterNew()
    await harness.controller.enterNew()
    expect(harness.create).toHaveBeenCalledTimes(3)
  })
})
