/**
 * Pure Session-list selection for the dedicated Chat mode.
 *
 * The Host session list has no "current Session" field; the Chat page owns
 * its own active selection, so these helpers only translate a snapshot into a
 * deterministic, newest-first list and pick a fallback.
 */

import { CHAT_PRESET_ID } from '../constants'
import type { SessionListSnapshot, SessionSummaryLike } from '../chat-a2ui/types'

/** One row the Chat sidebar can render. */
export interface ChatSessionRow {
  id: string
  title: string
  updatedAt: number
  running: boolean
  blank: boolean
}

/** Read one summary's sortable timestamp. */
function timestampOf (row: SessionSummaryLike): number {
  return typeof row.updatedAt === 'number' && Number.isFinite(row.updatedAt) ? row.updatedAt : 0
}

/** Human title with a stable fallback for a never-renamed blank Session. */
function titleOf (row: SessionSummaryLike): string {
  const title = row.displayTitle ?? row.title
  return typeof title === 'string' && title.trim().length > 0 ? title.trim() : '未命名对话'
}

/**
 * Display title for a Chat row.
 * Blank Sessions often inherit "dsh-A2UI 空白对话" from the host; showing that
 * repeated string in the list is noisy, so collapse it to "空白对话".
 * @param row - filtered Chat row.
 * @returns title safe for a single-line list row.
 */
export function chatRowTitle (row: ChatSessionRow): string {
  const title = row.title.trim()
  if (row.blank && (title === '' || title === '未命名对话' || title.endsWith('空白对话'))) {
    return '空白对话'
  }
  return title === '' ? '未命名对话' : title
}

/**
 * Filter to Chat-preset Sessions and sort newest first.
 * The input order breaks ties so the list stays stable across snapshots.
 * @param snapshot - current Session-list snapshot.
 * @param presetId - Agent preset identity to keep.
 * @returns rows safe to render without touching Host internals.
 */
export function listChatSessions (
  snapshot: SessionListSnapshot,
  presetId: string = CHAT_PRESET_ID,
): ChatSessionRow[] {
  const rows: Array<ChatSessionRow & { order: number }> = []
  snapshot.ids.forEach((id, order) => {
    const row = snapshot.byId[id]
    if (row === undefined) return
    if (row.projectionValues?.agentPreset !== presetId) return
    rows.push({
      id,
      title: titleOf(row),
      updatedAt: timestampOf(row),
      running: row.running === true,
      blank: row.blank === true,
      order,
    })
  })
  rows.sort((left, right) => {
    if (left.updatedAt !== right.updatedAt) return right.updatedAt - left.updatedAt
    return left.order - right.order
  })
  return rows.map(({ order: _order, ...row }) => row)
}

/**
 * Pick the Session the Chat page should show.
 * A still-known current selection wins; otherwise the newest row is used.
 * @param rows - filtered Chat rows.
 * @param currentId - last selection held by the Chat page.
 * @returns an existing row id, or undefined when Chat has no Session yet.
 */
export function pickChatSession (
  rows: readonly ChatSessionRow[],
  currentId: string | null | undefined,
): string | undefined {
  if (typeof currentId === 'string' && rows.some(row => row.id === currentId)) return currentId
  return rows[0]?.id
}