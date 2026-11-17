/**
 * 一次工具调用的可折叠卡片。
 *
 * 头部一眼看清发生了什么：状态点/转圈、工具名、kind 徽标、参数首行预览、展开箭头；
 * 正文才是完整参数与结果。默认折叠，button 自带回车/空格键盘支持。
 */

import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import { cls } from './classes'
import { cx, firstLine, prettyJson } from './util'
import { reducedMotion } from './motion'
import type { ContentBlock, ToolCallData } from './types'

export interface ToolCardProps {
  root: ToolCallData['root']
}

type ToolStatus = 'running' | 'done' | 'error'

const STATUS_TEXT: Record<ToolStatus, string> = {
  running: '运行中',
  done: '已完成',
  error: '失败',
}

/** 头部参数预览最多显示多少个字符。 */
const PREVIEW_LIMIT = 80
/** 正文结果的最大字符数，超过就截断（完整内容仍可从宿主侧查看）。 */
const BODY_LIMIT = 6000

const BODY_TRANSITION: Transition = { duration: 0.18, ease: 'easeOut' }
const INSTANT_TRANSITION: Transition = { duration: 0 }

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

export function ToolCard ({ root }: ToolCardProps) {
  const [open, setOpen] = useState(false)
  const bodyId = useId() + '-tool'

  const argsText = root.argsRaw === undefined ? '' : prettyJson(root.argsRaw, 4000)
  const hasArgs = argsText.trim() !== ''
  const preview = argsPreview(root.argsRaw)
  const resultText = contentToText(root.content)
  const hasResult = root.content !== undefined
  const hasError = root.isError === true || root.error !== undefined
  const status: ToolStatus = hasError
    ? 'error'
    : root.phase === 'preparing' || (root.phase === 'start' && !hasResult)
      ? 'running'
      : 'done'
  const statusText = STATUS_TEXT[status]
  const kind = root.kind !== undefined && root.kind.trim() !== '' ? root.kind.trim() : ''
  const transition = reducedMotion() ? INSTANT_TRANSITION : BODY_TRANSITION
  const occurredError = errorSummary(root.error)

  return (
    <div
      className={cls.tool}
      data-state={status}
      data-open={open ? 'true' : 'false'}
      data-error={hasError ? 'true' : undefined}
    >
      <button
        type="button"
        className={cls.toolHeader}
        aria-expanded={open}
        aria-controls={open ? bodyId : undefined}
        aria-label={root.name + '（' + statusText + '），' + (open ? '收起' : '展开') + '详情'}
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
        <span className={cls.toolStatus} data-state={status} aria-hidden="true" />
        <span className={cls.toolName}>{root.name}</span>
        {kind === '' ? null : <span className={cls.toolChip}>{kind}</span>}
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
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="body"
            id={bodyId}
            className={cls.toolBody}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transition}
          >
            {hasArgs ? <pre className={cls.toolArgs}>{argsText}</pre> : null}
            {hasError ? <pre className={cx(cls.toolResult, cls.toolError)}>{occurredError}</pre> : null}
            {resultText.trim() === '' ? null : <pre className={cls.toolResult}>{prettyJson(resultText, BODY_LIMIT)}</pre>}
            {!hasArgs && !hasError && resultText.trim() === ''
              ? <span className={cls.toolChip}>暂无详细内容</span>
              : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
