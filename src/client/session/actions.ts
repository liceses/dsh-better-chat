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
  /** Host workspace service：Chat 会话要投进 Chat 工作区，而不是父会话的工作区。 */
  workspaces?: WorkspacesApi
  /** 返回 Chat 工作区的 id；拿不到时省略，会话会落到宿主的默认目录。 */
  chatWorkspaceId?: () => string | undefined
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
 * Create a Chat-preset Session without navigating to it.
 *
 * 归属规则（ADR 0003）：Chat 会话**不继承**父会话的 `cwd` 与工作区。
 * 父会话属于「某个工程」，而 Chat 会话属于 Chat 自己；继承会把对话写进项目
 * 工作区，与工程会话混排。目标位置由 `chatWorkspaceId()` 给出（Chat 工作区），
 * 拿不到时省略归属，会话落到宿主的默认目录。
 * @param deps - Host dependencies.
 * @param parentSessionId - 保留给调用方表达「从哪里开的新对话」；当前不影响归属。
 * @returns the created Session id, or undefined on any failure.
 */
export async function createChatSession (
  deps: ChatSessionDeps,
  _parentSessionId?: string,
): Promise<string | undefined> {
  const { sessions } = deps
  const options: CreateOptions = { agentPreset: resolvePresetId(deps) }
  const workspaceId = deps.chatWorkspaceId?.()
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