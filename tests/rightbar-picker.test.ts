/**
 * 右栏会话下拉的纯逻辑：列哪些行、当前项是谁、要不要 retain。
 *
 * 这里只测数据判据；React 一侧的 retain / release 时序在 rightbar-tab.test.ts。
 */

import { describe, expect, it } from 'vitest'
import type { SessionSummaryLike } from '../src/client/chat-a2ui/types'
import {
  buildRightbarSessionOptions,
  rightbarRetainTarget,
} from '../src/client/chat-mode/rightbar-picker'
import type { ChatSessionRow } from '../src/client/chat-mode/select'

/** 造一行 Chat 会话（listChatSessions 的输出形状）。 */
function row (id: string, title: string, extra: Partial<ChatSessionRow> = {}): ChatSessionRow {
  return { id, title, updatedAt: 0, running: false, blank: false, ...extra }
}

/** 造一段宿主会话摘要。 */
function summary (patch: Partial<SessionSummaryLike> = {}): SessionSummaryLike {
  return { id: 'own', ...patch }
}

describe('buildRightbarSessionOptions', () => {
  const rows: ChatSessionRow[] = [
    row('b', '旅行计划'),
    row('c', '周报'),
  ]

  it('默认把 tab 所在会话排第一并标成当前项', () => {
    const { options, target } = buildRightbarSessionOptions({
      rows,
      ownSessionId: 'a',
      ownSummary: summary({ displayTitle: '当前对话' }),
    })
    expect(target).toBe('a')
    expect(options.map(option => option.id)).toStrictEqual(['a', 'b', 'c'])
    expect(options[0]).toStrictEqual({
      id: 'a',
      label: '当前对话（本 tab）',
      own: true,
      current: true,
      running: false,
    })
    expect(options.filter(option => option.current).map(option => option.id)).toStrictEqual(['a'])
    expect(options[1]?.own).toBe(false)
    expect(options[1]?.current).toBe(false)
  })

  it('tab 会话本身也在 Chat 行里时不重复列，只用它的标题加后缀', () => {
    const { options } = buildRightbarSessionOptions({
      rows: [row('a', '主对话'), ...rows],
      ownSessionId: 'a',
    })
    expect(options.map(option => option.id)).toStrictEqual(['a', 'b', 'c'])
    expect(options[0]?.label).toBe('主对话（本 tab）')
  })

  it('tab 会话不是 chat 预设（不在 rows 里）时也补一行', () => {
    const { options, target } = buildRightbarSessionOptions({
      rows,
      ownSessionId: 'plain',
      ownSummary: summary({ displayTitle: '普通会话' }),
    })
    expect(options.map(option => option.id)).toStrictEqual(['plain', 'b', 'c'])
    expect(options[0]?.label).toBe('普通会话（本 tab）')
    expect(target).toBe('plain')
  })

  it('摘要还没拉到 / 是空会话时给出可读标题', () => {
    const missing = buildRightbarSessionOptions({ rows, ownSessionId: 'x' })
    expect(missing.options[0]?.label).toBe('本 tab 会话（本 tab）')

    const blank = buildRightbarSessionOptions({
      rows,
      ownSessionId: 'x',
      ownSummary: summary({ title: 'dsh-A2UI 空白对话', blank: true }),
    })
    // 空白会话的标题由 chatRowTitle 归一化成「空白对话」，与左栏列表同一套叫法。
    expect(blank.options[0]?.label).toBe('空白对话（本 tab）')

    // 摘要到了但没有标题：与左栏列表一样叫「未命名对话」（不是「本 tab 会话」）。
    const untitled = buildRightbarSessionOptions({ rows, ownSessionId: 'x', ownSummary: summary() })
    expect(untitled.options[0]?.label).toBe('未命名对话（本 tab）')
  })

  it('用户选过别的会话时，目标与高亮项都跟着走', () => {
    const { options, target } = buildRightbarSessionOptions({
      rows,
      ownSessionId: 'a',
      preferredId: 'c',
    })
    expect(target).toBe('c')
    expect(options.map(option => option.current)).toStrictEqual([false, false, true])
    // 本 tab 会话仍排第一，方便一键切回。
    expect(options[0]?.id).toBe('a')
  })

  it('选过的会话已经不在列表里时回退到 tab 会话', () => {
    const { target } = buildRightbarSessionOptions({
      rows,
      ownSessionId: 'a',
      preferredId: 'deleted',
    })
    expect(target).toBe('a')
  })

  it('宿主没给 sessionId 时不替用户挑会话', () => {
    const none = buildRightbarSessionOptions({ rows })
    expect(none.target).toBeUndefined()
    expect(none.options.map(option => option.id)).toStrictEqual(['b', 'c'])
    expect(none.options.every(option => !option.current && !option.own)).toBe(true)

    // 只有用户真选过，才显示那个会话。
    const picked = buildRightbarSessionOptions({ rows, preferredId: 'b' })
    expect(picked.target).toBe('b')
    expect(picked.options[0]?.current).toBe(true)
  })

  it('空 id 与 undefined 等价', () => {
    const { target, options } = buildRightbarSessionOptions({
      rows,
      ownSessionId: '',
      preferredId: '',
    })
    expect(target).toBeUndefined()
    expect(options.map(option => option.id)).toStrictEqual(['b', 'c'])
  })

  it('运行中的会话带「运行中」后缀', () => {
    const { options } = buildRightbarSessionOptions({
      rows: [row('b', '旅行计划', { running: true })],
      ownSessionId: 'a',
      ownSummary: summary({ displayTitle: '当前对话', running: true }),
    })
    expect(options[0]?.label).toBe('当前对话 · 运行中（本 tab）')
    expect(options[1]?.label).toBe('旅行计划 · 运行中')
    expect(options[1]?.running).toBe(true)
  })
})

describe('rightbarRetainTarget', () => {
  it('目标就是 tab 自己的会话时不需要 retain（继承外层绑定）', () => {
    expect(rightbarRetainTarget('a', 'a')).toBeUndefined()
    expect(rightbarRetainTarget(undefined, 'a')).toBeUndefined()
  })

  it('目标换成别的会话时才 retain 那个会话', () => {
    expect(rightbarRetainTarget('b', 'a')).toBe('b')
  })

  it('没有 tab 会话身份时，显式选择仍然要 retain', () => {
    expect(rightbarRetainTarget('b', undefined)).toBe('b')
    expect(rightbarRetainTarget('b', '')).toBe('b')
  })
})
