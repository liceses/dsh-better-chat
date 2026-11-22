/** 重命名动作：走会话绑定，标题归一化，失败带回原因。 */

import { describe, expect, it, vi } from 'vitest'
import { renameChatSession } from '../src/client/chat-mode/rename-session'
import type { SessionsApi } from '../src/client/chat-a2ui/types'

function makeSessions (config: {
  rename?: (title: string) => Promise<unknown>
  using?: SessionsApi['using']
} = {}): { sessions: SessionsApi; rename: ReturnType<typeof vi.fn> } {
  const rename = vi.fn(config.rename ?? (async () => undefined))
  const sessions: SessionsApi = {
    create: async () => 'x',
    fork: async () => 'y',
    list: { getSnapshot: () => ({ ids: [], byId: {} }), subscribe: () => () => {} },
    using: config.using ?? (async (_id, _options, fn) => fn({ binding: { session: { rename } } })),
  }
  return { sessions, rename }
}

describe('renameChatSession', () => {
  it('借会话绑定改名，标题去掉首尾空白', async () => {
    const harness = makeSessions()
    await expect(renameChatSession(harness.sessions, 's1', '  新标题  ')).resolves.toEqual({ ok: true })
    expect(harness.rename).toHaveBeenCalledWith('新标题')
  })

  it('空标题直接拒绝，不碰宿主', async () => {
    const harness = makeSessions()
    const result = await renameChatSession(harness.sessions, 's1', '   ')
    expect(result).toEqual({ ok: false, reason: '标题不能为空' })
    expect(harness.rename).not.toHaveBeenCalled()
  })

  it('宿主没有 using 时给出原因', async () => {
    const sessions: SessionsApi = {
      create: async () => 'x',
      fork: async () => 'y',
      list: { getSnapshot: () => ({ ids: [], byId: {} }), subscribe: () => () => {} },
    }
    const result = await renameChatSession(sessions, 's1', '标题')
    expect(result.ok).toBe(false)
    expect(result.reason).toContain('会话绑定')
  })

  it('宿主拒绝非法标题时给人话原因', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const harness = makeSessions({ rename: async () => { throw new Error('session/title-invalid') } })
    const result = await renameChatSession(harness.sessions, 's1', '标题')
    expect(result).toEqual({ ok: false, reason: '标题不合法' })
    warn.mockRestore()
  })

  it('调用 using 时必须保留 this（摘下来会报 retain of undefined）', async () => {
    let seen: unknown
    const sessions: SessionsApi = {
      create: async () => 'x',
      fork: async () => 'y',
      list: { getSnapshot: () => ({ ids: [], byId: {} }), subscribe: () => () => {} },
      // 故意写成「依赖 this」的方法：this 丢了就抛与宿主一致的错。
      using: async function (this: unknown, _id, _options, fn) {
        seen = this
        const self = this as { marker?: string } | undefined
        if (self === undefined || self.marker !== 'sessions') {
          throw new Error("Cannot read properties of undefined (reading 'retain')")
        }
        return fn({ binding: { session: { rename: async () => undefined } } })
      } as SessionsApi['using'],
    }
    ;(sessions as unknown as { marker: string }).marker = 'sessions'

    const result = await renameChatSession(sessions, 's1', '标题')
    expect(result).toEqual({ ok: true })
    expect(seen).toBe(sessions)
  })

  it('其它错误给一句可展示的话', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const harness = makeSessions({ rename: async () => { throw new Error('boom') } })
    const result = await renameChatSession(harness.sessions, 's1', '标题')
    expect(result.ok).toBe(false)
    expect(result.reason).toContain('boom')
    warn.mockRestore()
  })
})
