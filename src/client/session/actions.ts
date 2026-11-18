/**
 * Session actions for the dedicated Chat mode: create a Chat-preset Session
 * and branch from a completed turn. They never navigate and never write view
 * preferences; the Chat page owns its own active selection and navigation.
 *
 * Failure is always non-destructive: the action returns undefined and leaves
 * the current Chat selection untouched.
 */

import { CHAT_PRESET_ID } from '../constants'
import type { SessionsApi, WorkspacesApi } from '../chat-a2ui/types'

/** Host dependencies used by the Chat session actions. */
export interface ChatSessionDeps {
  /** Host Session service. */
  sessions: SessionsApi
  /** Host workspace service, used only to keep a new Session in its parent's workspace. */
  workspaces?: WorkspacesApi
  /** Agent preset id, default {@link CHAT_PRESET_ID}. */
  presetId?: string
}

/** Options accepted by sessions.create. */
interface CreateOptions {
  agentPreset: string
  cwd?: string
  workspaceId?: string
}

/** Resolve the Agent preset id for this action. */
function resolvePresetId (deps: ChatSessionDeps): string {
  return deps.presetId ?? CHAT_PRESET_ID
}

/** A Host-created Session id must be a non-empty string. */
function isSessionId (value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

/**
 * Read the parent Session's working directory. Missing rows and Host errors
 * degrade to "let the Host decide" rather than failing the whole action.
 */
function readParentCwd (sessions: SessionsApi, parentSessionId: string | undefined): string | undefined {
  if (parentSessionId === undefined || parentSessionId.length === 0) return undefined
  try {
    const row = sessions.list.getSnapshot().byId[parentSessionId]
    return typeof row?.cwd === 'string' && row.cwd.length > 0 ? row.cwd : undefined
  } catch (error) {
    console.warn('[chat-a2ui] 读取父会话工作目录失败：', error)
    return undefined
  }
}

/**
 * Find the parent Session's workspace. The Session itself does not expose a
 * workspace id, so reverse-map through the workspace list, then fall back to
 * a path match. A missing workspace is not an error: create still runs.
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
    return items.find(item => item.path === cwd)?.workspaceId
  }
  return undefined
}

/**
 * Create a Chat-preset Session without navigating to it.
 * @param deps - Host dependencies.
 * @param parentSessionId - optional Session whose cwd/workspace should be inherited.
 * @returns the created Session id, or undefined on any failure.
 */
export async function createChatSession (
  deps: ChatSessionDeps,
  parentSessionId?: string,
): Promise<string | undefined> {
  const { sessions } = deps
  const cwd = readParentCwd(sessions, parentSessionId)
  const workspaceId = readParentWorkspaceId(sessions, deps.workspaces, parentSessionId, cwd)
  const options: CreateOptions = { agentPreset: resolvePresetId(deps) }
  if (cwd !== undefined) options.cwd = cwd
  if (workspaceId !== undefined) options.workspaceId = workspaceId

  let created: unknown
  try {
    created = await sessions.create(options)
  } catch (error) {
    console.warn('[chat-a2ui] 新建对话失败：', error)
    return undefined
  }
  if (!isSessionId(created)) {
    console.warn('[chat-a2ui] 新建对话失败：宿主没有返回会话 id')
    return undefined
  }
  return created
}

/**
 * Fork a Session at a completed turn without navigating to the child.
 * @param deps - Host dependencies.
 * @param sessionId - source Session.
 * @param seq - branch point (the turn's closing seq).
 * @returns the child Session id, or undefined on failure.
 */
export async function forkChatAt (
  deps: ChatSessionDeps,
  sessionId: string,
  seq: number,
): Promise<string | undefined> {
  let child: unknown
  try {
    child = await deps.sessions.fork({ sessionId, atSeq: seq, increaseTitle: true })
  } catch (error) {
    console.warn('[chat-a2ui] 从该轮分支失败：', error)
    return undefined
  }
  if (!isSessionId(child)) {
    console.warn('[chat-a2ui] 从该轮分支失败：宿主没有返回会话 id')
    return undefined
  }
  return child
}
