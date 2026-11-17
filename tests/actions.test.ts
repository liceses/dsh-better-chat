/**
 * actions.ts 的单测：用假的 SessionsApi 断言调用参数、视图写入与打开顺序，
 * 以及任何失败路径都不会打开会话。
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { SessionSummaryLike, SessionsApi } from '../src/client/chat-a2ui/types'
import {
  createChatSession,
  forkChatAt,
  seedChatViews,
  seedChatViewsWith,
} from '../src/client/session/actions'
import type { ChatSessionDeps } from '../src/client/session/actions'
import { conversationStorageKey, readStoredView } from '../src/client/session/preferences'

type CreateOptions = NonNullable<Parameters<SessionsApi['create']>[0]>
type ForkOptions = NonNullable<Parameters<SessionsApi['fork']>[0]>

/** 当前测试用例的 localStorage 内容。 */
const store = new Map<string, string>()

/** 安装（或清空）内存版 localStorage；传 null 模拟存储不可用。 */
function installStorage (value: Storage | null): void {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    enumerable: true,
    writable: true,
    value,
  })
}

/** 安装一个可读可写的内存存储，并清掉上一个用例的数据。 */
function installMemoryStorage (): void {
  store.clear()
  const memory = {
    get length (): number {
      return store.size
    },
    clear: (): void => {
      store.clear()
    },
    getItem: (itemKey: string): string | null => store.get(itemKey) ?? null,
    key: (index: number): string | null => [...store.keys()][index] ?? null,
    removeItem: (itemKey: string): void => {
      store.delete(itemKey)
    },
    setItem: (itemKey: string, value: string): void => {
      store.set(itemKey, String(value))
    },
  }
  installStorage(memory as unknown as Storage)
}

/** 预置一条会话记录。 */
function seedStored (sessionId: string, state: Record<string, unknown>): void {
  store.set(conversationStorageKey(sessionId), JSON.stringify(state))
}

/** 读回一条原始记录。 */
function readStored (sessionId: string): Record<string, unknown> | null {
  const raw = store.get(conversationStorageKey(sessionId))
  return raw === undefined ? null : JSON.parse(raw) as Record<string, unknown>
}

/** 一次 openSession 调用的现场：调用时视图是否已经写好。 */
interface OpenRecord {
  id: string
  viewAtOpen: string | null
}

/** 记录 openSession 调用，并抓取调用瞬间已写入的视图。 */
function recordingOpen (): { openSession: (sessionId: string) => void; opened: OpenRecord[] } {
  const opened: OpenRecord[] = []
  return {
    openSession: (sessionId: string) => {
      opened.push({ id: sessionId, viewAtOpen: readStoredView(sessionId) })
    },
    opened,
  }
}

interface FakeConfig {
  create?: (options: CreateOptions | undefined) => Promise<string>
  fork?: (options: ForkOptions) => Promise<string>
  ids?: readonly string[]
  byId?: Record<string, SessionSummaryLike | undefined>
}

interface FakeSessions {
  sessions: SessionsApi
  createCalls: Array<CreateOptions | undefined>
  forkCalls: ForkOptions[]
  snapshotReads: () => number
}

/** 造一个最小可用的 SessionsApi，并记录每次调用。 */
function makeSessions (config: FakeConfig = {}): FakeSessions {
  const createCalls: Array<CreateOptions | undefined> = []
  const forkCalls: ForkOptions[] = []
  let snapshotReads = 0
  const ids = config.ids ?? []
  const byId = config.byId ?? {}
  const sessions: SessionsApi = {
    create: async (options) => {
      createCalls.push(options)
      return config.create === undefined ? 'created-session' : await config.create(options)
    },
    fork: async (options) => {
      forkCalls.push(options)
      return config.fork === undefined ? 'forked-session' : await config.fork(options)
    },
    list: {
      getSnapshot: () => {
        snapshotReads += 1
        return { ids, byId }
      },
      subscribe: () => () => {},
    },
  }
  return { sessions, createCalls, forkCalls, snapshotReads: () => snapshotReads }
}

/** 组装 deps，并返回 openSession 的调用记录。 */
function makeDeps (
  sessions: SessionsApi,
  extra: Partial<Pick<ChatSessionDeps, 'viewId' | 'presetId'>> = {},
): { deps: ChatSessionDeps; opened: OpenRecord[] } {
  const { openSession, opened } = recordingOpen()
  return { deps: { sessions, openSession, ...extra }, opened }
}

/** 一个使用 chat 预设的会话行。 */
function chatRow (id: string): SessionSummaryLike {
  return { id, projectionValues: { agentPreset: 'chat' } }
}

beforeEach(() => {
  installMemoryStorage()
})

afterEach(() => {
  vi.restoreAllMocks()
  Reflect.deleteProperty(globalThis, 'localStorage')
})

