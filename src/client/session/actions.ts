/**
 * 会话层动作：新建对话、从某一轮分支、给历史会话补写视图偏好。
 *
 * 共同约束：动作失败时只写日志并返回 undefined，绝不打开半个会话；
 * 视图偏好写入失败（存储被禁用）不影响建会话本身。
 */

import { CHAT_PRESET_ID, CHAT_VIEW_ID } from '../constants'
import type { SessionListSnapshot, SessionsApi, WorkspacesApi } from '../chat-a2ui/types'
import { hasStoredView, writeViewPreference } from './preferences'

/** 宿主注入给会话动作的依赖。 */
export interface ChatSessionDeps {
  /** 宿主会话服务（建会话、分支、列快照）。 */
  sessions: SessionsApi
  /** 宿主工作区服务；用于把新会话归入父会话所在工作区。 */
  workspaces?: WorkspacesApi
  /** 打开（切换到）目标会话。 */
  openSession: (sessionId: string) => void
  /** 在指定工作区开新会话：选中工作区、创建/复用空白会话、再打开。 */
  openWorkspace?: (
    workspaceId: string,
    beforeOpen?: (sessionId: string) => void,
    options?: { agentPreset?: string },
  ) => Promise<void>
  /** 要补写的视图 id，默认 {@link CHAT_VIEW_ID}。 */
  viewId?: string
  /** 新会话使用的预设 id，默认 {@link CHAT_PRESET_ID}。 */
  presetId?: string
}

/** sessions.create 需要的字段；cwd 缺省时不传，交给宿主决定。 */
interface CreateOptions {
  agentPreset: string
  cwd?: string
  workspaceId?: string
}

/** 解析实际使用的视图 id。 */
function resolveViewId (deps: ChatSessionDeps): string {
  return deps.viewId ?? CHAT_VIEW_ID
}

/** 解析实际使用的预设 id。 */
function resolvePresetId (deps: ChatSessionDeps): string {
  return deps.presetId ?? CHAT_PRESET_ID
}

