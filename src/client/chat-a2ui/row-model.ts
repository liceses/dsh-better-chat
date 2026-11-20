/**
 * 聊天行的数据模型：把宿主节点（kind + data）收窄成可渲染的 RowView。
 *
 * 三条约定：
 * 1. 分派只认 node.kind；data.kind 一律不看——宿主两者不保证一致，
 *    错配时以节点 kind 为准（见 tests/row-model.test.ts 的「kind 错配」）。
 * 2. 本模块不依赖 React，读取全部按运行时形状兜底，任何垃圾输入都不抛错。
 * 3. 仍需旧渲染器的 kind 原样透传（legacy），DOM 与改造前完全一致。
 *
 * ChatRow.tsx 只消费这里的结果，那边不再有 `data as Xxx` 断言。
 */
import type {
  AssistantBlock,
  AssistantData,
  ImageAttachmentRef,
  ToolCallData,
} from './types'

// ---------------------------------------------------------------------------
// 运行时读取工具：宿主字段是多版本合并的，types.ts 只给出理想形状。
// ---------------------------------------------------------------------------

/** 任意对象形状；所有运行时读取都从这里出发。 */
export type Rec = Record<string, unknown>

/**
 * 把未知值收窄成记录。
 * @param value - 任何运行时值。
 * @returns 对象时返回自身（数组也算），否则 undefined。
 */
export function asRecord (value: unknown): Rec | undefined {
  return typeof value === 'object' && value !== null ? (value as Rec) : undefined
}

/**
 * 读取一个非空字符串字段。
 * @param source - 已收窄的记录，允许缺失。
 * @param key - 字段名。
 * @returns 原始字符串（不做 trim）；空白串与缺失一律 undefined。
 */
export function readString (source: Rec | undefined, key: string): string | undefined {
  const value = source?.[key]
  return typeof value === 'string' && value.trim() !== '' ? value : undefined
}

/**
 * 读取一个有限数字字段（时间戳、seq、计数等）。
 * @param source - 已收窄的记录，允许缺失。
 * @param key - 字段名。
 * @returns 有限数字；NaN / Infinity / 缺失一律 undefined。
 */
