/**
 * 一次工具调用的可折叠卡片。
 *
 * 头部一眼看清发生了什么：状态点、工具名、状态文字、参数首行预览、展开箭头；
 * 正文才是完整参数与结果。默认折叠，button 自带回车/空格键盘支持。
 * 整行是旁注样式而不是卡片：运行中的反馈只有状态点与状态文字的颜色，
 * 不跑描边流光，也不做字符乱码过渡——中文状态词被替换成拉丁字符会像渲染故障。
 */

import { useId, useState } from 'react'
import { cls } from './classes'
import { cx, firstLine, prettyJson } from './util'
import { CollapsibleBody } from './motion-primitives/vendor/CollapsibleBody'
import { toolStatusOf, type ToolStatus } from './row-model'
import type { ContentBlock, ToolCallData } from './types'

export interface ToolCardProps {
  root: ToolCallData['root']
  /** 行模型取出的工具名；省略时退回 root.name。 */
  title?: string
  /** 行模型取出的状态；省略时用 toolStatusOf(root) 现算，判据与行模型同一份。 */
  status?: ToolStatus
}

const STATUS_TEXT: Record<ToolStatus, string> = {
  running: '运行中',
  done: '已完成',
  error: '失败',
}

/** 头部参数预览最多显示多少个字符。 */
const PREVIEW_LIMIT = 80
/** 正文结果的最大字符数，超过就截断（完整内容仍可从宿主侧查看）。 */
const BODY_LIMIT = 6000

function isRecord (value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/**
 * 把一个内容块拍平成可读文本。
 * 内容块的公开类型是「可合并扩展」的，所以这里按运行时形状读取，
 * 未知类型退化为 JSON 串，绝不因为新增块类型而抛错。
 */
function blockToText (block: ContentBlock): string {
  const record = block as unknown as Record<string, unknown>
  const type = typeof record.type === 'string' ? record.type : ''
  if (type === 'text' || type === 'reasoning') {
    return typeof record.text === 'string' ? record.text : ''
  }
  if (type === 'image' || type === 'file') {
    const attachment = record.attachment
    const name = isRecord(attachment) && typeof attachment.name === 'string' ? attachment.name : ''
    const kind = type === 'image' ? '图片' : '文件'
    return name === '' ? '［' + kind + '］' : '［' + kind + '：' + name + '］'
  }
  if (type === 'tool-call') {
    const name = typeof record.name === 'string' ? record.name : '工具调用'
    const args = typeof record.arguments === 'string' ? record.arguments : ''
    return args === '' ? name : name + ' ' + prettyJson(args, 1200)
  }
  try {
    return JSON.stringify(block, null, 2)
  } catch {
    return '［无法展示的内容块］'
  }
}

function contentToText (content: readonly ContentBlock[] | undefined): string {
  if (content === undefined || content.length === 0) return ''
  const parts: string[] = []
  for (const block of content) {
    const text = blockToText(block)
    if (text.trim() !== '') parts.push(text)
  }
  return parts.join('\n\n')
}

function argsPreview (argsRaw: string | undefined): string {
  if (argsRaw === undefined) return ''
  const line = firstLine(argsRaw).replace(/\s+/g, ' ').trim()
  if (line === '') return ''
  return line.length > PREVIEW_LIMIT ? line.slice(0, PREVIEW_LIMIT) + '…' : line
}

function errorSummary (error: ToolCallData['root']['error']): string {
  if (error === undefined) return '工具调用失败'
  const parts: string[] = []
  for (const part of [error.name, error.code, error.reason]) {
    if (typeof part === 'string' && part.trim() !== '') parts.push(part.trim())
  }
  return parts.length === 0 ? '工具调用失败' : parts.join(' · ')
}

export function ToolCard ({ root, title, status }: ToolCardProps) {
  const [open, setOpen] = useState(false)
  const bodyId = useId() + '-tool'
  const label = title ?? root.name
  const state: ToolStatus = status ?? toolStatusOf(root)

  const argsText = root.argsRaw === undefined ? '' : prettyJson(root.argsRaw, 4000)
  const hasArgs = argsText.trim() !== ''
  const preview = argsPreview(root.argsRaw)
  const resultText = contentToText(root.content)
  const hasError = root.isError === true || root.error !== undefined
  const statusText = STATUS_TEXT[state]
  const kind = root.kind !== undefined && root.kind.trim() !== '' ? root.kind.trim() : ''
  const occurredError = errorSummary(root.error)

  return (
    <div
      className={cls.tool}
      data-state={state}
      data-open={open ? 'true' : 'false'}
      data-error={hasError ? 'true' : undefined}
    >
      <button
        type="button"
        className={cls.toolHeader}
        aria-expanded={open}
        aria-controls={open ? bodyId : undefined}
        aria-label={label + '（' + statusText + '），' + (open ? '收起' : '展开') + '详情'}
        onClick={() => setOpen((value) => !value)}
      >
        <svg
          className={cls.toolIcon}
          viewBox="0 0 16 16"
          width="15"
          height="15"
          aria-hidden="true"
          focusable="false"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2.2" y="3" width="11.6" height="10" rx="2" />
          <path d="M4.8 6.4 6.6 8l-1.8 1.6M8.2 9.9h3" />
        </svg>
        <span className={cls.toolStatus} data-state={state} aria-hidden="true" />
        <span className={cls.toolName}>{label}</span>
        {kind === '' ? null : <span className={cls.toolChip}>{kind}</span>}
        <span className={cls.toolStatusText} data-state={state} aria-hidden="true">{statusText}</span>
        {preview === '' ? null : <span className={cls.toolArgs}>{preview}</span>}
        <svg
          className={cls.toolChevron}
          data-open={open ? 'true' : 'false'}
          viewBox="0 0 12 12"
          width="12"
          height="12"
          aria-hidden="true"
          focusable="false"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4.5 2.5 8 6l-3.5 3.5" />
        </svg>
      </button>
      <CollapsibleBody open={open} id={bodyId} className={cls.toolBody}>
        {hasArgs ? <pre className={cls.toolArgs}>{argsText}</pre> : null}
        {hasError ? <pre className={cx(cls.toolResult, cls.toolError)}>{occurredError}</pre> : null}
        {resultText.trim() === '' ? null : <pre className={cls.toolResult}>{prettyJson(resultText, BODY_LIMIT)}</pre>}
        {!hasArgs && !hasError && resultText.trim() === ''
          ? <span className={cls.toolChip}>暂无详细内容</span>
          : null}
      </CollapsibleBody>
    </div>
  )
}

export default ToolCard