describe('createChatSession', () => {
  it('用 chat 预设建会话，写入 chat 视图后再打开', async () => {
    const fake = makeSessions()
    const { deps, opened } = makeDeps(fake.sessions)

    const id = await createChatSession(deps)

    expect(id).toBe('created-session')
    expect(fake.createCalls).toHaveLength(1)
    expect(fake.createCalls[0]).toStrictEqual({ agentPreset: 'chat' })
    expect(readStoredView('created-session')).toBe('chat-a2ui')
    expect(opened).toStrictEqual([{ id: 'created-session', viewAtOpen: 'chat-a2ui' }])
    expect(fake.snapshotReads()).toBe(0)
  })

  it('继承父会话的 cwd', async () => {
    const fake = makeSessions({
      byId: { parent: { id: 'parent', cwd: 'D:\\work\\demo' } },
    })
    const { deps, opened } = makeDeps(fake.sessions)

    const id = await createChatSession(deps, 'parent')

    expect(id).toBe('created-session')
    expect(fake.createCalls[0]).toStrictEqual({ agentPreset: 'chat', cwd: 'D:\\work\\demo' })
    expect(fake.snapshotReads()).toBe(1)
    expect(opened).toHaveLength(1)
  })

  it('父会话没有 cwd、cwd 为空或快照里没有它时不传 cwd', async () => {
    const fake = makeSessions({
      ids: ['parent', 'blank'],
      byId: { parent: { id: 'parent' }, blank: { id: 'blank', cwd: '' } },
    })
    const { deps } = makeDeps(fake.sessions)

    await createChatSession(deps, 'parent')
    await createChatSession(deps, 'blank')
    await createChatSession(deps, 'missing-row')

    expect(fake.createCalls).toHaveLength(3)
    for (const options of fake.createCalls) {
      expect(Object.prototype.hasOwnProperty.call(options, 'cwd')).toBe(false)
    }
  })

  it('viewId / presetId 可以覆盖默认值', async () => {
    const fake = makeSessions()
    const { deps, opened } = makeDeps(fake.sessions, { viewId: 'custom-view', presetId: 'writer' })

    const id = await createChatSession(deps)

    expect(id).toBe('created-session')
    expect(fake.createCalls[0]).toStrictEqual({ agentPreset: 'writer' })
    expect(readStoredView('created-session')).toBe('custom-view')
    expect(opened).toStrictEqual([{ id: 'created-session', viewAtOpen: 'custom-view' }])
  })

  it('创建失败时返回 undefined 且绝不打开会话', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const fake = makeSessions({
      create: async () => {
        throw new Error('create failed')
      },
    })
    const { deps, opened } = makeDeps(fake.sessions)

    const id = await createChatSession(deps)

    expect(id).toBeUndefined()
    expect(opened).toStrictEqual([])
    expect(store.size).toBe(0)
    expect(warn).toHaveBeenCalled()
  })

  it('宿主返回空 id 时视为失败', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const fake = makeSessions({ create: async () => '' })
    const { deps, opened } = makeDeps(fake.sessions)

    const id = await createChatSession(deps)

    expect(id).toBeUndefined()
    expect(opened).toStrictEqual([])
    expect(warn).toHaveBeenCalled()
  })

  it('父会话快照抛错时退化为不带 cwd 继续创建', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const sessions: SessionsApi = {
      create: async () => 'created-session',
      fork: async () => 'forked-session',
      list: {
        getSnapshot: () => {
          throw new Error('snapshot failed')
        },
        subscribe: () => () => {},
      },
    }
    const { openSession, opened } = recordingOpen()

    const id = await createChatSession({ sessions, openSession }, 'parent')

    expect(id).toBe('created-session')
    expect(readStoredView('created-session')).toBe('chat-a2ui')
    expect(opened).toStrictEqual([{ id: 'created-session', viewAtOpen: 'chat-a2ui' }])
    expect(warn).toHaveBeenCalled()
  })

  it('存储不可用时仍然打开会话', async () => {
    installStorage(null)
    const fake = makeSessions()
    const { deps, opened } = makeDeps(fake.sessions)

    const id = await createChatSession(deps)

    expect(id).toBe('created-session')
    expect(opened).toStrictEqual([{ id: 'created-session', viewAtOpen: null }])
  })
})

