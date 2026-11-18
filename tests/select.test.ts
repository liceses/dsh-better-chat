/** Pure filtering and selection for the Chat sidebar. */

import { describe, expect, it } from 'vitest'
import type { SessionListSnapshot, SessionSummaryLike } from '../src/client/chat-a2ui/types'
import { chatRowTitle, listChatSessions, pickChatSession } from '../src/client/chat-mode/select'

/** Build a snapshot from rows in declaration order. */
function snapshot (rows: Array<[string, SessionSummaryLike | undefined]>): SessionListSnapshot {
  return {
    ids: rows.map(([id]) => id),
    byId: Object.fromEntries(rows),
  }
}

describe('listChatSessions', () => {
  it('keeps only the chat preset', () => {
    const rows = listChatSessions(snapshot([
      ['chat', { id: 'chat', projectionValues: { agentPreset: 'chat' } }],
      ['writer', { id: 'writer', projectionValues: { agentPreset: 'writer' } }],
      ['none', { id: 'none' }],
      ['missing', undefined],
    ]))
    expect(rows.map(row => row.id)).toStrictEqual(['chat'])
  })

  it('sorts newest first and keeps input order for ties', () => {
    const rows = listChatSessions(snapshot([
      ['old', { id: 'old', updatedAt: 10, projectionValues: { agentPreset: 'chat' } }],
      ['tie-a', { id: 'tie-a', updatedAt: 20, projectionValues: { agentPreset: 'chat' } }],
      ['tie-b', { id: 'tie-b', updatedAt: 20, projectionValues: { agentPreset: 'chat' } }],
      ['new', { id: 'new', updatedAt: 30, projectionValues: { agentPreset: 'chat' } }],
      ['undated', { id: 'undated', projectionValues: { agentPreset: 'chat' } }],
    ]))
    expect(rows.map(row => row.id)).toStrictEqual(['new', 'tie-a', 'tie-b', 'old', 'undated'])
  })

  it('normalizes title, running, and blank', () => {
    const rows = listChatSessions(snapshot([
      ['named', {
        id: 'named',
        displayTitle: ' 旅行计划 ',
        running: true,
        blank: true,
        updatedAt: 5,
        projectionValues: { agentPreset: 'chat' },
      }],
      ['untitled', { id: 'untitled', projectionValues: { agentPreset: 'chat' } }],
    ]))
    expect(rows[0]).toStrictEqual({
      id: 'named',
      title: '旅行计划',
      updatedAt: 5,
      running: true,
      blank: true,
    })
    expect(rows[1]?.title).toBe('未命名对话')
    expect(rows[1]?.running).toBe(false)
    expect(rows[1]?.blank).toBe(false)
  })

  it('honours a custom preset id', () => {
    const rows = listChatSessions(snapshot([
      ['writer', { id: 'writer', projectionValues: { agentPreset: 'writer' } }],
      ['chat', { id: 'chat', projectionValues: { agentPreset: 'chat' } }],
    ]), 'writer')
    expect(rows.map(row => row.id)).toStrictEqual(['writer'])
  })
})

describe('pickChatSession', () => {
  const rows = [
    { id: 'newest', title: 'a', updatedAt: 3, running: false, blank: false },
    { id: 'older', title: 'b', updatedAt: 1, running: false, blank: false },
  ]

  it('keeps a current selection that still exists', () => {
    expect(pickChatSession(rows, 'older')).toBe('older')
  })

  it('falls back to the first row when the current selection is gone', () => {
    expect(pickChatSession(rows, 'deleted')).toBe('newest')
    expect(pickChatSession(rows, null)).toBe('newest')
    expect(pickChatSession(rows, undefined)).toBe('newest')
  })

  it('returns undefined for an empty list', () => {
    expect(pickChatSession([], 'anything')).toBeUndefined()
  })
})

describe('chatRowTitle', () => {
  const row = (title: string, blank = false): Parameters<typeof chatRowTitle>[0] => ({
    id: 'row',
    title,
    updatedAt: 0,
    running: false,
    blank,
  })

  it('collapses host blank-session titles to one label', () => {
    expect(chatRowTitle(row('dsh-A2UI 空白对话', true))).toBe('空白对话')
    expect(chatRowTitle(row('未命名对话', true))).toBe('空白对话')
    expect(chatRowTitle(row('', true))).toBe('空白对话')
  })

  it('keeps a real title even when the Session is blank', () => {
    expect(chatRowTitle(row('旅行计划', true))).toBe('旅行计划')
  })

  it('falls back for empty non-blank titles', () => {
    expect(chatRowTitle(row('   '))).toBe('未命名对话')
  })
})
