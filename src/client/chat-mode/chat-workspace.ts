/**
 * Chat 工作区：把 Chat 会话放进一个只属于对话的 workspace。
 *
 * 两件事分开：
 * - **目录**由宿主半创建（只有它有 fs 权限），路径通过 `webserver/index-inject`
 *   推成页面全局 `__DSH_CHAT_A2UI_PATHS__`；
 * - **注册**由客户端半完成（`workspaces.create` 只接受已存在的目录）。
 *
 * 拿不到路径或注册失败都不抛错：会话退回宿主默认目录（左栏「未分组」），
 * 功能照常，只是归属退化。
 */

import type { WorkspacesApi } from '../chat-a2ui/types'

/** 宿主半推入的页面全局（见 src/index.ts 的 CHAT_PATHS_GLOBAL）。 */
export const CHAT_PATHS_GLOBAL = '__DSH_CHAT_A2UI_PATHS__'

/** 从页面全局读出 Chat 工作区路径。 */
export interface InjectedChatPaths {
  /** Chat 工作区的绝对路径；宿主半没推时为 undefined。 */
  chatWorkspace?: string
}

/**
 * 读宿主半注入的路径。
 * @param scope - 读取来源，默认 `globalThis`（测试可传一个假对象）。
 * @returns 解析后的路径；形状不对时返回空对象，绝不抛错。
 */
export function readInjectedChatPaths (scope: unknown = globalThis): InjectedChatPaths {
  if (typeof scope !== 'object' || scope === null) return {}
  const raw = (scope as Record<string, unknown>)[CHAT_PATHS_GLOBAL]
  if (typeof raw !== 'object' || raw === null) return {}
  const value = (raw as Record<string, unknown>).chatWorkspace
  return typeof value === 'string' && value.length > 0 ? { chatWorkspace: value } : {}
}

/** 路径归一化：统一斜杠、去尾斜杠、Windows 下忽略大小写（宿主 realpath 后可能换大小写）。 */
export function normalizeWorkspacePath (path: string): string {
  const unified = path.replace(/\\/g, '/').replace(/\/+$/, '')
  // Windows 盘符与目录名不区分大小写；其它平台保持原样。
  return /^[A-Za-z]:/.test(unified) ? unified.toLowerCase() : unified
}

/** 工作区服务的最小面（list 必有，create 可能没有）。 */
export interface ChatWorkspaceApi extends WorkspacesApi {}

/**
 * 幂等拿到 Chat 工作区的 id：先按路径找，找不到才注册。
 *
 * 并发调用会各自走一遍 list，但 `create` 由调用方串行（controller 在创建会话前
 * 只 await 一次），所以这里不做额外加锁。
 * @param workspaces - 宿主 workspace 服务。
 * @param path - Chat 工作区的绝对路径（来自注入）。
 * @returns 工作区 id；没有路径、服务不支持 create、或注册失败时为 undefined。
 */
export async function ensureChatWorkspace (
  workspaces: ChatWorkspaceApi,
  path: string | undefined,
): Promise<string | undefined> {
  if (typeof path !== 'string' || path.length === 0) return undefined
  const wanted = normalizeWorkspacePath(path)
  try {
    const items = workspaces.list.getSnapshot().items
    const existing = items.find(item => typeof item.path === 'string' && normalizeWorkspacePath(item.path) === wanted)
    if (existing !== undefined) return existing.workspaceId
  } catch (error) {
    console.warn('[chat-a2ui] 读取工作区列表失败：', error)
    return undefined
  }
  if (typeof workspaces.create !== 'function') return undefined
  try {
    const created = await workspaces.create({ path })
    return created.workspaceId
  } catch (error) {
    console.warn('[chat-a2ui] 注册 Chat 工作区失败：', error)
    return undefined
  }
}