/** 会话 id 必须是宿主返回的非空字符串。 */
function isSessionId (value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

/**
 * 从父会话的列表快照里取工作目录。
 * 读不到（没有父会话、快照里没有它、宿主抛错）就返回 undefined，
 * 表示"新建时不指定 cwd"。
 */
function readParentCwd (sessions: SessionsApi, parentSessionId: string | undefined): string | undefined {
  if (parentSessionId === undefined || parentSessionId.length === 0) return undefined
  try {
    const row = sessions.list.getSnapshot().byId[parentSessionId]
    const cwd = row?.cwd
    return typeof cwd === 'string' && cwd.length > 0 ? cwd : undefined
  } catch (error) {
    console.warn('[chat-a2ui] 读取父会话工作目录失败：', error)
    return undefined
  }
}

/**
 * 打开刚建好的会话。
 * 宿主切换失败只记录，不掩盖"会话确实已经建好"这个事实。
 */
function openCreatedSession (openSession: (sessionId: string) => void, sessionId: string): void {
  try {
    openSession(sessionId)
  } catch (error) {
    console.warn('[chat-a2ui] 打开新会话失败：', error)
  }
}

/**
 * 找父会话所在的工作区。
 *
 * 会话列表本身不暴露 workspaceId，所以从工作区的 sessionIds 反查；
 * 会话不在任何工作区（未分组）时退化成按 cwd 匹配工作区路径。
 * 都找不到就返回 undefined，交给宿主按 cwd 处理。
 */
function readParentWorkspaceId (
  sessions: SessionsApi,
  workspaces: WorkspacesApi | undefined,
  parentSessionId: string | undefined,
  cwd: string | undefined,
): string | undefined {
  if (workspaces === undefined) return undefined
  let items: ReturnType<WorkspacesApi['list']['getSnapshot']>['items']
  try {
    items = workspaces.list.getSnapshot().items
  } catch (error) {
    console.warn('[chat-a2ui] 读取工作区列表失败：', error)
    return undefined
  }
  if (parentSessionId !== undefined) {
    const owner = items.find(item => item.sessionIds?.includes(parentSessionId) === true)
    if (owner !== undefined) return owner.workspaceId
  }
  if (cwd !== undefined) {
    const byPath = items.find(item => item.path === cwd)
    if (byPath !== undefined) return byPath.workspaceId
  }
  return undefined
}

/**
 * 新建一个 Chat 会话，成功后就地切换过去。
 * @param deps 宿主依赖。
 * @param parentSessionId 父会话；有 cwd 时新会话会继承。
 * @returns 新会话 id；失败返回 undefined（且不会调用 openSession）。
 */
export async function createChatSession (
  deps: ChatSessionDeps,
  parentSessionId?: string,
): Promise<string | undefined> {
  const { sessions, openSession } = deps
  const viewId = resolveViewId(deps)
  const presetId = resolvePresetId(deps)

  const cwd = readParentCwd(sessions, parentSessionId)
  const workspaceId = readParentWorkspaceId(sessions, deps.workspaces, parentSessionId, cwd)

  // 工作区路径：走 uiWorkspace.openWorkspace，由宿主同时完成
  // “选中工作区 → 建/复用空白会话 → 打开”，避免只 openSession 时停在落地页。
  if (workspaceId !== undefined && deps.openWorkspace !== undefined) {
    let created: string | undefined
    try {
      await deps.openWorkspace(
        workspaceId,
        (sessionId) => {
          created = sessionId
          writeViewPreference(sessionId, viewId)
        },
        { agentPreset: presetId },
      )
      return created
    } catch (error) {
      console.warn('[chat-a2ui] 新建对话失败：', error)
      return undefined
    }
  }

  let childId: unknown
  try {
    const options: CreateOptions = { agentPreset: presetId }
    if (cwd !== undefined) options.cwd = cwd
    if (workspaceId !== undefined) options.workspaceId = workspaceId
    childId = await sessions.create(options)
  } catch (error) {
    console.warn('[chat-a2ui] 新建对话失败：', error)
    return undefined
  }

  if (!isSessionId(childId)) {
    console.warn('[chat-a2ui] 新建对话失败：宿主没有返回会话 id')
    return undefined
  }

  // 视图偏好写失败也不影响打开：存储被禁用时聊天仍然要能用。
  writeViewPreference(childId, viewId)
  openCreatedSession(openSession, childId)
  return childId
}

/**
 * 从某轮消息处分支出一个新会话，并把 Chat 视图带给子会话。
 * @param deps 宿主依赖。
 * @param sessionId 源会话。
 * @param seq 分支点（该轮消息的 seq）。
 * @returns 子会话 id；失败返回 undefined，源会话不受任何影响。
 */
export async function forkChatAt (
  deps: ChatSessionDeps,
  sessionId: string,
  seq: number,
): Promise<string | undefined> {
  const { sessions, openSession } = deps
  const viewId = resolveViewId(deps)

  let childId: unknown
  try {
    childId = await sessions.fork({ sessionId, atSeq: seq, increaseTitle: true })
  } catch (error) {
    console.warn('[chat-a2ui] 从该轮分支失败：', error)
    return undefined
  }

  if (!isSessionId(childId)) {
    console.warn('[chat-a2ui] 从该轮分支失败：宿主没有返回会话 id')
    return undefined
  }

  writeViewPreference(childId, viewId)
  openCreatedSession(openSession, childId)
  return childId
}

/**
 * 扫描会话列表，给"Chat 预设但还没有视图偏好"的会话补写视图。
 * 已有字符串 view 的会话绝不覆盖。
 * @param sessions 会话服务。
 * @param viewId 要补写的视图 id，默认 {@link CHAT_VIEW_ID}。
 * @param presetId 目标预设 id，默认 {@link CHAT_PRESET_ID}。
 * @returns 实际写入的会话数量。
 */
export function seedChatViewsWith (
  sessions: SessionsApi,
  viewId: string = CHAT_VIEW_ID,
  presetId: string = CHAT_PRESET_ID,
): number {
  let snapshot: SessionListSnapshot
  try {
    snapshot = sessions.list.getSnapshot()
  } catch (error) {
    console.warn('[chat-a2ui] 读取会话列表失败：', error)
    return 0
  }

  let written = 0
  for (const id of snapshot.ids) {
    const row = snapshot.byId[id]
    if (row === undefined) continue
    if (row.projectionValues?.agentPreset !== presetId) continue
    if (hasStoredView(id)) continue
    if (writeViewPreference(id, viewId)) written += 1
  }
  return written
}

/**
 * {@link seedChatViewsWith} 的依赖版本，供插件激活时调用。
 * @param deps 宿主依赖；`viewId` / `presetId` 缺省时用 Chat 默认值。
 * @returns 实际写入的会话数量。
 */
export function seedChatViews (deps: ChatSessionDeps): number {
  return seedChatViewsWith(deps.sessions, deps.viewId, deps.presetId)
}
