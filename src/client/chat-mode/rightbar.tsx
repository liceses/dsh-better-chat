/**
 * 右栏 Chat tab：把一段完整对话挂到宿主的右侧边栏。
 *
 * 抄的是宿主 `subagentchat` 那条链（唯一成套的先例）：
 * 1. tab 正文声明一个 session 作用域子 slot → 拿到 `SessionProvider`
 * 2. 正文用 `<SessionProvider>`（无 session 时继承外层绑定）包住子 slot
 * 3. 子 slot 里用 `renderFactorySlot('conversation.content', …)` 复用宿主的会话工厂，
 *    views 固定成 chat
 *
 * 这样右栏拿到的是**真正对话**（消息、工具卡、输入框都在），而不是另画一套。
 */

import type { ReactElement, ReactNode, ComponentType } from 'react'

/** tab 类型 id（同时是 keyed slot 的 key）。 */
export const RIGHTBAR_CHAT_ID = 'chat-a2ui.chat'

/** 子 slot 名：会话作用域，渲染器会为它注入 SessionProvider。 */
export const RIGHTBAR_CHAT_CONVERSATION = 'chat-a2ui.rightbar.conversation'

/** 宿主注入的最小面（只声明我们用到的）。 */
interface TabBodyProps {
  SessionProvider?: ComponentType<{ session?: unknown; children?: ReactNode }>
  renderSlot?: (name: string, props?: Record<string, unknown>) => ReactNode
}

interface ConversationProps {
  renderFactorySlot?: (
    name: string,
    props?: Record<string, unknown>,
    overrides?: { slots?: Record<string, ComponentType<{ renderSlot: (name: string, props?: Record<string, unknown>) => ReactNode }>> },
  ) => ReactNode
}

/** 固定在 chat 视图上（不跟随用户在主区的视图选择）。 */
function FixedChatView (props: {
  renderSlot: (name: string, props?: Record<string, unknown>) => ReactNode
}): ReactElement {
  return <>{props.renderSlot('conversation.session', { view: 'chat' })}</>
}

/** 子 slot 的正文：复用宿主的 conversation.content 工厂。 */
export function RightbarChatConversation ({ renderFactorySlot }: ConversationProps): ReactElement {
  if (typeof renderFactorySlot !== 'function') return <></>
  return <>{renderFactorySlot('conversation.content', {
    variant: 'embedded',
    phase: 'active',
    hero: false,
  }, { slots: { views: FixedChatView } })}</>
}

/** tab 正文：把子 slot 包在会话作用域里。 */
export function RightbarChatTab ({ SessionProvider, renderSlot }: TabBodyProps): ReactElement {
  if (SessionProvider === undefined || renderSlot === undefined) return <></>
  return (
    <SessionProvider>
      {renderSlot(RIGHTBAR_CHAT_CONVERSATION, {})}
    </SessionProvider>
  )
}

/**
 * 把 tab 类型、正文与子 slot 注册进宿主。
 * @param slots - 宿主 slots 服务。
 * @param tabs - 宿主 sidebarRightTabs 服务。
 * @returns 注销函数列表（插件卸载时用）。
 */
export function registerRightbarChat (
  slots: {
    inject: (name: string, register: () => (() => void) | void) => void
    register: (options: Record<string, unknown>, component: unknown) => () => void
  },
  tabs: { register: (definition: Record<string, unknown>) => () => void },
): Array<() => void> {
  const disposers: Array<() => void> = []
  disposers.push(tabs.register({
    id: RIGHTBAR_CHAT_ID,
    kind: 'chat',
    priority: 'extension',
    multiple: false,
    keepMounted: true,
    title: () => 'Chat',
    // guide 卡片是用户唯一能发现它的地方：pane 的「+」→ guide 页 → 这张卡。
    guide: [{ order: 25, title: 'Chat', description: '在右栏和 Chat 对话' }],
  }))
  slots.inject('sidebar.right.pane.tab', () => slots.register({
    name: 'sidebar.right.pane.tab',
    key: RIGHTBAR_CHAT_ID,
    children: { 'chat-a2ui.rightbar.conversation': { kind: 'single', scope: 'session' } },
  }, RightbarChatTab))
  slots.inject(RIGHTBAR_CHAT_CONVERSATION, () => slots.register({
    name: RIGHTBAR_CHAT_CONVERSATION,
  }, RightbarChatConversation))
  return disposers
}
