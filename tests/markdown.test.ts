// @vitest-environment jsdom

/** Markdown rendering: literal bold next to CJK, code protection, links. */

import { describe, expect, it } from 'vitest'
import { promoteLiteralStrong, renderMarkdown } from '../src/client/chat-a2ui/Markdown'

describe('promoteLiteralStrong', () => {
  it('turns a bold run that CommonMark leaves literal into strong', () => {
    const html = renderMarkdown('**本次搜索的一句话总结：**因算力资源紧张。')
    expect(html).toContain('<strong>本次搜索的一句话总结：</strong>因算力资源紧张。')
    expect(html).not.toContain('**')
  })

  it('does not touch bold markers inside inline or fenced code', () => {
    const html = renderMarkdown('普通 **重点** 文本\n\n`a ** b`\n\n```\n**raw**\n```')
    expect(html).toContain('<strong>重点</strong>')
    expect(html).toContain('<code>a ** b</code>')
    expect(html).toContain('**raw**')
  })

  it('keeps the sanitized link transformation', () => {
    const html = renderMarkdown('[DeepSeek](https://api-docs.deepseek.com/zh-cn/updates/)')
    expect(html).toContain('caui-markdown-link')
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
  })

  it('returns empty for empty or non-string input', () => {
    expect(renderMarkdown('')).toBe('')
    expect(renderMarkdown(null)).toBe('')
    expect(promoteLiteralStrong('<p>no markers</p>')).toBe('<p>no markers</p>')
  })
})
