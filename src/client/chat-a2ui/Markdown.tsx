/**
 * 流式 Markdown 渲染。
 *
 * marked 负责把 Markdown 变成 HTML，DOMPurify 负责最终消毒；链接只放行
 * http(s)/mailto，并统一补 target/rel，避免把页面导航权交给模型输出。
 */
import { memo, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Marked, type RendererObject } from 'marked'
import DOMPurify from 'dompurify'
import { cls } from './classes'
import { MOTION, clipSeconds } from './motion-config'
import { reducedMotion } from './motion'
import { expandRole } from './motion-roles'
import { useStream } from './motion-hooks'
import { cx } from './util'

/** 允许出现在 href/src 上的协议白名单。 */
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:'])

/** 流式光标：跟正文一起进 innerHTML，保证它落在最后一段文字后面。 */
const CARET_HTML = '<span class="' + cls.streamingCursor + '" aria-hidden="true"></span>'

/**
 * 只保留常规排版标签；表单、脚本、样式一律丢掉。
 * 注意：DOMPurify 3.2 在同时传 ALLOWED_URI_REGEXP 时会连 ADD_ATTR 的
 * target/rel 一起丢掉（实测），所以协议白名单改在 hardenLinks 里做。
 */
const SANITIZE_CONFIG = {
  ADD_ATTR: ['target', 'rel'],
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

/**
 * CommonMark 不把紧贴中文的闭合 ** 当作强调结束符，
 * 例如 "**总结：**因…" 会原样留下星号。模型很常用这种写法，
 * 所以在消毒后的 HTML 文本节点里把残留的 **…** 提升成 <strong>。
 * 跳过 code/pre，避免改动代码内容。
 * @param html - 已经过 DOMPurify 的 HTML。
 * @returns 修正后的 HTML。
 */
export function promoteLiteralStrong (html: string): string {
  if (!html.includes('**') || typeof document === 'undefined') return html
  const template = document.createElement('template')
  template.innerHTML = html
  const walker = document.createTreeWalker(template.content, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  while (walker.nextNode()) {
    const node = walker.currentNode
    if (!(node instanceof Text) || !node.data.includes('**')) continue
    if (node.parentElement?.closest('code, pre') !== null) continue
    nodes.push(node)
  }
  for (const node of nodes) {
    const pattern = /\*\*([^*]+)\*\*/g
    const fragment = document.createDocumentFragment()
    let cursor = 0
    let match: RegExpExecArray | null
    while ((match = pattern.exec(node.data)) !== null) {
      if (match.index > cursor) fragment.append(node.data.slice(cursor, match.index))
      const strong = document.createElement('strong')
      strong.textContent = match[1] ?? ''
      fragment.append(strong)
      cursor = match.index + match[0].length
    }
    if (cursor === 0) continue
    if (cursor < node.data.length) fragment.append(node.data.slice(cursor))
    node.replaceWith(fragment)
  }
  return template.innerHTML
}

/**
 * 给消毒后的链接补 target/rel，并再次执行协议白名单。
 * 外链必须新窗口打开；非 http(s)/mailto 的 href 直接移除，避免点击导航。
 * @param html - 已经过 DOMPurify 的 HTML。
 * @returns 链接加固后的 HTML。
 */
export function hardenLinks (html: string): string {
  if (!html.includes('<a') || typeof document === 'undefined') return html
  const template = document.createElement('template')
  template.innerHTML = html
  for (const anchor of template.content.querySelectorAll('a[href]')) {
    const target = safeHref(anchor.getAttribute('href'))
    if (target === null) {
      anchor.removeAttribute('href')
      continue
    }
    anchor.setAttribute('href', target)
    anchor.setAttribute('target', '_blank')
    anchor.setAttribute('rel', 'noopener noreferrer')
  }
  return template.innerHTML
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
    const clean = DOMPurify.sanitize(html, SANITIZE_CONFIG)
    return hardenLinks(promoteLiteralStrong(clean))
  } catch {
    return ''
  }
}

/** 流式尾巴上一个字符的类名（CSS 在 style.ts 里）。 */
export const STREAM_CHAR_CLASS = 'caui-md-stream-char'

/**
 * 把容器**末尾** count 个字符逐个包进带入场动画的 span。
 *
 * 流式时整段 innerHTML 每个 token 都会被替换一次，所以每次只包「这一帧新长出来的那截」：
 * 之前的字符保持原样（已经清晰），新字符从模糊到清晰，视觉上就是文字在末尾渐渐显影。
 * 不新增 DOM 结构上限——count 由 motion.config.json 的 stream.maxChars 夹住。
 */
function animateStreamTail (
  host: HTMLElement,
  count: number,
  staggerSeconds: number = expandRole('text.stream').stagger,
): void {
  if (count <= 0) return
  const walker = host.ownerDocument.createTreeWalker(host, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  while (walker.nextNode()) {
    const node = walker.currentNode
    // 纯空白节点（marked 常在末尾留一个换行）不算「字」，跳过它们，
    // 这样包住的字符数才和用户看到的字数对得上。
    if (node instanceof Text && node.data.length > 0 && /\S/.test(node.data)) nodes.push(node)
  }
  if (nodes.length === 0) return

  // 从末尾往前数 count 个字符，记下每段要包的范围（先收集，再从后往前切，避免 splitText 影响前面的下标）
  const ranges: Array<{ node: Text; start: number; end: number }> = []
  let remaining = count
  for (let index = nodes.length - 1; index >= 0 && remaining > 0; index -= 1) {
    const node = nodes[index] as Text
    const length = node.data.length
    const take = Math.min(length, remaining)
    ranges.push({ node, start: length - take, end: length })
    remaining -= take
  }
  ranges.reverse()

  // 错峰由调用方传入（角色 text.stream 的 stagger）；模块函数不读 hook。
  const stagger = staggerSeconds
  let charIndex = 0
  for (const range of ranges) {
    const parent = range.node.parentNode
    if (parent === null) continue
    let target: Text
    try {
      if (range.end < range.node.data.length) range.node.splitText(range.end)
      target = range.node.splitText(range.start)
    } catch {
      continue
    }
    const fragment = host.ownerDocument.createDocumentFragment()
    for (const char of target.data) {
      const span = host.ownerDocument.createElement('span')
      span.className = STREAM_CHAR_CLASS
      // 错开一点点，读起来像是一路写过来的
      if (stagger > 0) span.style.animationDelay = (charIndex * stagger).toFixed(3) + 's'
      span.textContent = char
      fragment.appendChild(span)
      charIndex += 1
    }
    parent.replaceChild(fragment, target)
  }
}

export interface MarkdownProps {
  /** Markdown 源码。 */
  text: string
  /** 流式输出中：在末尾追加闪烁光标。 */
  streaming?: boolean
  /** 允许做尾巴的模糊渐入（宿主在用另一种方式告知「这行是新的」时用）。 */
  tail?: boolean
  /** 追加在 .caui-markdown 上的额外类名。 */
  className?: string
}

/** 已消毒的 Markdown 视图；只在 text / streaming 变化时重新解析。 */
export const Markdown = memo(function Markdown ({ text, streaming = false, tail = false, className }: MarkdownProps) {
  // 流式逐字的时长/模糊/错峰来自角色 text.stream（reduced 档下 blur 归零）。
  const stream = useStream('text.stream')
  const hostRef = useRef<HTMLDivElement | null>(null)
  /** 上一帧渲染出来的纯文本长度：用来算「这一帧新长出来多少字」。 */
  const seenRef = useRef(0)
  /** 上一个 text：宿主不一定把 running 传下来，所以「有没有新字」才是判据。 */
  const prevTextRef = useRef<string | null>(null)
  const html = useMemo(() => {
    const base = renderMarkdown(text)
    return streaming ? base + CARET_HTML : base
  }, [text, streaming])

  // 在浏览器绘制之前把新长出来的尾巴包上动画，避免先闪一帧清晰的文字。
  //
  // 触发条件刻意不依赖 streaming：宿主不一定会把「正在生成」传到消息节点上
  // （实测 data.status 一直是完成态，光标因此从没出现过）。这里以「文本变长了」
  // 为准；第一次挂载只有当 streaming 为真时才动，避免打开历史会话时每段都闪一下。
  useLayoutEffect(() => {
    const host = hostRef.current
    if (host === null) {
      seenRef.current = 0
      return
    }
    const total = host.textContent === null ? 0 : host.textContent.length
    const previousTotal = seenRef.current
    seenRef.current = total

    const previousText = prevTextRef.current
    prevTextRef.current = text
    const firstRun = previousText === null
    const grew = !firstRun && text.length > previousText.length
    if (!grew && !(firstRun && (streaming || tail))) return
    if (reducedMotion()) return

    const grown = grew ? total - previousTotal : total
    if (grown <= 0) return
    animateStreamTail(host, Math.min(grown, MOTION.stream.maxChars), stream.stagger)
  }, [html, streaming, tail, text, stream.stagger])

  // 高度补间：宿主一次可能提交几百像素的正文（实测单批 +531px），直接铺开就是
  // 整块内容瞬间顶上来。这里让这一块的高度先停住、再在 0.2s 内长到目标高度，
  // 流式里看到的效果就是文字从下边缘一行行长出来，而不是整段跳出来。
  const [clip, setClip] = useState<{ height: number; duration: number } | null>(null)
  const clipRef = useRef<HTMLDivElement | null>(null)
  const clipActive = tail || streaming

  useLayoutEffect(() => {
    if (!clipActive || reducedMotion()) {
      if (clip !== null) setClip(null)
      return
    }
    const element = clipRef.current
    if (element === null) return
    const next = Math.round(element.scrollHeight)
    if (next <= 0) return
    if (clip !== null && clip.height === next) return
    const previous = clip === null ? next : clip.height
    // 首次出现用最短时长：高度没变，不该凭空拖一拍。
    const duration = clip === null ? MOTION.stream.clipMin : clipSeconds(next - previous)
    setClip({ height: next, duration })
  }, [html, clipActive, clip])

  const style = {
    '--caui-stream-duration': stream.duration + 's',
    '--caui-stream-blur': stream.blur + 'px',
  } as CSSProperties

  const clipStyle = clip === null
    ? undefined
    : { height: clip.height + 'px', transitionDuration: clip.duration + 's' }

  return (
    <div
      ref={clipRef}
      className={cx('caui-md-clip', clip !== null && 'caui-md-clip-animated')}
      style={clipStyle}
    >
      <div
        ref={hostRef}
        className={cx(cls.markdown, className)}
        style={style}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
})

export default Markdown
