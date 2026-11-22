/**
 * 归档会话：把「有没有这个能力」「宿主为什么拒绝」收在一处。
 *
 * 宿主的归档是**有能力拒绝**的：正在生成的会话会被 `workspace/session-active` 拒绝。
 * 所以这里返回原因而不是布尔值——调用方要能回滚乐观 UI 并告诉用户为什么。
 */

import type { UiWorkspaceApi } from '../chat-a2ui/types'

/** 归档结果。 */
export interface ArchiveResult {
  ok: boolean
  /** 失败时可直接展示的一句话。 */
  reason?: string
}

/** 把宿主错误压成一句能显示的话。 */
function describe (error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error)
  if (raw.includes('session-active')) return '这个对话正在生成，先停下来再归档'
  return '归档失败：' + raw.slice(0, 120)
}

/**
 * 归档一个会话。
 * @param api - 宿主 uiWorkspace 的最小面；可以是 undefined。
 * @param sessionId - 目标会话。
 * @returns 宿主接受时 `{ ok: true }`，否则带回一句原因。
 */
export async function archiveChatSession (
  api: UiWorkspaceApi | undefined,
  sessionId: string,
): Promise<ArchiveResult> {
  if (api === undefined || typeof api.archiveSession !== 'function') {
    return { ok: false, reason: '宿主没有提供归档能力' }
  }
  if (sessionId.length === 0) return { ok: false, reason: '没有选中对话' }
  // 必须绑在服务上：宿主的 archiveSession 内部会读自己的状态，摘下来调用会丢 this。
  const archive = api.archiveSession.bind(api)
  try {
    await archive(sessionId)
    return { ok: true }
  } catch (error) {
    console.warn('[chat-a2ui] 归档会话失败：', error)
    return { ok: false, reason: describe(error) }
  }
}
