/**
 * Chat session actions: create/fork calls stay pure (no navigation, no view
 * preferences), inherit the parent workspace when possible, and degrade to
 * undefined on every failure path.
 */

import { describe, expect, it, vi } from 'vitest'
import type { SessionSummaryLike, SessionsApi, WorkspacesApi } from '../src/client/chat-a2ui/types'
import { createChatSession, forkChatAt } from '../src/client/session/actions'

type CreateOptions = NonNullable<Parameters<SessionsApi['create']>[0]>
type ForkOptions = NonNullable<Parameters<SessionsApi['fork']>[0]>

interface FakeConfig {
  create?: (options: CreateOptions | undefined) => Promise<string>
  fork?: (options: ForkOptions) => Promise<string>
  ids?: readonly string[]
  byId?: Record<string, SessionSummaryLike | undefined>
  snapshot?: () => never
}

interface FakeSessions {
  sessions: SessionsApi
  createCalls: Array<CreateOptions | undefined>
  forkCalls: ForkOptions[]
}

/** Minimal SessionsApi plus call recording. */
function makeSessions (config: FakeConfig = {}): FakeSessions {
  const createCalls: Array<CreateOptions | undefined> = []
  const forkCalls: ForkOptions[] = []
  return {
    createCalls,
    forkCalls,
    sessions: {
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
          if (config.snapshot !== undefined) config.snapshot()
          return { ids: config.ids ?? [], byId: config.byId ?? {} }
        },
        subscribe: () => () => {},
      },
    },
  }
}

/** Minimal WorkspacesApi list snapshot. */
function makeWorkspaces (items: Array<{ workspaceId: string; path?: string; sessionIds?: string[] }>): WorkspacesApi {
  return { list: { getSnapshot: () => ({ items }) } }
}

describe('createChatSession', () => {
  it('creates with the chat preset and does not navigate', async () => {
    const fake = makeSessions()
    const id = await createChatSession({ sessions: fake.sessions })

    expect(id).toBe('created-session')
    expect(fake.createCalls).toStrictEqual([{ agentPreset: 'chat' }])
    expect(fake.forkCalls).toHaveLength(0)
  })

  it('inherits the parent cwd', async () => {
    const fake = makeSessions({
      byId: { parent: { id: 'parent', cwd: 'D:\\work\\demo' } },
    })
    await createChatSession({ sessions: fake.sessions }, 'parent')
    expect(fake.createCalls[0]).toStrictEqual({ agentPreset: 'chat', cwd: 'D:\\work\\demo' })
  })

  it('omits blank or unknown parent cwd', async () => {
    const fake = makeSessions({
      byId: { blank: { id: 'blank', cwd: '' } },
    })
    await createChatSession({ sessions: fake.sessions }, 'blank')
    await createChatSession({ sessions: fake.sessions }, 'missing')
    for (const options of fake.createCalls) {
      expect(Object.prototype.hasOwnProperty.call(options, 'cwd')).toBe(false)
    }
  })

  it('inherits the workspace that owns the parent Session', async () => {
    const fake = makeSessions({
      byId: { parent: { id: 'parent', cwd: 'D:\\work\\demo' } },
    })
    const workspaces = makeWorkspaces([
      { workspaceId: 'other', path: 'D:\\elsewhere' },
      { workspaceId: 'ws-one', path: 'D:\\work', sessionIds: ['parent'] },
    ])
    await createChatSession({ sessions: fake.sessions, workspaces }, 'parent')
    expect(fake.createCalls[0]).toStrictEqual({
      agentPreset: 'chat',
      cwd: 'D:\\work\\demo',
      workspaceId: 'ws-one',
    })
  })

  it('falls back to a path match when no workspace lists the parent', async () => {
    const fake = makeSessions({
      byId: { parent: { id: 'parent', cwd: 'D:\\work\\demo' } },
    })
    const workspaces = makeWorkspaces([
      { workspaceId: 'ws-two', path: 'D:\\work\\demo', sessionIds: [] },
    ])
    await createChatSession({ sessions: fake.sessions, workspaces }, 'parent')
    expect(fake.createCalls[0]?.workspaceId).toBe('ws-two')
  })

  it('honours a custom preset id', async () => {
    const fake = makeSessions()
    await createChatSession({ sessions: fake.sessions, presetId: 'writer' })
    expect(fake.createCalls[0]).toStrictEqual({ agentPreset: 'writer' })
  })

  it('returns undefined and warns when create throws', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const fake = makeSessions({
      create: async () => { throw new Error('create failed') },
    })
    await expect(createChatSession({ sessions: fake.sessions })).resolves.toBeUndefined()
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('treats an empty Session id as failure', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const fake = makeSessions({ create: async () => '' })
    await expect(createChatSession({ sessions: fake.sessions })).resolves.toBeUndefined()
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('continues without cwd when the Session snapshot throws', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const fake = makeSessions({
      snapshot: () => { throw new Error('snapshot failed') },
    })
    await expect(createChatSession({ sessions: fake.sessions }, 'parent')).resolves.toBe('created-session')
    expect(fake.createCalls[0]).toStrictEqual({ agentPreset: 'chat' })
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })
})

describe('forkChatAt', () => {
  it('forks at the turn seq and returns the child without navigation', async () => {
    const fake = makeSessions({ fork: async () => 'child' })
    const id = await forkChatAt({ sessions: fake.sessions }, 'source', 12)

    expect(id).toBe('child')
    expect(fake.forkCalls).toStrictEqual([{
      sessionId: 'source',
      atSeq: 12,
      increaseTitle: true,
    }])
  })

  it('returns undefined and warns when fork throws', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const fake = makeSessions({
      fork: async () => { throw new Error('fork failed') },
    })
    await expect(forkChatAt({ sessions: fake.sessions }, 'source', 7)).resolves.toBeUndefined()
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('treats an empty child id as failure', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const fake = makeSessions({ fork: async () => '' })
    await expect(forkChatAt({ sessions: fake.sessions }, 'source', 1)).resolves.toBeUndefined()
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })
})
