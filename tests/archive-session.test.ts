/** 归档动作：能力可缺、失败不抛。 */

import { describe, expect, it, vi } from 'vitest'
import { archiveChatSession } from '../src/client/chat-mode/archive-session'
import type { UiWorkspaceApi } from '../src/client/chat-a2ui/types'

describe('archiveChatSession', () => {
  it('转发给宿主的 archiveSession 并返回 true', async () => {
    const archiveSession = vi.fn(async () => {})
    const api: UiWorkspaceApi = { archiveSession }
    await expect(archiveChatSession(api, 's1')).resolves.toBe(true)
    expect(archiveSession).toHaveBeenCalledWith('s1')
  })

  it('宿主没有这个能力时返回 false，不抛错', async () => {
    await expect(archiveChatSession(undefined, 's1')).resolves.toBe(false)
    await expect(archiveChatSession({}, 's1')).resolves.toBe(false)
    await expect(archiveChatSession({ archiveSession: async () => {} }, '')).resolves.toBe(false)
  })

  it('宿主抛错时吞掉并返回 false（列表据此不隐藏）', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const api: UiWorkspaceApi = { archiveSession: async () => { throw new Error('nope') } }
    await expect(archiveChatSession(api, 's1')).resolves.toBe(false)
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })
})
