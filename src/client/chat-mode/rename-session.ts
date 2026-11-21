/**
 * 重命名会话。
 *
 * 宿主的 `session.rename` 是**快捷键命令**，而且 `ctx.shortcuts` 没有按 id 执行的 API；
 * 最短的受支持路径是借一次会话绑定直接调 `SessionFace.rename(title)`——它成功后还会
 * 立刻同步 title 投影，列表行马上变（打 wire 的话要等推送帧）。
 */

import type { SessionsApi } from '../chat-a2ui/types'

/** 重命名结果。 */
export interface RenameResult {
  ok: boolean
  /** 失败时可直接展示的一句话。 */
  reason?: string
}

/** 标题归一化后为空时宿主会拒绝（`session/title-invalid`），提前拦掉。 */
function normalize (title: string): string {
  return title.trim().slice(0, 200)
}

/**
 * 重命名一个会话。
 * @param sessions - 宿主 Sessions 服务（需要 `using`）。
 * @param sessionId - 目标会话。
 * @param title - 新标题；会被 trim。
 * @returns 成功或一句可展示的原因。
 */
export async function renameChatSession (
  sessions: SessionsApi,
  sessionId: string,
  title: string,
): Promise<RenameResult> {
  const next = normalize(title)
  if (next.length === 0) return { ok: false, reason: '标题不能为空' }
  const using = sessions.using
  if (typeof using !== 'function') return { ok: false, reason: '宿主没有提供会话绑定' }
  try {
    await using(sessionId, { source: 'chatMode' }, async (reference) => {
      const face = reference.binding?.session
      if (typeof face?.rename !== 'function') throw new Error('宿主没有提供重命名能力')
      await face.rename(next)
    })
    return { ok: true }
  } catch (error) {
    const raw = error instanceof Error ? error.message : String(error)
    if (raw.includes('title-invalid')) return { ok: false, reason: '标题不合法' }
    console.warn('[chat-a2ui] 重命名失败：', error)
    return { ok: false, reason: '重命名失败：' + raw.slice(0, 120) }
  }
}
