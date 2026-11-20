import { describe, expect, it } from 'vitest'

describe('scaffold', () => {
  it('has the view identity', async () => {
    const { CHAT_VIEW_ID } = await import('../src/client/constants')
    expect(CHAT_VIEW_ID).toBe('chat-a2ui')
  })

  it('ships the P0.6 glass surface, motion levels, and permission hide', async () => {
    const { CHAT_CSS } = await import('../src/client/chat-a2ui/style')
    expect(CHAT_CSS).toContain('--caui-glass-bg')
    expect(CHAT_CSS).toContain('.caui-chat-row-active-bg')
    expect(CHAT_CSS).toContain('.caui-empty-suggestion')
    expect(CHAT_CSS).toContain('data-motion="reduced"')
    expect(CHAT_CSS).toContain('button[aria-label^="访问模式"]')
  })

  // P0.7：左栏对齐原生侧栏沟槽，过程行收成内容宽的旁注。
  // 这几条都是被量出来过的几何约定，改动它们会立刻破坏该页面的对称性。
  // 沟槽本身（.caui-chat-list 的 margin）由 styles/list.ts 与 style-split.test.ts 的块级断言看住，
  // 这里不再重复断言子串。
  it('keeps the P0.7 sidebar gutter and inline process rows', async () => {
    const { CHAT_CSS } = await import('../src/client/chat-a2ui/style')
    // 表头 / 新对话 / 会话行共用一个 8px 内缩
    expect(CHAT_CSS).toContain('.caui-chat-new::after')
    // 滚动条不再从行宽里吃掉 10px，行与按钮右边缘才能对齐
    expect(CHAT_CSS).toContain('scrollbar-width: none')
    // 过程行：内容宽、无卡片、连续行收紧，思考行不再占 24px 页脚
    expect(CHAT_CSS).toContain('align-self: flex-start')
    expect(CHAT_CSS).toContain('.caui-row:has(> .caui-assistant > .caui-reasoning)')
    expect(CHAT_CSS).toContain('.caui-assistant:not(:has(.caui-assistant-text)) > .caui-assistant-footer')
    // 卡片时代的描边流光已下线，别再把它加回来
    expect(CHAT_CSS).not.toContain('.caui-tool-trail')
  })

  // 全局压 animation-duration 会连 hover 的颜色过渡一起抹平。
  it('reduces motion without the global duration override', async () => {
    const { CHAT_CSS } = await import('../src/client/chat-a2ui/style')
    expect(CHAT_CSS).not.toContain('animation-duration: 1ms')
    expect(CHAT_CSS).toContain('.caui-streaming-cursor')
  })
})
