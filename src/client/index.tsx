/**
 * Browser half of dsh-chat-a2ui.
 *
 * Two surfaces share one Chat implementation:
 * - a global "Chat" main panel with its own Session reference, header, resident
 *   composer, and collapsible trajectory dock (entry B);
 * - a "Chat UI" Conversation View that can still be selected inside the native
 *   conversation panel.
 *
 * The Chat panel never calls uiWorkspace.openSession, so it does not disturb
 * the native mainView, sidebar, history, or trajectory data.
 * @module dsh-chat-a2ui/client
 */

import type { ComponentType } from 'react'
import { ChatA2UIView } from './chat-a2ui/ChatA2UIView'
import type { ImageAttachmentRef, SessionsApi, WorkspacesApi } from './chat-a2ui/types'
import { ChatPage } from './chat-mode/ChatPage'
import { ChatPanelIcon } from './chat-mode/ChatPanelIcon'
import { ChatSessionList } from './chat-mode/ChatSessionList'
import { ChatWorkspace } from './chat-mode/ChatWorkspace'
import { ChatModeController } from './chat-mode/controller'
import { ensureChatWorkspace, readInjectedChatPaths } from './chat-mode/chat-workspace'
import { archiveChatSession } from './chat-mode/archive-session'
import {
  CHAT_PANEL_ID,
  CHAT_PANEL_LABEL,
  CHAT_VIEW_ID,
  CHAT_VIEW_LABEL,
} from './constants'
import { forkChatAt } from './session/actions'
import { NewChatButton } from './session/NewChatButton'

/** Client services consumed by this plugin. */
export const inject = [
  'slots',
  'sessions',
  'workspaces',
  'layout',
  'uiConversation',
  'uiWorkspace',
]

/** Minimal structural face of the Cordis client root context. */
interface ClientContext {
  slots: {
    inject: (name: string, register: () => (() => void) | void) => void
    register: (options: Record<string, unknown>, component: unknown) => () => void
  }
  sessions: SessionsApi
  workspaces: WorkspacesApi
  layout: {
    selectPanel: (panelId: string | null) => void
  }
  uiConversation: {
    imageUrl: (sessionId: string, attachment: ImageAttachmentRef) => string | Promise<string>
  }
  uiWorkspace: {
    openSession: (sessionId: string) => void
    /** 归档（宿主的全局归档集，从所有分组视图隐藏，可撤销）。 */
    archiveSession?: (sessionId: string, options?: { stopActivity?: boolean }) => Promise<void>
    unarchiveSession?: (sessionId: string) => Promise<void>
  }
}

/** Resolve the native image URL for one attachment in one Session. */
function imageUrl (ctx: ClientContext, sessionId: string, attachment: ImageAttachmentRef): string | Promise<string> {
  return ctx.uiConversation.imageUrl(sessionId, attachment)
}

/**
 * Register the Chat panel, its Session-scoped body, the sidebar list, the
 * native View tab, and the entry points.
 * @param ctx - client root context.
 */
export function apply (ctx: ClientContext): void {
  // Chat 工作区：路径来自宿主半（`webserver/index-inject` 推的页面全局），
  // 注册由这里完成。第一次建会话前 await 一次，拿到 id 之后一直复用。
  const injected = readInjectedChatPaths()
  let chatWorkspaceId: string | undefined
  let ensuring: Promise<string | undefined> | null = null
  const ensure = async (): Promise<void> => {
    if (chatWorkspaceId !== undefined) return
    if (ensuring === null) ensuring = ensureChatWorkspace(ctx.workspaces, injected.chatWorkspace)
    const id = await ensuring
    ensuring = null
    if (id !== undefined) chatWorkspaceId = id
  }

  const controller = new ChatModeController({
    sessions: ctx.sessions,
    workspaces: ctx.workspaces,
    slots: ctx.slots,
    layout: ctx.layout,
    sidebarComponent: ChatSessionList,
    ensureChatWorkspace: ensure,
    chatWorkspaceId: () => chatWorkspaceId,
    archiveSession: (sessionId: string) => archiveChatSession(ctx.uiWorkspace, sessionId),
    unarchiveSession: async (sessionId: string) => {
      const restore = ctx.uiWorkspace.unarchiveSession
      if (typeof restore !== 'function') return
      try {
        await restore(sessionId)
      } catch (error) {
        console.warn('[chat-a2ui] 撤销归档失败：', error)
      }
    },
  })

  /**
   * Branch from a rendered message. Inside the mounted Chat panel the child
   * becomes the active Chat Session; in the native conversation the child is
   * opened through uiWorkspace as before.
   */
  const branchFromView = (sessionId: string, seq: number): void => {
    const state = controller.getSnapshot()
    if (state.mounted && state.activeSessionId === sessionId) {
      void controller.branch(sessionId, seq)
      return
    }
    void forkChatAt({ sessions: ctx.sessions }, sessionId, seq)
      .then((child) => {
        if (child !== undefined) ctx.uiWorkspace.openSession(child)
      })
      .catch((error: unknown) => { console.warn('[chat-a2ui] 分支失败：', error) })
  }

  // The keyed main panel owns a session-scoped child; the renderer injects a
  // SessionProvider for that child declaration, and ChatPage binds it to its
  // own retained reference.
  ctx.slots.inject('main', () => {
    const disposePanel = ctx.slots.register({
      name: 'main',
      key: CHAT_PANEL_ID,
      children: {
        'chat-a2ui.conversation': { kind: 'single', scope: 'session' },
      },
      inject: () => ({ controller, sessions: ctx.sessions }),
    }, ChatPage as unknown as ComponentType<Record<string, unknown>>)
    // A child slot is owned by the entry that declared it: register the body
    // inside the same declaration lifetime, not in a separate inject group.
    const disposeBody = ctx.slots.register({
      name: 'chat-a2ui.conversation',
      inject: () => ({ controller }),
    }, ChatWorkspace as unknown as ComponentType<Record<string, unknown>>)
    return () => { disposeBody(); disposePanel() }
  })

  // Sidebar row: same id as the main key, so selecting it opens this panel.
  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
    name: 'sidebar.panellist',
    id: CHAT_PANEL_ID,
    order: 5,
    label: () => CHAT_PANEL_LABEL,
  }, ChatPanelIcon))

  // Native Conversation View: kept as a manual tab. Selecting it no longer
  // happens automatically; branch navigates through uiWorkspace.
  ctx.slots.inject('conversation.view', () => ctx.slots.register({
    name: 'conversation.view',
    id: CHAT_VIEW_ID,
    order: 1,
    label: CHAT_VIEW_LABEL,
    inject: (sessionId: string) => ({
      loadImage: (attachment: ImageAttachmentRef) => imageUrl(ctx, sessionId, attachment),
      forkAt: (seq: number) => { branchFromView(sessionId, seq) },
    }),
  }, ChatA2UIView))

  // Header action reused by both headers. In the native header it enters the
  // Chat panel and asks the controller to create the first conversation; in
  // the Chat header it creates a sibling conversation in place.
  ctx.slots.inject('conversation.session.header.actions', () => ctx.slots.register({
    name: 'conversation.session.header.actions',
    id: 'chat-a2ui-new',
    order: 20,
    inject: () => ({
      createChat: () => controller.enterNew(),
    }),
  }, NewChatButton))
}
