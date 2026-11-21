/** Chat 工作区：路径读取、路径归一化、幂等注册。 */

import { describe, expect, it, vi } from 'vitest'
import {
  CHAT_PATHS_GLOBAL,
  ensureChatWorkspace,
  normalizeWorkspacePath,
  readInjectedChatPaths,
  type ChatWorkspaceApi,
} from '../src/client/chat-mode/chat-workspace'

function makeWorkspaces (config: {
  items?: Array<{ workspaceId: string; path?: string }>
  create?: (input: { path: string }) => Promise<{ workspaceId: string }>
} = {}): { api: ChatWorkspaceApi; create: ReturnType<typeof vi.fn> } {
  const create = vi.fn(config.create ?? (async () => ({ workspaceId: 'ws-chat' })))
  const api: ChatWorkspaceApi = {
    list: { getSnapshot: () => ({ items: config.items ?? [] }) },
    create: config.create === undefined && config.items !== undefined ? undefined : create,
  }
  if (config.items !== undefined) delete api.create
  return { api, create }
}

describe('readInjectedChatPaths', () => {
  it('读宿主半推的页面全局', () => {
    const scope = { [CHAT_PATHS_GLOBAL]: { chatWorkspace: 'C:/Users/x/.dsh/chat' } }
    expect(readInjectedChatPaths(scope)).toEqual({ chatWorkspace: 'C:/Users/x/.dsh/chat' })
  })

  it('没推 / 形状不对时返回空对象，不抛错', () => {
    expect(readInjectedChatPaths({})).toEqual({})
    expect(readInjectedChatPaths(null)).toEqual({})
    expect(readInjectedChatPaths({ [CHAT_PATHS_GLOBAL]: { chatWorkspace: 42 } })).toEqual({})
  })
})

describe('normalizeWorkspacePath', () => {
  it('统一斜杠、去掉尾斜杠', () => {
    expect(normalizeWorkspacePath('C:\\Users\\x\\.dsh\\chat\\')).toBe('c:/users/x/.dsh/chat')
  })

  it('Windows 盘符路径忽略大小写，POSIX 保持原样', () => {
    expect(normalizeWorkspacePath('C:/Users/X')).toBe('c:/users/x')
    expect(normalizeWorkspacePath('/Home/Chat')).toBe('/Home/Chat')
  })
})

describe('ensureChatWorkspace', () => {
  it('已有同路径的工作区时直接复用，不注册', async () => {
    const { api, create } = makeWorkspaces({
      items: [
        { workspaceId: 'ws-other', path: 'C:/work/demo' },
        { workspaceId: 'ws-chat', path: 'C:\\Users\\x\\.dsh\\chat' },
      ],
    })
    await expect(ensureChatWorkspace(api, 'c:/users/x/.dsh/chat')).resolves.toBe('ws-chat')
    expect(create).not.toHaveBeenCalled()
  })

  it('没有时注册一次', async () => {
    const { api, create } = makeWorkspaces({})
    await expect(ensureChatWorkspace(api, 'C:\\Users\\x\\.dsh\\chat')).resolves.toBe('ws-chat')
    expect(create).toHaveBeenCalledWith({ path: 'C:\\Users\\x\\.dsh\\chat' })
  })

  it('没有路径 / 服务不支持 create / 注册失败都返回 undefined，不抛错', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await expect(ensureChatWorkspace(makeWorkspaces({}).api, undefined)).resolves.toBeUndefined()
    const readonly = makeWorkspaces({})
    delete readonly.api.create
    await expect(ensureChatWorkspace(readonly.api, 'C:\\x')).resolves.toBeUndefined()
    const failing = makeWorkspaces({ create: async () => { throw new Error('nope') } })
    await expect(ensureChatWorkspace(failing.api, 'C:\\x')).resolves.toBeUndefined()
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })
})
