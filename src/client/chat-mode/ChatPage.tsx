/**
 * Root of the dedicated Chat main panel.
 *
 * This panel is a normal keyed main panel. It keeps its own Session reference
 * (source "chatMode") instead of calling uiWorkspace.openSession, so the
 * native mainView and the native "conversation" panel are untouched. The
 * child slot "chat-a2ui.conversation" is session-scoped; the renderer injects
 * a SessionProvider for it, and this page binds that provider to the retained
 * reference.
 */

import { useEffect, useState } from 'react'
import type { ComponentType, ReactElement, ReactNode } from 'react'
import { CHAT_MODE_SOURCE, CHAT_PANEL_ID } from '../constants'
import { cls } from '../chat-a2ui/classes'
import { useMotionLevel } from '../chat-a2ui/motion-preference'
import { useChatStyles } from '../chat-a2ui/style'
import type { SessionReferenceLike, SessionsApi } from '../chat-a2ui/types'
import type { ChatModeController } from './controller'
import { useChatMode } from './useChatMode'

/** Props injected into the keyed main panel. */
export interface ChatPageProps {
  controller: ChatModeController
  sessions: SessionsApi
  /** Supplied by the renderer because this registration declares a Session child. */
  SessionProvider?: ComponentType<{ session: SessionReferenceLike; children?: ReactNode }>
  renderSlot: (name: string, props?: Record<string, unknown>) => ReactNode
}

interface Entry {
  id: string
  reference: SessionReferenceLike
}

/** Centered status panel used before a Session is bound. */
function StatusPage ({ title, detail, action }: { title: string; detail: string; action?: ReactNode }): ReactElement {
  return (
    <div className={cls.chatModePage}>
      <div className={cls.chatModeStatus} role="status">
        <div className={cls.chatModeStatusMark} aria-hidden="true">✦</div>
        <div className={cls.chatModeStatusTitle}>{title}</div>
        <div className={cls.chatModeStatusDetail}>{detail}</div>
        {action}
      </div>
    </div>
  )
}

/**
 * Render the Chat shell for the controller's active Session.
 * @param props - controller, Sessions service, injected SessionProvider, and child renderer.
 */
export function ChatPage ({ controller, sessions, SessionProvider, renderSlot }: ChatPageProps): ReactElement {
  useChatStyles()
  const mode = useChatMode(controller)
  const motionLevel = useMotionLevel()
  const [entry, setEntry] = useState<Entry | null>(null)
  const [retainError, setRetainError] = useState<string | null>(null)
  const activeId = mode.activeSessionId

  // The page lifetime owns the sidebar occupant. Entering the panel installs
  // the Chat Session list; leaving it hands the workspace area back.
  useEffect(() => {
    controller.mount()
    return () => { controller.unmount() }
  }, [controller])

  // Retain one Session generation while it is active. The cleanup releases
  // the previous generation before the next effect body runs, so switching
  // never leaves two Chat references behind.
  useEffect(() => {
    if (activeId === null) {
      setEntry(null)
      setRetainError(null)
      return
    }
    if (typeof sessions.retain !== 'function') {
      setRetainError('当前宿主没有提供独立会话绑定。')
      return
    }
    let reference: SessionReferenceLike
    try {
      // Keep the method call on the service: retain reads its own `closed`
      // flag and loses `this` if the function is detached.
      reference = sessions.retain(activeId, { source: CHAT_MODE_SOURCE })
    } catch (error) {
      console.warn('[chat-a2ui] 绑定 Chat 会话失败：', error)
      setRetainError('绑定对话失败，请重试。')
      return
    }
    setRetainError(null)
    setEntry({ id: activeId, reference })
    return () => { reference.release() }
  }, [activeId, sessions])

  if (mode.phase === 'error' && activeId === null) {
    return (
      <StatusPage
        title="对话没有打开"
        detail={mode.error ?? '新建对话失败，请重试。'}
        action={(
          <div className={cls.chatModeStatusActions}>
            <button type="button" className={cls.chatModePrimary} onClick={() => { void controller.retry() }}>重试</button>
            <button type="button" className={cls.chatModeSecondary} onClick={() => { controller.back() }}>返回对话</button>
          </div>
        )}
      />
    )
  }

  if (retainError !== null) {
    return (
      <StatusPage
        title="对话没有打开"
        detail={retainError}
        action={(
          <div className={cls.chatModeStatusActions}>
            <button type="button" className={cls.chatModePrimary} onClick={() => { void controller.retry() }}>重试</button>
            <button type="button" className={cls.chatModeSecondary} onClick={() => { controller.back() }}>返回对话</button>
          </div>
        )}
      />
    )
  }

  if (activeId === null || mode.phase === 'opening' || entry === null || entry.id !== activeId) {
    return (
      <StatusPage
        title="正在打开对话"
        detail="准备好上下文后就会显示消息。"
      />
    )
  }

  if (SessionProvider === undefined) {
    return (
      <StatusPage
        title="对话容器未就绪"
        detail="宿主没有注入 SessionProvider；这通常是插件声明缺少 session 子槽导致的。"
      />
    )
  }

  return (
    <div className={cls.chatModePage} data-chat-panel={CHAT_PANEL_ID} data-motion={motionLevel}>
      <SessionProvider session={entry.reference}>
        {renderSlot('chat-a2ui.conversation', { controller })}
      </SessionProvider>
    </div>
  )
}

export default ChatPage