/** Registered Conversation View identity for the chat shell. */
export const CHAT_VIEW_ID = 'chat-a2ui'

/** Agent preset identity mounted by the host half. */
export const CHAT_PRESET_ID = 'chat'

/** Label shown in the native View tab row. */
export const CHAT_VIEW_LABEL = 'Chat UI'

/** Main-column panel key that hosts the dedicated Chat mode. */
export const CHAT_PANEL_ID = 'chat-a2ui'

/** Sidebar panel-row label. */
export const CHAT_PANEL_LABEL = 'Chat'

/** Session-reference source owned by the Chat page while it is open. */
export const CHAT_MODE_SOURCE = 'chatMode'

/**
 * 右栏 Chat tab 自己持有的会话引用标签。
 *
 * 只有「在 tab 里看别的会话」时才 retain，所以和 `chatMode`（Chat 主面板）分开记，
 * 宿主的 retainInfo / 调试面板里能一眼看出引用是谁拿的。
 */
export const RIGHTBAR_SESSION_SOURCE = 'rightbarChat'

/** Conversation View id rendered inside the dedicated Chat shell. */
export const CHAT_MODE_TITLE = 'Chat 模式'
