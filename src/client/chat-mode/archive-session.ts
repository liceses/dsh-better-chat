/**
 * 归档会话：把「有没有这个能力」「失败怎么办」收在一处。
 *
 * 宿主的能力是可选的（测试替身、旧版本可能没有），所以这里返回布尔值而不是抛错；
 * 调用方（列表）据此决定是否需要乐观隐藏那一行。
 */

import type { UiWorkspaceApi } from '../chat-a2ui/types'

/**
 * 归档一个会话。
 * @param api - 宿主 uiWorkspace 的最小面；可以是 undefined。
 * @param sessionId - 目标会话。
 * @returns 真的发出去了并且没抛错时为 true。
 */
export async function archiveChatSession (
  api: UiWorkspaceApi | undefined,
  sessionId: string,
): Promise<boolean> {
  const archive = api?.archiveSession
  if (typeof archive !== 'function' || sessionId.length === 0) return false
  try {
    await archive(sessionId)
    return true
  } catch (error) {
    console.warn('[chat-a2ui] 归档会话失败：', error)
    return false
  }
}
