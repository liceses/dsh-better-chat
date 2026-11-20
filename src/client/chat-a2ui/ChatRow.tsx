/**
 * 单条聊天节点的渲染器。
 *
 * 关键设计：
 * 1. ChatRow 自己按 nodeKey 订阅 chat store，流式 token 只会重渲染当前这一行；
 *    父组件只负责顺序、动画和空态。
 * 2. 分派只有一张表：RowView 的 type → 渲染函数（见 RENDERERS）。
 * 3. 宿主数据的收窄全部在 row-model.ts；这里只消费 RowView。唯一的断言是把
 *    判别联合的成员查表收敛成一次调用（RENDERERS[view.type]），它不含字段读取。
 */
import { memo, useEffect, useId, useRef, useState, type ReactElement, type ReactNode } from 'react'
import type { UseChat } from './types'
import type {
  AssistantView,
  ContextView,
  LegacyKind,
  LegacyView,
  NoticeView,
  RowView,
  ToolView,
  TurnTailView,
  UnknownView,
  UserView,
} from './row-model'
import { asRecord, formatCount, parseRow, readNumber, readString } from './row-model'
import { AssistantBlocks, type LoadImage } from './AssistantBlocks'
import { BranchButton } from './BranchButton'
import { ChatImage } from './ChatImage'
import { ToolCard } from './ToolCard'
import { CollapsibleBody } from './motion-primitives/vendor/CollapsibleBody'
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
// 渲染期小工具：只做展示格式化，宿主数据的读取都在 row-model.ts 里。
// ---------------------------------------------------------------------------

/** toISOString 在非法时间上会抛 RangeError，这里必须兜住。 */
function safeIso (time: number | undefined): string | undefined {
  if (time === undefined || !Number.isFinite(time)) return undefined
  try {
    return new Date(time).toISOString()
  } catch {
    return undefined
  }
}

