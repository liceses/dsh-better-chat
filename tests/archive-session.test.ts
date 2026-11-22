/** 归档动作：能力可缺、失败带回原因、不抛错。 */

import { describe, expect, it, vi } from 'vitest'
import { archiveChatSession } from '../src/client/chat-mode/archive-session'
import type { UiWorkspaceApi } from '../src/client/chat-a2ui/types'

describe('archiveChatSession', () => {
  it('转发给宿主的 archiveSession，成功后返回 ok', async () => {
    const archiveSession = vi.fn(async () => {})
    const api: UiWorkspaceApi = { archiveSession }
    await expect(archiveChatSession(api, 's1')).resolves.toEqual({ ok: true })
    expect(archiveSession).toHaveBeenCalledWith('s1')
  })

  it('宿主没有这个能力时返回原因，不抛错', async () => {
    await expect(archiveChatSession(undefined, 's1')).resolves.toMatchObject({ ok: false })
    const empty = await archiveChatSession({}, 's1')
    expect(empty.ok).toBe(false)
    expect(empty.reason).toContain('归档')
    await expect(archiveChatSession({ archiveSession: async () => {} }, '')).resolves.toMatchObject({ ok: false })
  })

  it('正在生成的会话被宿主拒绝时，把人话原因带出来', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const api: UiWorkspaceApi = {
      archiveSession: async () => { throw new Error('workspace/session-active') },
    }
    const result = await archiveChatSession(api, 's1')
    expect(result.ok).toBe(false)
    expect(result.reason).toContain('正在生成')
    warn.mockRestore()
  })

  it('调用归档时必须保留 this（摘下来会丢服务状态）', async () => {
    const api = {
      marker: 'uiWorkspace',
      // 故意依赖 this：丢了就抛与宿主同类错误。
      async archiveSession (this: { marker?: string } | undefined) {
        if (this === undefined || this.marker !== 'uiWorkspace') {
          throw new Error("Cannot read properties of undefined (reading 'closed')")
        }
      },
    } as unknown as UiWorkspaceApi
    await expect(archiveChatSession(api, 's1')).resolves.toEqual({ ok: true })
  })

  it('其它错误也给一句可展示的话', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const api: UiWorkspaceApi = {
      archiveSession: async () => { throw new Error('boom') },
    }
    const result = await archiveChatSession(api, 's1')
    expect(result.ok).toBe(false)
    expect(result.reason).toContain('boom')
    warn.mockRestore()
  })
})