export function readNumber (source: Rec | undefined, key: string): number | undefined {
  const value = source?.[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

/**
 * 校验一个运行时值是不是有限数字。
 * @param value - 任何运行时值。
 * @returns 有限数字时返回自身，否则 undefined。
 */
function readFiniteNumber (value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

/**
 * 从常见错误负载里提取一句人类可读的文案。
 * @param source - 错误负载（已收窄），允许缺失。
 * @returns 找到的文案；字段都不认识时 undefined。
 */
function readMessage (source: Rec | undefined): string | undefined {
  if (source === undefined) return undefined
  const direct = readString(source, 'message') ??
    readString(source, 'text') ??
    readString(source, 'reason') ??
    readString(source, 'detail')
  if (direct !== undefined) return direct
  const raw = source['error']
  if (typeof raw === 'string' && raw.trim() !== '') return raw
  const error = asRecord(raw)
  return readString(error, 'message') ?? readString(error, 'reason') ?? readString(error, 'code')
}

/**
 * 数字转千分位文案；toLocaleString 在极端环境会抛，兜底成原样字符串。
 * @param value - 已确认有限的数字。
 * @returns 千分位后的文案。
 */
export function formatCount (value: number): string {
  try {
    return Math.round(value).toLocaleString('zh-CN')
  } catch {
    return String(Math.round(value))
  }
}

/**
 * 把未知形状的 tokenUsage 压成一行可读文案。
 * @param usage - 宿主给的用量对象，形状不保证。
 * @returns 形如 `输入 1,200 · 输出 340 tokens`；一个字段都认不出时 undefined。
 */
function formatTokenUsage (usage: unknown): string | undefined {
  const rec = asRecord(usage)
  if (rec === undefined) return undefined
  const input = readNumber(rec, 'inputTokens') ?? readNumber(rec, 'input') ?? readNumber(rec, 'promptTokens')
  const output = readNumber(rec, 'outputTokens') ?? readNumber(rec, 'output') ?? readNumber(rec, 'completionTokens')
  const total = readNumber(rec, 'totalTokens') ?? readNumber(rec, 'total')
  const parts: string[] = []
  if (input !== undefined) parts.push('输入 ' + formatCount(input))
  if (output !== undefined) parts.push('输出 ' + formatCount(output))
  if (total !== undefined && (input === undefined || output === undefined)) parts.push('合计 ' + formatCount(total))
  if (parts.length === 0) return undefined
  return parts.join(' · ') + ' tokens'
}

// ---------------------------------------------------------------------------
// 用户消息：user / steering / context 共用同一份内容块拆解。
// ---------------------------------------------------------------------------

/** 一条用户消息按运行时形状拆开的四类内容。 */
export interface UserParts {
  /** 文本块，按原顺序；保持纯文本，绝不渲染 Markdown。 */
  texts: string[]
  /** 可显示的图片附件。 */
  images: ImageAttachmentRef[]
  /** 文件附件只留名字与字节数，够画一枚 chip。 */
  files: { name: string; bytes: number }[]
  /** 认不出的内容块数量，渲染成「+N 个不支持的内容块」。 */
  unsupported: number
}

/**
 * 读取一个图片附件引用。
 * @param value - 内容块里的 attachment 字段。
 * @returns 至少有 attachmentId 时返回引用，缺失的数值字段补 0。
 */
function readImageAttachment (value: unknown): ImageAttachmentRef | undefined {
  const rec = asRecord(value)
  const attachmentId = readString(rec, 'attachmentId')
  if (attachmentId === undefined) return undefined
  const name = readString(rec, 'name')
  return {
    attachmentId,
    mediaType: readString(rec, 'mediaType') ?? 'image/png',
    bytes: readNumber(rec, 'bytes') ?? 0,
    width: readNumber(rec, 'width') ?? 0,
    height: readNumber(rec, 'height') ?? 0,
    ...(name === undefined ? {} : { name }),
  }
}

/**
 * 按运行时形状拆用户消息；文本保持纯文本，绝不渲染 Markdown。
 * @param content - 节点 data 的 content 字段，形状不保证。
 * @returns 拆好的文本 / 图片 / 文件 / 未知块计数。
 */
export function splitUserContent (content: unknown): UserParts {
  const parts: UserParts = { texts: [], images: [], files: [], unsupported: 0 }
  if (!Array.isArray(content)) return parts
  for (const block of content) {
    const rec = asRecord(block)
    if (rec === undefined) {
      parts.unsupported += 1
      continue
    }
    const type = rec['type']
    if (type === 'text') {
      const text = readString(rec, 'text')
      if (text !== undefined) parts.texts.push(text)
      continue
    }
    if (type === 'image') {
      const attachment = readImageAttachment(rec['attachment'])
      if (attachment === undefined) parts.unsupported += 1
      else parts.images.push(attachment)
      continue
    }
    if (type === 'file') {
      const attachment = asRecord(rec['attachment'])
      const name = readString(attachment, 'name')
      if (name === undefined) parts.unsupported += 1
      else parts.files.push({ name, bytes: readNumber(attachment, 'bytes') ?? 0 })
      continue
    }
    parts.unsupported += 1
  }
  return parts
}

/**
 * 上下文注入优先用 source.sections 的可读文本，避免把 <system-reminder> 原样摊开。
 * @param data - context 节点的 data，形状不保证。
 * @returns 可展开显示的上下文文本；没有内容时为空串。
 */
export function readContextText (data: unknown): string {
  const rec = asRecord(data)
  const source = asRecord(rec?.['source'])
  const sections = source?.['sections']
  if (Array.isArray(sections)) {
    const lines: string[] = []
    for (const item of sections) {
      const section = asRecord(item)
      const text = readString(section, 'text')
      if (text !== undefined) lines.push(text)
    }
    if (lines.length > 0) return lines.join('\n')
  }
  return splitUserContent(rec?.['content']).texts.join('\n\n').trim()
}

// ---------------------------------------------------------------------------
// 过程提示：turn-error / turn-max-tokens / model-retry / turn-process
// ---------------------------------------------------------------------------

/** notice 族节点的四种 kind。 */
export const NOTICE_KINDS = ['turn-error', 'turn-max-tokens', 'model-retry', 'turn-process'] as const

/** notice 族的 kind。 */
export type NoticeKind = typeof NOTICE_KINDS[number]

/** 一条过程提示的图标、标题与副文案。 */
export interface NoticeSpec {
  /** 图标字符（'!' 同时表示错误色）。 */
  icon: string
  /** 加粗标题。 */
  title: string
  /** 副文案，缺失时不渲染。 */
  text?: string
}

/**
 * 把 notice 族节点的 data 压成一行提示文案。
 * @param kind - 节点 kind；不认识时退化成「kind 原样当标题」。
 * @param data - 节点 data，形状不保证。
 * @returns 与改造前完全一致的图标 / 标题 / 副文案。
 */
export function noticeSpec (kind: string, data: unknown): NoticeSpec {
  const rec = asRecord(data)
  switch (kind) {
    case 'turn-error':
      return { icon: '!', title: '本轮出错', text: readMessage(rec) ?? '执行中断，可以重试一次。' }
    case 'turn-max-tokens':
      return { icon: '…', title: '已达输出上限', text: '本轮回复被截断。' }
    case 'model-retry': {
      const attempt = readNumber(rec, 'attempt') ?? readNumber(rec, 'attempts')
      const delay = readNumber(rec, 'delayMs') ?? readNumber(rec, 'delay')
      const reason = readMessage(rec)
      const bits: string[] = []
      bits.push(attempt === undefined ? '正在重试模型请求' : '第 ' + formatCount(attempt) + ' 次尝试')
      if (delay !== undefined) {
        bits.push(delay >= 1000 ? formatCount(delay / 1000) + ' 秒后重试' : formatCount(delay) + ' 毫秒后重试')
      }
      if (reason !== undefined) bits.push(reason)
      return { icon: '↻', title: '模型重试', text: bits.join(' · ') }
    }
    case 'turn-process': {
      const text = readString(rec, 'text') ?? readString(rec, 'message') ?? readString(rec, 'state')
      const step = readNumber(rec, 'step') ?? readNumber(rec, 'index')
      const bits: string[] = []
      if (step !== undefined) bits.push('步骤 ' + formatCount(step))
      if (text !== undefined) bits.push(text)
      return { icon: '⋯', title: '处理过程', text: bits.length === 0 ? undefined : bits.join(' · ') }
    }
    default:
      return { icon: '·', title: kind === '' ? '未知消息' : kind }
  }
}

// ---------------------------------------------------------------------------
// 行视图：宿主节点收窄后的判别联合，ChatRow 的渲染表按 type 查表。
// ---------------------------------------------------------------------------

/** 工具卡片的三种状态，与 ToolCard 的 data-state 一一对应。 */
export type ToolStatus = 'running' | 'done' | 'error'

/** 仍需旧组件渲染的三种 kind；它们的数据原样透传，行为保持不变。 */
export const LEGACY_KINDS = ['command', 'compaction', 'manual-compaction'] as const

/** 仍需旧组件渲染的 kind。 */
export type LegacyKind = typeof LEGACY_KINDS[number]

/** user / steering 行。 */
export interface UserView {
  type: 'user'
  /** 节点 kind：决定外框的 data-kind 与「引导」标签，不再看 data.kind。 */
  kind: 'user' | 'steering'
  /** 拆好的文本 / 图片 / 文件。 */
  parts: UserParts
  /** 消息时间戳（毫秒），缺失时不显示时间。 */
  time?: number
}

/** context 行（系统旁白，折叠成一条可展开的提示）。 */
export interface ContextView {
  type: 'context'
  /** 可展开显示的上下文文本；空串时调用方不渲染这一行。 */
  text: string
  /** 注入时间戳（毫秒），缺失时不显示时间。 */
  time?: number
}

/** assistant-step 行。 */
export interface AssistantView {
  type: 'assistant'
  /** 节点数据里的 step 状态。 */
  status?: AssistantData['status']
  /** 数据侧是否仍在生成（status === 'running'）；会话级运行态另由渲染器叠加。 */
  live: boolean
  /** 内容块，按模型输出顺序。 */
  blocks: AssistantBlock[]
  /** 该 step 的时间戳（毫秒）。 */
  time?: number
  /** 复制按钮用的纯文本（只取 text 块，块间空行分隔）。 */
  copyText: string
}

/** tool-call 行。 */
export interface ToolView {
  type: 'tool'
  /** 原始节点数据：卡片之外的扩展字段还在这里，不做二次收窄。 */
  data: unknown
  /** 已确认是对象的根调用描述，直接交给 ToolCard。 */
  root: ToolCallData['root']
  /** 工具名；缺失时为空串（卡片显示空名字，不再出现 undefined）。 */
  title: string
  /** 卡片状态，判据与 ToolCard 共用 toolStatusOf。 */
  status: ToolStatus
}

/** turn-tail 行（一轮结束的时间 / 用量 / 分支入口）。 */
export interface TurnTailView {
  type: 'turn-tail'
  /** 该轮结束的 seq；缺失时不能分支。 */
  seq?: number
  /** 该轮结束时间戳（毫秒）。 */
  time?: number
  /** 已格式化的 token 用量文案。 */
  usage?: string
  /** 宿主允许且拿得到 seq 时才给分支按钮。 */
  branchable: boolean
}

/** notice 行（turn-error / turn-max-tokens / model-retry / turn-process）。 */
export interface NoticeView {
  type: 'notice'
  /** 节点 kind，同时用作外框的 data-kind。 */
  kind: NoticeKind
  /** 已压好的图标 / 标题 / 副文案。 */
  spec: NoticeSpec
}

/** 仍需旧组件渲染的 kind：data 原样透传。 */
export interface LegacyView {
  type: 'legacy'
  /** command / compaction / manual-compaction。 */
  kind: LegacyKind
  /** 原始节点数据，由旧渲染器自己按形状读取。 */
  data: unknown
}

/** 纯标记节点（turn-trigger）：不渲染任何内容。 */
export interface HiddenView {
  type: 'hidden'
}

/** 未知 kind，或 data 根本不是对象。 */
export interface UnknownView {
  type: 'unknown'
  /** 节点 kind；空串表示宿主没给 kind。 */
  kind: string
  /** 原始节点数据，兜底卡片按形状读类型名与提示。 */
  data: unknown
}

/** 宿主节点 → 可渲染行的判别联合；ChatRow 的渲染表以 type 为键。 */
export type RowView =
  | UserView
  | ContextView
  | AssistantView
  | ToolView
  | TurnTailView
  | NoticeView
  | LegacyView
  | HiddenView
  | UnknownView

// ---------------------------------------------------------------------------
// 解析：每个 kind 一个纯函数，parseRow 只做分派。
// ---------------------------------------------------------------------------

/**
 * 读取 assistant step 的状态，非法值退化成 undefined。
 * @param value - data.status 的运行时值。
 * @returns 三个合法状态之一，或 undefined。
 */
function readAssistantStatus (value: unknown): AssistantData['status'] | undefined {
  return value === 'running' || value === 'settled' || value === 'interrupted' ? value : undefined
}

/**
 * 汇总可复制的纯文本（只取 text 块）。
 * @param blocks - 已确认是数组的内容块。
 * @returns 块间空行分隔的纯文本；没有 text 块时为空串。
 */
function collectText (blocks: readonly AssistantBlock[]): string {
  const parts: string[] = []
  for (const block of blocks) {
    const rec = asRecord(block)
    if (rec === undefined) continue
    if (rec['kind'] !== 'text') continue
    const text = readString(rec, 'text')
    if (text !== undefined) parts.push(text)
  }
  return parts.join('\n\n')
}

/**
 * 读取工具卡片的根调用描述。
 * ToolCard 内部对每个字段都做运行时兜底，所以这里只确认它是对象；
 * 类型断言仅用于衔接宿主契约里的形状，不再散落到渲染器里。
 * @param value - data.root 的运行时值。
 * @returns 根调用描述，或 undefined（此时整行退化成未知行）。
 */
function readToolRoot (value: unknown): ToolCallData['root'] | undefined {
  const rec = asRecord(value)
  return rec === undefined ? undefined : rec as unknown as ToolCallData['root']
}

/**
 * 工具卡片状态：有错误是 error；准备中、或刚开始且还没结果算 running；其余是 done。
 * 判据与 ToolCard 原本内联的那段完全一致，两边共用这一份。
 * @param root - 工具调用的根描述。
 * @returns 卡片的三种状态之一。
 */
export function toolStatusOf (root: ToolCallData['root']): ToolStatus {
  const hasError = root.isError === true || root.error !== undefined
  if (hasError) return 'error'
  const hasResult = root.content !== undefined
  if (root.phase === 'preparing') return 'running'
  if (root.phase === 'start' && !hasResult) return 'running'
  return 'done'
}

/**
 * 把宿主节点收窄成可渲染的行视图。
 *
 * 只按 node.kind 分派：data.kind 与节点 kind 不一致时，以节点 kind 为准。
 * 任何形状异常的 data 都退化成 { type: 'unknown' }，绝不抛错。
 * @param kind - 宿主节点 kind（调用方已把非字符串归一成空串）。
 * @param data - 宿主节点数据，运行时形状不可信。
 * @returns 与 kind 对应的行视图。
 */
export function parseRow (kind: string, data: unknown): RowView {
  // turn-trigger 是纯标记：只用于分组与运行分隔线，无论 payload 是什么都不渲染。
  if (kind === 'turn-trigger') return { type: 'hidden' }
  const rec = asRecord(data)
  if (rec === undefined) return { type: 'unknown', kind, data }
  switch (kind) {
    case 'user':
    case 'steering':
      return { type: 'user', kind, parts: splitUserContent(rec['content']), time: readFiniteNumber(rec['time']) }
    case 'context':
      return { type: 'context', text: readContextText(data), time: readFiniteNumber(rec['time']) }
    case 'assistant-step': {
      const blocks = Array.isArray(rec['blocks']) ? rec['blocks'] as AssistantBlock[] : []
      const status = readAssistantStatus(rec['status'])
      return {
        type: 'assistant',
        status,
        live: status === 'running',
        blocks,
        time: readFiniteNumber(rec['time']),
        copyText: collectText(blocks),
      }
    }
    case 'tool-call': {
      const root = readToolRoot(rec['root'])
      if (root === undefined) return { type: 'unknown', kind, data }
      return { type: 'tool', data, root, title: readString(asRecord(root), 'name') ?? '', status: toolStatusOf(root) }
    }
    case 'turn-tail': {
      const seq = readFiniteNumber(rec['seq'])
      return {
        type: 'turn-tail',
        seq,
        time: readFiniteNumber(rec['time']),
        usage: formatTokenUsage(rec['tokenUsage']),
        branchable: rec['branchUnavailable'] !== true && seq !== undefined,
      }
    }
    case 'turn-error':
    case 'turn-max-tokens':
    case 'model-retry':
    case 'turn-process':
      return { type: 'notice', kind, spec: noticeSpec(kind, data) }
    case 'command':
    case 'compaction':
    case 'manual-compaction':
      return { type: 'legacy', kind, data }
    default:
      return { type: 'unknown', kind, data }
  }
}