describe('forkChatAt', () => {
  it('分支参数正确，子会话写入视图并打开，源会话不变', async () => {
    seedStored('source', { draft: '旧草稿', view: 'native' })
    const fake = makeSessions({ fork: async () => 'child' })
    const { deps, opened } = makeDeps(fake.sessions)

    const id = await forkChatAt(deps, 'source', 12)

    expect(id).toBe('child')
    expect(fake.forkCalls).toHaveLength(1)
    expect(fake.forkCalls[0]).toStrictEqual({
      sessionId: 'source',
      atSeq: 12,
      increaseTitle: true,
    })
    expect(readStoredView('child')).toBe('chat-a2ui')
    expect(opened).toStrictEqual([{ id: 'child', viewAtOpen: 'chat-a2ui' }])
    expect(readStored('source')).toStrictEqual({ draft: '旧草稿', view: 'native' })
  })

  it('viewId 覆盖子会话写入的视图', async () => {
    const fake = makeSessions({ fork: async () => 'child' })
    const { deps } = makeDeps(fake.sessions, { viewId: 'custom-view' })

    const id = await forkChatAt(deps, 'source', 3)

    expect(id).toBe('child')
    expect(readStoredView('child')).toBe('custom-view')
  })

  it('分支失败时返回 undefined、不打开、源会话视图不变', async () => {
    seedStored('source', { view: 'native' })
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const fake = makeSessions({
      fork: async () => {
        throw new Error('fork failed')
      },
    })
    const { deps, opened } = makeDeps(fake.sessions)

    const id = await forkChatAt(deps, 'source', 7)

    expect(id).toBeUndefined()
    expect(opened).toStrictEqual([])
    expect(readStoredView('source')).toBe('native')
    expect(warn).toHaveBeenCalled()
  })

  it('宿主返回空 id 时视为失败', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const fake = makeSessions({ fork: async () => '' })
    const { deps, opened } = makeDeps(fake.sessions)

    const id = await forkChatAt(deps, 'source', 1)

    expect(id).toBeUndefined()
    expect(opened).toStrictEqual([])
    expect(warn).toHaveBeenCalled()
  })
})

describe('seedChatViewsWith / seedChatViews', () => {
  it('只给 Chat 预设且没有视图的会话补写', () => {
    const fake = makeSessions({
      ids: ['chat-new', 'chat-seeded', 'chat-draft', 'other-preset', 'no-preset', 'missing-row'],
      byId: {
        'chat-new': chatRow('chat-new'),
        'chat-seeded': chatRow('chat-seeded'),
        'chat-draft': chatRow('chat-draft'),
        'other-preset': { id: 'other-preset', projectionValues: { agentPreset: 'writer' } },
        'no-preset': { id: 'no-preset' },
      },
    })
    seedStored('chat-seeded', { draft: 'keep', view: 'native' })
    seedStored('chat-draft', { draft: 'keep me', view: null })

    const written = seedChatViewsWith(fake.sessions)

    expect(written).toBe(2)
    expect(readStoredView('chat-new')).toBe('chat-a2ui')
    expect(readStoredView('chat-seeded')).toBe('native')
    expect(readStoredView('chat-draft')).toBe('chat-a2ui')
    expect(readStored('chat-draft')).toStrictEqual({ draft: 'keep me', view: 'chat-a2ui' })
    expect(store.has(conversationStorageKey('other-preset'))).toBe(false)
    expect(store.has(conversationStorageKey('no-preset'))).toBe(false)
    expect(store.has(conversationStorageKey('missing-row'))).toBe(false)
  })

  it('自定义 presetId / viewId', () => {
    const fake = makeSessions({
      ids: ['writer-row', 'chat-row'],
      byId: {
        'writer-row': { id: 'writer-row', projectionValues: { agentPreset: 'writer' } },
        'chat-row': chatRow('chat-row'),
      },
    })

    const written = seedChatViewsWith(fake.sessions, 'custom-view', 'writer')

    expect(written).toBe(1)
    expect(readStoredView('writer-row')).toBe('custom-view')
    expect(store.has(conversationStorageKey('chat-row'))).toBe(false)
  })

  it('已有非空视图时绝不覆盖', () => {
    const fake = makeSessions({
      ids: ['chat-seeded'],
      byId: { 'chat-seeded': chatRow('chat-seeded') },
    })
    seedStored('chat-seeded', { view: 'native' })

    expect(seedChatViewsWith(fake.sessions)).toBe(0)
    expect(readStoredView('chat-seeded')).toBe('native')
  })

  it('seedChatViews 使用 deps 里的覆盖值', () => {
    const fake = makeSessions({
      ids: ['writer-row'],
      byId: { 'writer-row': { id: 'writer-row', projectionValues: { agentPreset: 'writer' } } },
    })
    const { openSession } = recordingOpen()

    const written = seedChatViews({ sessions: fake.sessions, openSession, viewId: 'custom-view', presetId: 'writer' })

    expect(written).toBe(1)
    expect(readStoredView('writer-row')).toBe('custom-view')
  })

  it('快照抛错时返回 0 且不抛', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const sessions: SessionsApi = {
      create: async () => 'x',
      fork: async () => 'x',
      list: {
        getSnapshot: () => {
          throw new Error('snapshot failed')
        },
        subscribe: () => () => {},
      },
    }

    expect(seedChatViewsWith(sessions)).toBe(0)
    expect(warn).toHaveBeenCalled()
  })

  it('存储不可用时返回 0', () => {
    const fake = makeSessions({
      ids: ['chat-new'],
      byId: { 'chat-new': chatRow('chat-new') },
    })
    installStorage(null)

    expect(seedChatViewsWith(fake.sessions)).toBe(0)
  })
})