/** 超长文本截断，保留可读前缀。 */
function truncate (text: string, max: number): string {
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
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

/** 上下文注入是系统旁白，不该占用户气泡；折叠成一条可展开的提示。 */
function ContextRow ({ view }: { view: ContextView }): ReactElement | null {
  const [open, setOpen] = useState(false)
  const bodyId = useId() + '-context'
  const text = view.text
  if (text === '') return null
  const time = view.time
  return (
    <RowFrame kind="context" variant={cls.rowNotice}>
      <div className={cls.context}>
        <button
          type="button"
          className={cls.contextSummary}
          aria-expanded={open}
          aria-controls={open ? bodyId : undefined}
          onClick={() => setOpen(value => !value)}
        >
          <span className={cls.contextLabel}>已注入上下文</span>
          {time === undefined ? null : (
            <time className={cls.time} dateTime={safeIso(time)}>{formatClock(time)}</time>
          )}
          <span className={cls.contextChevron} aria-hidden="true" />
        </button>
        <CollapsibleBody open={open} id={bodyId} className={cls.contextBody}>
          <pre className={cls.contextText}>{text}</pre>
        </CollapsibleBody>
      </div>
    </RowFrame>
  )
}

/** 用户气泡：文本保持纯文本，附件只画图片和文件名 chip。 */
function UserRow ({ view, loadImage }: { view: UserView; loadImage: LoadImage }): ReactElement {
  const parts = view.parts
  const time = view.time
  // context 走 ContextRow，所以这里只剩「引导」一种附加标签。
  const label = view.kind === 'steering' ? '引导' : undefined
  const hasBubble = parts.texts.length > 0 || parts.files.length > 0 || parts.unsupported > 0
  return (
    <RowFrame kind={view.kind} variant={cls.rowUser}>
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

/** 复制按钮：非安全上下文里 clipboard 可能不存在，此时静默降级。 */
function CopyButton ({ text }: { text: string }): ReactElement {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => {
    if (timer.current !== undefined) window.clearTimeout(timer.current)
  }, [])
  const copy = (): void => {
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

/** assistant step：内容块交给 AssistantBlocks，页脚放状态点、时间与复制按钮。 */
function AssistantRow ({ view, loadImage, running }: {
  view: AssistantView
  loadImage: LoadImage
  /** 会话级运行态：决定最后一个文本块要不要进流式尾巴态。 */
  running: boolean
}): ReactElement {
  return (
    <RowFrame kind="assistant-step" variant={cls.rowAssistant}>
      <div className={cls.assistant}>
        <AssistantBlocks blocks={view.blocks} status={view.status} live={running} loadImage={loadImage} />
        <div className={cls.assistantFooter}>
          {view.live ? <span className={cls.liveDot} aria-hidden="true" /> : null}
          {!view.live && view.status === 'interrupted' ? <span className={cls.time}>已中断</span> : null}
          {view.time === undefined ? null : (
            <time className={cls.time} dateTime={safeIso(view.time)}>{formatClock(view.time)}</time>
          )}
          {!view.live && view.copyText !== '' ? <CopyButton text={view.copyText} /> : null}
        </div>
      </div>
    </RowFrame>
  )
}

// ---------------------------------------------------------------------------
// tool-call / turn-tail
// ---------------------------------------------------------------------------

/** 工具调用：根描述由行模型收窄好，卡片自己负责展开与正文。 */
function ToolRow ({ view }: { view: ToolView }): ReactElement {
  return (
    <RowFrame kind="tool-call" variant={cls.rowProcess}>
      <ToolCard root={view.root} title={view.title} status={view.status} />
    </RowFrame>
  )
}

/** 一轮结束行：时间 + token 用量 + 分支入口。 */
function TurnTailRow ({ view, running, forkAt }: {
  view: TurnTailView
  running: boolean
  forkAt: (seq: number) => void | Promise<void>
}): ReactElement {
  const seq = view.seq
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
        {view.time === undefined ? null : (
          <time className={cls.time} dateTime={safeIso(view.time)}>{formatClock(view.time)}</time>
        )}
        {view.usage === undefined ? null : <span className={cls.tokenUsage}>{view.usage}</span>}
        {view.branchable ? <BranchButton disabled={running} onBranch={onBranch} /> : null}
      </div>
    </RowFrame>
  )
}

// ---------------------------------------------------------------------------
// command / compaction / manual-compaction：仍由旧组件渲染，DOM 保持不变。
// ---------------------------------------------------------------------------

function CommandBody ({ data }: { data: unknown }): ReactElement {
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

function CompactionBody ({ data }: { data: unknown }): ReactElement {
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

function ManualCompactionBody ({ data }: { data: unknown }): ReactElement {
  const rec = asRecord(data)
  const command = asRecord(rec?.['command'])
  const compaction = asRecord(rec?.['compaction'])
  return (
    <RowFrame kind="manual-compaction" variant={cls.rowNotice}>
      {command === undefined ? null : <CommandBody data={rec?.['command']} />}
      {compaction === undefined ? null : <CompactionBody data={rec?.['compaction']} />}
    </RowFrame>
  )
}

/** legacy 行按 kind 查的第二张表；每个 kind 对应一个旧组件，顺序无关。 */
const LEGACY_RENDERERS: Record<LegacyKind, (data: unknown) => ReactElement> = {
  command: data => (
    <RowFrame kind="command" variant={cls.rowNotice}>
      <CommandBody data={data} />
    </RowFrame>
  ),
  compaction: data => (
    <RowFrame kind="compaction" variant={cls.rowNotice}>
      <CompactionBody data={data} />
    </RowFrame>
  ),
  'manual-compaction': data => <ManualCompactionBody data={data} />,
}

/** legacy 行的唯一入口：kind 与 data 都已由行模型给好。 */
function LegacyRow ({ view }: { view: LegacyView }): ReactElement {
  return LEGACY_RENDERERS[view.kind](view.data)
}

// ---------------------------------------------------------------------------
// 过程提示：turn-error / turn-max-tokens / model-retry / turn-process
// ---------------------------------------------------------------------------

/** 过程提示行：图标 + 加粗标题 + 副文案；错误档用 alert 语气。 */
function NoticeRow ({ view }: { view: NoticeView }): ReactElement {
  const errorTone = view.spec.icon === '!'
  return (
    <RowFrame kind={view.kind} variant={cls.rowNotice}>
      <div className={cls.notice} role={errorTone ? 'alert' : undefined}>
        <span className={cls.noticeIcon} aria-hidden="true">{view.spec.icon}</span>
        <span className={cx(cls.noticeText, errorTone && cls.toolError)}>
          <strong>{view.spec.title}</strong>
          {view.spec.text === undefined ? null : <span>{' · ' + view.spec.text}</span>}
        </span>
      </div>
    </RowFrame>
  )
}

// ---------------------------------------------------------------------------
// 兜底：未知节点类型 / 数据不是对象
// ---------------------------------------------------------------------------

/** 未知行：给出类型名与一句可读提示，绝不白屏。 */
function UnknownRow ({ view }: { view: UnknownView }): ReactElement {
  const rec = asRecord(view.data)
  const type = readString(rec, 'type') ?? (view.kind === '' ? 'unknown' : view.kind)
  const hint = readString(rec, 'text') ?? readString(rec, 'message')
  return (
    <RowFrame kind={view.kind === '' ? 'unknown' : view.kind} variant={cls.rowNotice}>
      <div className={cls.unknown}>
        <span className={cls.unknownType}>{type}</span>
        <span className={cls.unknownBody}>{hint === undefined ? '此消息暂不支持展示' : truncate(hint, 240)}</span>
      </div>
    </RowFrame>
  )
}

// ---------------------------------------------------------------------------
// 分派：RowView 的 type → 渲染函数，一张表代替 switch。
// ---------------------------------------------------------------------------

/** 每行共享的宿主环境：图片 loader、分支回调、会话级运行态。 */
interface RowEnv {
  loadImage: LoadImage
  forkAt: (seq: number) => void | Promise<void>
  running: boolean
}

/** 某个 RowView 成员对应的渲染函数签名。 */
type RowRendererFor<K extends RowView['type']> =
  (view: Extract<RowView, { type: K }>, env: RowEnv) => ReactElement | null

/** 全部行类型的渲染表；新增一种 RowView 时编译器会点出缺项。 */
const RENDERERS: { [K in RowView['type']]: RowRendererFor<K> } = {
  user: (view, env) => <UserRow view={view} loadImage={env.loadImage} />,
  context: view => <ContextRow view={view} />,
  assistant: (view, env) => <AssistantRow view={view} loadImage={env.loadImage} running={env.running} />,
  tool: view => <ToolRow view={view} />,
  'turn-tail': (view, env) => <TurnTailRow view={view} running={env.running} forkAt={env.forkAt} />,
  notice: view => <NoticeRow view={view} />,
  legacy: view => <LegacyRow view={view} />,
  hidden: () => null,
  unknown: view => <UnknownRow view={view} />,
}

/**
 * 渲染一条聊天节点。
 * 按 nodeKey 订阅 store：节点数据变化时只有这一行重渲染。
 * 隐藏节点、缺失节点返回 null；turn-trigger 由行模型标记为 hidden，同样不渲染。
 */
export const ChatRow = memo(function ChatRow (props: ChatRowProps): ReactElement | null {
  const { nodeKey, useChat, loadImage, forkAt, running } = props
  const node = useChat((snapshot) => snapshot.nodes.get(nodeKey))
  if (node === undefined || node === null) return null
  if (node.visibility === 'hidden') return null

  const view = parseRow(typeof node.kind === 'string' ? node.kind : '', node.data)
  // 表项与判别成员一一对应；这里的一次断言只是把联合查找收敛成一次调用。
  const render = RENDERERS[view.type] as RowRendererFor<RowView['type']>
  return render(view, { loadImage, forkAt, running })
})

export default ChatRow
