/**
 * Browser half of dsh-chat-a2ui.
 *
 * Registers the "Chat UI" Conversation View, the header's New Chat action, and
 * seeds the persisted View preference for chat-preset Sessions. The native
 * Session shell, composer, sidebar, and trajectory remain in place; only the
 * message area is replaced.
 * @module dsh-chat-a2ui/client
 */

import { ChatA2UIView } from './chat-a2ui/ChatA2UIView'
import type { ImageAttachmentRef, SessionsApi, WorkspacesApi } from './chat-a2ui/types'
import { CHAT_VIEW_ID, CHAT_VIEW_LABEL } from './constants'
import { installChatRuntime, type ChatHostRuntime } from './runtime'
import { createChatSession, forkChatAt, seedChatViews } from './session/actions'
import { ChatViewSync } from './session/ChatViewSync'
import { NewChatButton } from './session/NewChatButton'

/** Client services consumed by this plugin. */
export const inject = ['slots', 'sessions', 'workspaces', 'uiWorkspace', 'uiConversation']

/** Minimal structural face of the Cordis client root context. */
interface ClientContext {
  slots: {
    inject: (name: string, register: () => (() => void) | void) => void
    register: (options: Record<string, unknown>, component: unknown) => () => void
  }
  sessions: SessionsApi
  workspaces: WorkspacesApi
  uiWorkspace: {
    openSession: (sessionId: string) => void
    openWorkspace: (
      workspaceId: string,
      beforeOpen?: (sessionId: string) => void,
      options?: { agentPreset?: string },
    ) => Promise<void>
  }
  uiConversation: {
    imageUrl: (sessionId: string, attachment: ImageAttachmentRef) => string | Promise<string>
  }
  effect: (body: () => (() => void) | void, label?: string) => void
}

/** Resolve the native image URL for one attachment in one Session. */
function imageUrl (ctx: ClientContext, sessionId: string, attachment: ImageAttachmentRef): string | Promise<string> {
  return ctx.uiConversation.imageUrl(sessionId, attachment)
}

/**
 * Register the Chat UI contributions.
 * @param ctx - client root context.
 */
export function apply (ctx: ClientContext): void {
  const runtime: ChatHostRuntime = {
    sessions: ctx.sessions,
    workspaces: ctx.workspaces,
    openSession: (sessionId) => { ctx.uiWorkspace.openSession(sessionId) },
    openWorkspace: (workspaceId, beforeOpen, options) =>
      ctx.uiWorkspace.openWorkspace(workspaceId, beforeOpen, options),
  }
  installChatRuntime(runtime)

  ctx.slots.inject('conversation.view', () => {
    const disposeView = ctx.slots.register({
      name: 'conversation.view',
      id: CHAT_VIEW_ID,
      order: 1,
      label: CHAT_VIEW_LABEL,
      inject: (sessionId: string) => ({
        loadImage: (attachment: ImageAttachmentRef) => imageUrl(ctx, sessionId, attachment),
        forkAt: (seq: number) => { void forkChatAt(runtime, sessionId, seq) },
      }),
    }, ChatA2UIView)
    return disposeView
  })

  ctx.slots.inject('conversation.session.header.actions', () => ctx.slots.register({
    name: 'conversation.session.header.actions',
    id: 'chat-a2ui-new',
    order: 20,
    inject: (sessionId: string) => ({
      createChat: () => createChatSession(runtime, sessionId),
    }),
  }, NewChatButton))

  // The native preset picker opens the blank Session before the user picks
  // Chat, so its View store can initialize from the old preference. Restore
  // the stored Chat UI choice once the tab row appears, through the same click
  // path a user takes; never fight a later manual switch back to 对话.
  ctx.slots.inject('conversation.session.header.actions', () => ctx.slots.register({
    name: 'conversation.session.header.actions',
    id: 'chat-a2ui-view-sync',
    order: 10,
  }, ChatViewSync))

  // Existing chat Sessions may predate this plugin. Seed only missing string
  // preferences; a deliberate native "chat" choice is never overwritten.
  // The write must stay synchronous with the Session-list notification: a
  // microtask would let the newly opened Session's View store initialize from
  // the old preference first. ChatViewSync is the fallback; keeping this path
  // synchronous means the common case never needs it.
  ctx.effect(() => {
    const seedNow = (): void => {
      try {
        const written = seedChatViews(runtime)
        if (written > 0) console.info(`chat-a2ui: selected Chat UI for ${written} session(s)`)
      } catch (error: unknown) {
        console.warn('chat-a2ui: could not seed view preferences', error)
      }
    }
    const stop = ctx.sessions.list.subscribe(seedNow)
    seedNow()
    return stop
  }, 'chat-a2ui: seed Chat UI view preference')
}
