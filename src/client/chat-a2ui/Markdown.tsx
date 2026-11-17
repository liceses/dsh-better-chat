/**
 * 流式 Markdown 渲染。
 *
 * marked 负责把 Markdown 变成 HTML，DOMPurify 负责最终消毒；链接只放行
 * http(s)/mailto，并统一补 target/rel，避免把页面导航权交给模型输出。
 */
import { memo, useMemo } from 'react'
import { Marked, type RendererObject } from 'marked'
import DOMPurify from 'dompurify'
import { cls } from './classes'
import { cx } from './util'

/** 允许出现在 href/src 上的协议白名单。 */
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:'])

/** 流式光标：跟正文一起进 innerHTML，保证它落在最后一段文字后面。 */
const CARET_HTML = '<span class="' + cls.streamingCursor + '" aria-hidden="true"></span>'

/** 只保留常规排版标签；表单、脚本、样式一律丢掉。 */
const SANITIZE_CONFIG = {
  ADD_ATTR: ['target', 'rel'],
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i,
  FORBID_ATTR: ['style', 'srcset', 'formaction'],
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select', 'link', 'meta'],
}

function escapeHtml (value: unknown): string {
  const text = typeof value === 'string' ? value : String(value ?? '')
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * 校验并归一化链接地址。
 * @param raw - 模型给出的原始 href。
 * @returns 合法时返回原地址；否则返回 null，调用方退化成纯文本。
 */
export function safeHref (raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const value = raw.trim()
  if (value === '') return null
  try {
    const url = new URL(value)
    return ALLOWED_PROTOCOLS.has(url.protocol.toLowerCase()) ? value : null
  } catch {
    return null
  }
}

/** 自定义渲染：外链一律新窗口打开；非白名单协议降级成纯文本。 */
const renderer: RendererObject = {
  link ({ href, title, tokens }) {
    const label = this.parser.parseInline(tokens)
    const target = safeHref(href)
    if (target === null) return label
    const titleAttr = typeof title === 'string' && title !== '' ? ' title="' + escapeHtml(title) + '"' : ''
    return '<a class="' + cls.markdownLink + '" href="' + escapeHtml(target) + '"' + titleAttr + ' target="_blank" rel="noopener noreferrer">' + label + '</a>'
  },
  image ({ href, text, title }) {
    const target = safeHref(href)
    const alt = escapeHtml(typeof text === 'string' ? text : '')
    if (target === null) return alt
    const titleAttr = typeof title === 'string' && title !== '' ? ' title="' + escapeHtml(title) + '"' : ''
    return '<img alt="' + alt + '"' + titleAttr + ' src="' + escapeHtml(target) + '" />'
  },
}

/** 每个渲染器复用同一个实例，避免污染宿主进程里的全局 marked 配置。 */
const markdownParser = new Marked({ async: false, breaks: true, gfm: true, renderer })

/**
 * 把 Markdown 源码渲染成可安全注入的 HTML。
 * 解析失败时退化成转义后的纯文本，保证内容不丢。
 */
export function renderMarkdown (text: unknown): string {
  if (typeof text !== 'string' || text.trim() === '') return ''
  let html: string
  try {
    html = markdownParser.parse(text, { async: false })
  } catch {
    html = '<p>' + escapeHtml(text) + '</p>'
  }
  try {
    return DOMPurify.sanitize(html, SANITIZE_CONFIG)
  } catch {
    return ''
  }
}

export interface MarkdownProps {
  /** Markdown 源码。 */
  text: string
  /** 流式输出中：在末尾追加闪烁光标。 */
  streaming?: boolean
  /** 追加在 .caui-markdown 上的额外类名。 */
  className?: string
}

/** 已消毒的 Markdown 视图；只在 text / streaming 变化时重新解析。 */
export const Markdown = memo(function Markdown ({ text, streaming = false, className }: MarkdownProps) {
  const html = useMemo(() => {
    const base = renderMarkdown(text)
    return streaming ? base + CARET_HTML : base
  }, [text, streaming])
  return <div className={cx(cls.markdown, className)} dangerouslySetInnerHTML={{ __html: html }} />
})

export default Markdown
