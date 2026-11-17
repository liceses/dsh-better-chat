/**
 * 单条聊天节点的渲染器。
 *
 * 关键设计：ChatRow 自己按 nodeKey 订阅 chat store，所以流式 token 只会
 * 重渲染当前这一行；父组件只负责顺序、动画和空态。
 */
import { memo, useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react'
import type {
  AssistantBlock,
  AssistantData,
  ChatNodeData,
  CommandData,
  CompactionData,
  ImageAttachmentRef,
  ManualCompactionData,
  ToolCallData,
  TurnTailData,
  UseChat,
  UserMessageData,
} from './types'
import { AssistantBlocks, type LoadImage } from './AssistantBlocks'
import { BranchButton } from './BranchButton'
import { ChatImage } from './ChatImage'
import { ToolCard } from './ToolCard'
import { cls } from './classes'
import { cx, formatBytes, formatClock } from './util'

/** 单个聊天节点的渲染参数。 */
export interface ChatRowProps {
  /** Chat 快照里的节点键，同时用作 React key。 */
  nodeKey: string
  /** 宿主注入的 chat store hook。 */
  useChat: UseChat
  /** 宿主注入的图片 loader。 */
  loadImage: LoadImage
  /** 从指定 seq 分支出新的会话。 */
  forkAt: (seq: number) => void | Promise<void>
  /** 会话是否正在生成：用于禁用分支按钮。 */
  running: boolean
}

// ---------------------------------------------------------------------------
// 运行时读取工具：types.ts 为了兼容旧宿主字段是宽松的，这里一律按形状兜底。
// ---------------------------------------------------------------------------

type Rec = Record<string, unknown>

function asRecord (value: unknown): Rec | undefined {
  return typeof value === 'object' && value !== null ? (value as Rec) : undefined
}

function readString (source: Rec | undefined, key: string): string | undefined {
  const value = source?.[key]
  return typeof value === 'string' && value.trim() !== '' ? value : undefined
}

function readNumber (source: Rec | undefined, key: string): number | undefined {
  const value = source?.[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

/** 读取有限数字字段（时间戳、seq 等）；非法值返回 undefined，由调用方兜底。 */
function readFiniteNumber (value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

/** 从常见错误负载里提取一句人类可读的文案。 */
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

function truncate (text: string, max: number): string {
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
}

/** toISOString 在非法时间上会抛 RangeError，这里必须兜住。 */
function safeIso (time: number | undefined): string | undefined {
  if (time === undefined || !Number.isFinite(time)) return undefined
  try {
    return new Date(time).toISOString()
  } catch {
    return undefined
  }
}

function formatCount (value: number): string {
  try {
    return Math.round(value).toLocaleString('zh-CN')
  } catch {
    return String(Math.round(value))
  }
}

/** 把未知形状的 tokenUsage 压成一行可读文案。 */
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
// 行外框：所有行共用 .caui-row + 一个变体类，data-kind 便于样式的兜底与测试。
// ---------------------------------------------------------------------------

function RowFrame ({ kind, variant, children }: { kind: string; variant?: string; children: ReactNode }): ReactElement {
  return (
    <div className={cx(cls.row, variant)} data-kind={kind}>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// user / steering / context
// ---------------------------------------------------------------------------

interface UserParts {
  texts: string[]
  images: ImageAttachmentRef[]
  files: { name: string; bytes: number }[]
  unsupported: number
}

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

/** 按运行时形状拆用户消息；文本保持纯文本，绝不渲染 Markdown。 */
function splitUserContent (content: unknown): UserParts {
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

/** 上下文注入优先用 source.sections 的可读文本，避免把 <system-reminder> 原样摊开。 */
function readContextText (data: UserMessageData): string {
  const source = asRecord(asRecord(data)?.source)
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
  return splitUserContent(data.content).texts.join('\n\n').trim()
}

/** 上下文注入是系统旁白，不该占用户气泡；折叠成一条可展开的提示。 */
function ContextRow ({ data }: { data: UserMessageData }): ReactElement | null {
  const text = readContextText(data)
  if (text === '') return null
  const time = readFiniteNumber(data.time)
  return (
    <RowFrame kind="context" variant={cls.rowNotice}>
      <details className={cls.context}>
        <summary className={cls.contextSummary}>
          <span className={cls.contextLabel}>已注入上下文</span>
          {time === undefined ? null : (
            <time className={cls.time} dateTime={safeIso(time)}>{formatClock(time)}</time>
          )}
        </summary>
        <pre className={cls.contextText}>{text}</pre>
      </details>
    </RowFrame>
  )
}

function UserRow ({ data, loadImage }: { data: UserMessageData; loadImage: LoadImage }): ReactElement {
  const parts = splitUserContent(data.content)
  const time = readFiniteNumber(data.time)
  // kind 在类型上是 'user'，但同一条渲染路径也服务 steering / context，按运行时读取。
  const kind = readString(asRecord(data), 'kind') ?? 'user'
  const label = kind === 'steering' ? '引导' : kind === 'context' ? '上下文' : undefined
  const hasBubble = parts.texts.length > 0 || parts.files.length > 0 || parts.unsupported > 0
  return (
    <RowFrame kind={kind} variant={cls.rowUser}>
      <div className={cls.user}>
        {parts.images.length === 0 ? null : (
          <div className={cls.userImages}>
            {parts.images.map((attachment, index) => (
              <ChatImage key={attachment.attachmentId + ':' + index} attachment={attachment} loadImage={loadImage} />
            ))}
          </div>
        )}
        {!hasBubble ? null : (
          <div className={cls.userBubble}>
            {parts.texts.map((text, index) => (
              <div key={'text:' + index} className={cls.userText}>{text}</div>
            ))}
            {parts.files.map((file, index) => (
              <div key={'file:' + index} className={cls.toolChip}>
                {file.bytes > 0 ? file.name + ' · ' + formatBytes(file.bytes) : file.name}
              </div>
            ))}
            {parts.unsupported === 0 ? null : (
              <div className={cls.unknownType}>{'+' + parts.unsupported + ' 个不支持的内容块'}</div>
            )}
          </div>
        )}
        <div className={cls.userMeta}>
          {label === undefined ? null : <span>{label}</span>}
          {time === undefined ? null : (
            <time className={cls.time} dateTime={safeIso(time)}>{formatClock(time)}</time>
          )}
        </div>
      </div>
    </RowFrame>
  )
}

// ---------------------------------------------------------------------------
// assistant-step
// ---------------------------------------------------------------------------

/** 汇总可复制的纯文本（只取 text 块）。 */
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

function CopyButton ({ text }: { text: string }): ReactElement {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => {
    if (timer.current !== undefined) window.clearTimeout(timer.current)
  }, [])
  const copy = (): void => {
    // 非安全上下文里 clipboard 可能不存在，此时静默降级。
    const clipboard = (navigator as Navigator & { clipboard?: Clipboard }).clipboard
    if (clipboard === undefined) return
    void clipboard.writeText(text).then(() => {
      setCopied(true)
      if (timer.current !== undefined) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => { setCopied(false) }, 1400)
    }).catch(() => {
      // 写剪贴板被拒绝时保持静默，不打扰对话。
    })
  }
  return (
    <div className={cls.messageActions}>
      <button
        type="button"
        className={cx(cls.actionButton, copied && cls.actionDone)}
        onClick={copy}
        aria-label="复制回复内容"
      >
        {copied ? '已复制' : '复制'}
      </button>
    </div>
  )
}

function AssistantRow ({ data, loadImage }: { data: AssistantData; loadImage: LoadImage }): ReactElement {
  const blocks = Array.isArray(data.blocks) ? data.blocks : []
  const status = data.status
  const running = status === 'running'
  const time = readFiniteNumber(data.time)
  const copyText = collectText(blocks)
  return (
    <RowFrame kind="assistant-step" variant={cls.rowAssistant}>
      <div className={cls.assistant}>
        <AssistantBlocks blocks={blocks} status={status} loadImage={loadImage} />
        <div className={cls.assistantFooter}>
          {running ? <span className={cls.liveDot} aria-hidden="true" /> : null}
          {!running && status === 'interrupted' ? <span className={cls.time}>已中断</span> : null}
          {time === undefined ? null : (
            <time className={cls.time} dateTime={safeIso(time)}>{formatClock(time)}</time>
          )}
          {!running && copyText !== '' ? <CopyButton text={copyText} /> : null}
        </div>
      </div>
    </RowFrame>
  )
}

// ---------------------------------------------------------------------------
// tool-call / turn-tail
// ---------------------------------------------------------------------------

function ToolRow ({ data }: { data: ToolCallData }): ReactElement {
  const root = asRecord(data.root)
  if (root === undefined) return <UnknownRow kind="tool-call" data={data} />
  return (
    <RowFrame kind="tool-call" variant={cls.rowProcess}>
      <ToolCard root={data.root} />
    </RowFrame>
  )
}

function TurnTailRow ({ data, running, forkAt }: {
  data: TurnTailData
  running: boolean
  forkAt: (seq: number) => void | Promise<void>
}): ReactElement {
  const seq = readFiniteNumber(data.seq)
  const time = readFiniteNumber(data.time)
  const usage = formatTokenUsage(data.tokenUsage)
  const branchable = data.branchUnavailable !== true && seq !== undefined
  const onBranch = (): void => {
    if (seq === undefined) return
    try {
      void Promise.resolve(forkAt(seq)).catch((error: unknown) => {
        console.warn('[chat-a2ui] 从该轮分支失败', error)
      })
    } catch (error) {
      console.warn('[chat-a2ui] 从该轮分支失败', error)
    }
  }
  return (
    <RowFrame kind="turn-tail" variant={cls.rowTail}>
      <div className={cls.turnTail}>
        <span className={cls.turnTailLine} aria-hidden="true" />
        {time === undefined ? null : (
          <time className={cls.time} dateTime={safeIso(time)}>{formatClock(time)}</time>
        )}
        {usage === undefined ? null : <span className={cls.tokenUsage}>{usage}</span>}
        {branchable ? <BranchButton disabled={running} onBranch={onBranch} /> : null}
      </div>
    </RowFrame>
  )
}

// ---------------------------------------------------------------------------
// command / compaction / manual-compaction
// ---------------------------------------------------------------------------

function CommandBody ({ data }: { data: CommandData }): ReactElement {
  const rec = asRecord(data)
  const name = readString(rec, 'name')
  const args = readString(rec, 'args')
  const outcome = asRecord(rec?.['outcome'])
  const outcomeKind = readString(outcome, 'kind')
  const outcomeText = readString(outcome, 'text')
  return (
    <div className={cls.command}>
      <span className={cls.commandName}>{name === undefined ? '命令' : '/' + name}</span>
      {args === undefined ? null : <span className={cls.commandArgs}>{args}</span>}
      {outcome === undefined ? null : (
        <span className={cx(cls.commandOutcome, outcomeKind === 'error' && cls.toolError)}>
          {outcomeText ?? (outcomeKind === 'error' ? '失败' : '完成')}
        </span>
      )}
    </div>
  )
}

function CompactionBody ({ data }: { data: CompactionData }): ReactElement {
  const rec = asRecord(data)
  const summary = readString(rec, 'summary')
  const items = readNumber(rec, 'shadowedItemCount')
  const tokens = readNumber(rec, 'shadowedTokenCount')
  const bits: string[] = []
  if (items !== undefined) bits.push('折叠 ' + formatCount(items) + ' 条消息')
  if (tokens !== undefined) bits.push('约 ' + formatCount(tokens) + ' tokens')
  return (
    <div className={cls.compaction}>
      <div className={cls.compactionSummary}>{summary === undefined ? '上下文已压缩' : truncate(summary, 480)}</div>
      {bits.length === 0 ? null : <div className={cls.time}>{bits.join(' · ')}</div>}
    </div>
  )
}

function ManualCompactionRow ({ data }: { data: ManualCompactionData }): ReactElement {
  const command = asRecord(data.command)
  const compaction = asRecord(data.compaction)
  return (
    <RowFrame kind="manual-compaction" variant={cls.rowNotice}>
      {command === undefined ? null : <CommandBody data={data.command} />}
      {compaction === undefined ? null : <CompactionBody data={data.compaction as CompactionData} />}
    </RowFrame>
  )
}

// ---------------------------------------------------------------------------
// 过程提示：turn-error / turn-max-tokens / model-retry / turn-process
// ---------------------------------------------------------------------------

interface NoticeSpec {
  icon: string
  title: string
  text?: string
}

function noticeSpec (kind: string, data: unknown): NoticeSpec {
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

function NoticeRow ({ kind, spec }: { kind: string; spec: NoticeSpec }): ReactElement {
  const errorTone = spec.icon === '!'
  return (
    <RowFrame kind={kind} variant={cls.rowNotice}>
      <div className={cls.notice} role={errorTone ? 'alert' : undefined}>
        <span className={cls.noticeIcon} aria-hidden="true">{spec.icon}</span>
        <span className={cx(cls.noticeText, errorTone && cls.toolError)}>
          <strong>{spec.title}</strong>
          {spec.text === undefined ? null : <span>{' · ' + spec.text}</span>}
        </span>
      </div>
    </RowFrame>
  )
}

// ---------------------------------------------------------------------------
// 兜底：未知节点类型
// ---------------------------------------------------------------------------

function UnknownRow ({ kind, data }: { kind: string; data: unknown }): ReactElement {
  const rec = asRecord(data)
  const type = readString(rec, 'type') ?? (kind === '' ? 'unknown' : kind)
  const hint = readString(rec, 'text') ?? readString(rec, 'message')
  return (
    <RowFrame kind={kind === '' ? 'unknown' : kind} variant={cls.rowNotice}>
      <div className={cls.unknown}>
        <span className={cls.unknownType}>{type}</span>
        <span className={cls.unknownBody}>{hint === undefined ? '此消息暂不支持展示' : truncate(hint, 240)}</span>
      </div>
    </RowFrame>
  )
}

// ---------------------------------------------------------------------------
// 分发
// ---------------------------------------------------------------------------

/**
 * 渲染一条聊天节点。
 * 按 nodeKey 订阅 store：节点数据变化时只有这一行重渲染。
 * 隐藏节点、缺失节点返回 null；turn-trigger 是纯标记，不渲染。
 */
export const ChatRow = memo(function ChatRow (props: ChatRowProps): ReactElement | null {
  const { nodeKey, useChat, loadImage, forkAt, running } = props
  const node = useChat((snapshot) => snapshot.nodes.get(nodeKey))
  if (node === undefined || node === null) return null
  if (node.visibility === 'hidden') return null

  const kind = typeof node.kind === 'string' ? node.kind : ''
  const data: ChatNodeData = node.data
  if (typeof data !== 'object' || data === null) return <UnknownRow kind={kind} data={data} />

  switch (kind) {
    case 'user':
    case 'steering':
      return <UserRow data={data as UserMessageData} loadImage={loadImage} />
    case 'context':
      return <ContextRow data={data as UserMessageData} />
    case 'assistant-step':
      return <AssistantRow data={data as AssistantData} loadImage={loadImage} />
    case 'tool-call':
      return <ToolRow data={data as ToolCallData} />
    case 'turn-tail':
      return <TurnTailRow data={data as TurnTailData} running={running} forkAt={forkAt} />
    case 'command':
      return (
        <RowFrame kind="command" variant={cls.rowNotice}>
          <CommandBody data={data as CommandData} />
        </RowFrame>
      )
    case 'manual-compaction':
      return <ManualCompactionRow data={data as ManualCompactionData} />
    case 'compaction':
      return (
        <RowFrame kind="compaction" variant={cls.rowNotice}>
          <CompactionBody data={data as CompactionData} />
        </RowFrame>
      )
    case 'turn-error':
    case 'turn-max-tokens':
    case 'model-retry':
    case 'turn-process':
      return <NoticeRow kind={kind} spec={noticeSpec(kind, data)} />
    case 'turn-trigger':
      return null
    default:
      return <UnknownRow kind={kind} data={data} />
  }
})

export default ChatRow
