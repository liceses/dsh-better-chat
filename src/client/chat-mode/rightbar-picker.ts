/**
 * 右栏 Chat tab 的会话下拉：把「列哪些行 / 当前项是谁 / 实际显示谁」算成纯数据。
 *
 * tab 默认显示**自己所在的会话**（宿主按 session 作用域注入的 sessionId）；
 * 用户从下拉里换到别的 Chat 会话之后，才由组件去 retain 那个会话的引用。
 *
 * 这里不碰 React、不碰宿主服务，只吃 `listChatSessions` 的结果与一小段会话摘要，
 * 所以能单测（tests/rightbar-picker.test.ts）。React 一侧的 retain/release 时序
 * 由 tests/rightbar-tab.test.ts 的 jsdom 接线测试盯住。
 */

import type { SessionSummaryLike } from '../chat-a2ui/types'
import { chatRowTitle } from './select'
import type { ChatSessionRow } from './select'

/** 下拉里的一行。 */
export interface RightbarSessionOption {
  /** 会话 id（同时是 select 的 value 与 retain 的目标）。 */
  id: string
  /** 单行展示文本。 */
  label: string
  /** 是否是 tab 自己所在的会话（默认目标）。 */
  own: boolean
  /** 是否是当前实际显示的会话，即下拉的选中（高亮）项。 */
  current: boolean
  /** 该会话是否正在生成：标签后缀「运行中」。 */
  running: boolean
}

/** {@link buildRightbarSessionOptions} 的输入。 */
export interface RightbarSessionOptionsInput {
  /** `listChatSessions` 过滤后的 Chat 会话（新到旧）。 */
  rows: readonly ChatSessionRow[]
  /** tab 所在的会话；宿主没注入 sessionId 时为 undefined。 */
  ownSessionId?: string | undefined
  /**
   * 宿主快照里 tab 会话的摘要。
   * tab 会话不一定是 chat 预设（比如在普通会话里开的右栏），
   * 所以它可能**不在** rows 里；这里单独拿标题，免得下拉里冒出一个光秃秃的 id。
   */
  ownSummary?: SessionSummaryLike | undefined
  /** 用户在下拉里显式选中的会话；undefined 表示「跟随 tab 会话」。 */
  preferredId?: string | undefined
}

/** {@link buildRightbarSessionOptions} 的结果。 */
export interface RightbarSessionOptions {
  /** 下拉要列的行：tab 会话固定第一，其余按新到旧。 */
  options: RightbarSessionOption[]
  /** 实际要显示的会话；undefined 表示宿主要求「继承外层会话作用域」。 */
  target: string | undefined
}

/** 空字符串与 undefined 一样表示「没有这个选择」。 */
function knownId (value: string | undefined): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

/** 单行标签：标题 + 「运行中」后缀 + 「（本 tab）」后缀。 */
function labelOf (title: string, running: boolean, own: boolean): string {
  const text = running ? title + ' · 运行中' : title
  return own ? text + '（本 tab）' : text
}

/**
 * tab 会话的统一行外观。
 * 标题归一化沿用 Chat 会话列表那一套（chatRowTitle），两处叫法不会分叉。
 * @param id - tab 所在会话 id。
 * @param summary - 宿主快照里的摘要，可能还没拉到。
 * @returns 可直接交给 chatRowTitle 的行。
 */
function ownRowOf (id: string, summary: SessionSummaryLike | undefined): ChatSessionRow {
  const raw = summary?.displayTitle ?? summary?.title ?? ''
  const title = typeof raw === 'string' ? raw.trim() : ''
  return {
    id,
    // 摘要还没到（而不是「摘要里没标题」）时给一个说明性的名字，别显示裸 id；
    // 摘要到了但标题为空，交给 chatRowTitle 归一化成「未命名对话 / 空白对话」。
    title: summary === undefined ? '本 tab 会话' : title,
    updatedAt: 0,
    running: summary?.running === true,
    blank: summary?.blank === true,
  }
}

/**
 * 组装下拉的行与实际显示目标。
 *
 * 规则（顺序即优先级）：
 * 1. tab 自己所在的会话永远在列表第一，并带「（本 tab）」；它不在 Chat 行里时补一行。
 * 2. 其余只列 `listChatSessions` 给的 Chat 会话，保持新到旧。
 * 3. 目标 = 用户选过且仍在列表里的那个会话；否则回到 tab 会话。
 *    没有 tab 会话（宿主没注入 sessionId）时**不替用户挑**别的会话。
 * 4. 目标那一行 current 为 true —— 它就是下拉的高亮项。
 * @param input - Chat 行、tab 会话、用户选择。
 * @returns 行清单与实际显示目标。
 */
export function buildRightbarSessionOptions (input: RightbarSessionOptionsInput): RightbarSessionOptions {
  const ownId = knownId(input.ownSessionId)
  const options: RightbarSessionOption[] = []

  if (ownId !== undefined) {
    const listed = input.rows.find(row => row.id === ownId)
    const row = listed ?? ownRowOf(ownId, input.ownSummary)
    options.push({
      id: ownId,
      label: labelOf(chatRowTitle(row), row.running, true),
      own: true,
      current: false,
      running: row.running,
    })
  }

  for (const row of input.rows) {
    // tab 会话已经在上面补过一行，不再重复。
    if (ownId !== undefined && row.id === ownId) continue
    options.push({
      id: row.id,
      label: labelOf(chatRowTitle(row), row.running, false),
      own: false,
      current: false,
      running: row.running,
    })
  }

  const preferred = knownId(input.preferredId)
  const picked = preferred !== undefined && options.some(option => option.id === preferred)
    ? preferred
    : undefined
  const target = picked ?? ownId

  return {
    options: options.map(option => ({ ...option, current: option.id === target })),
    target,
  }
}

/**
 * 决定这一帧要不要 retain 别的会话。
 *
 * 目标就是 tab 自己的会话时**不 retain**：外层会话作用域已经持着它，直接继承即可；
 * 只有切到别的会话才需要自己拿一份引用，并在切走 / 卸载时 release。
 * @param target - {@link buildRightbarSessionOptions} 给出的显示目标。
 * @param ownSessionId - tab 所在会话。
 * @returns 需要自己 retain 的会话 id；undefined 表示继承外层绑定。
 */
export function rightbarRetainTarget (
  target: string | undefined,
  ownSessionId: string | undefined,
): string | undefined {
  if (target === undefined) return undefined
  const own = knownId(ownSessionId)
  if (own !== undefined && target === own) return undefined
  return target
}
