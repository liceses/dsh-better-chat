/**
 * Session-scoped body of the Chat panel.
 *
 * It reuses the native Conversation content factory (scroll body + resident
 * composer + hero), forces the message area to the Chat view, embeds the
 * native Session header actions/utilities, and owns a collapsible right dock
 * for the native trajectory view.
 */

import { useCallback, useEffect, useState } from 'react'
import type { ComponentType, ReactElement, ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cls } from '../chat-a2ui/classes'
import { layoutSpring } from '../chat-a2ui/motion'
import { MOTION } from '../chat-a2ui/motion-config'
import { useMotionLevel } from '../chat-a2ui/motion-preference'
import { TextEffect } from '../chat-a2ui/motion-primitives/vendor/TextEffect'
import { TextShimmerWave } from '../chat-a2ui/motion-primitives/vendor/TextShimmerWave'
import { ChatInnerScrollContext } from '../chat-a2ui/scroll-context'
import { useChatStyles } from '../chat-a2ui/style'
import type {
  UseSession,
  UseSessions,
} from '../chat-a2ui/types'
import { cx } from '../chat-a2ui/util'
import { CHAT_PANEL_ID, CHAT_VIEW_ID } from '../constants'
import type { ChatModeController } from './controller'

/** Props injected into the session-scoped Chat body. */
export interface ChatWorkspaceProps {
  sessionId: string
  controller: ChatModeController
  useSession: UseSession
  useSessions: UseSessions
  renderFactorySlot: (
    name: string,
    props: Record<string, unknown>,
    slots?: { slots?: Record<string, ComponentType<any>> },
  ) => ReactNode
}

/** Props of the factory-local "views" component. */
interface ConversationViewsProps {
  renderSlot: (name: string, props?: Record<string, unknown>) => ReactNode
}

/** Force the shared Conversation content to show the Chat view. */
function FixedChatModeView (props: ConversationViewsProps): ReactElement {
  return <>{props.renderSlot('conversation.session', { view: CHAT_VIEW_ID })}</>
}

/** Force the shared Conversation content to show the native trajectory view. */
function FixedTrajectoryView (props: ConversationViewsProps): ReactElement {
  return <>{props.renderSlot('conversation.session', { view: 'trajectory' })}</>
}

/** Collapse/expand glyph for the trajectory dock. */
function PanelGlyph ({ open }: { open: boolean }): ReactElement {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1.8" y="2.6" width="12.4" height="10.8" rx="2" />
      <path d={open ? 'M10.2 2.8v10.4' : 'M5.8 2.8v10.4'} />
    </svg>
  )
}

/** A small back arrow. */
function BackGlyph (): ReactElement {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.8 3.6 5.4 8l4.4 4.4" />
    </svg>
  )
}

/**
 * Render the Chat header, Conversation content, and trajectory dock.
 * @param props - Session hooks, the factory renderer, and the Chat controller.
 */
export function ChatWorkspace ({
  sessionId,
  controller,
  useSession,
  useSessions,
  renderFactorySlot,
}: ChatWorkspaceProps): ReactElement {
  useChatStyles()
  const session = useSession(value => value)
  const title = useSessions(state => state.byId[sessionId]?.displayTitle)
  const [trajectoryOpen, setTrajectoryOpen] = useState(false)
  const motionLevel = useMotionLevel()
  const animated = motionLevel === 'full'

  const toggleTrajectory = useCallback((): void => {
    setTrajectoryOpen(open => !open)
  }, [])

  // While Chat is the active panel, the shell's own New Session affordances
  // must create a Chat conversation instead of a native Session (which would
  // switch the main column away). The sidebar renders that row outside the
  // pluggable action slot in this host build, so capture the click and the
  // global shortcut before React or the shortcut service reaches them.
  useEffect(() => {
    const isNewSessionControl = (target: EventTarget | null): boolean => {
      if (!(target instanceof Element)) return false
      return target.closest('button[aria-keyshortcuts*="Alt+N"], button[aria-label="新建会话"], button[aria-label="New session"]') !== null
    }
    const onClick = (event: MouseEvent): void => {
      if (!isNewSessionControl(event.target)) return
      event.preventDefault()
      event.stopPropagation()
      void controller.enterNew()
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (!(event.metaKey || event.ctrlKey) || event.shiftKey) return
      if (event.key.toLowerCase() !== 'n') return
      event.preventDefault()
      event.stopPropagation()
      void controller.enterNew()
    }
    document.addEventListener('click', onClick, true)
    window.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('keydown', onKeyDown, true)
    }
  }, [controller])

  const shownTitle = typeof title === 'string' && title.trim().length > 0 ? title.trim() : '新对话'
  const running = session.running === true

  return (
    <div
      className={cx(cls.chatModeWorkspace, session.blank === true && cls.chatModeBlank)}
      data-chat-panel={CHAT_PANEL_ID}
      data-chat-workspace=""
      data-motion={motionLevel}
    >
      <header className={cls.chatModeHeader} data-chat-mode-header="">
        <div className={cls.chatModeHeaderMain}>
          <button
            type="button"
            className={cls.chatModeIconButton}
            aria-label="返回普通对话"
            title="返回普通对话"
            onClick={() => { controller.back() }}
          >
            <BackGlyph />
          </button>
          <div className={cls.chatModeTitleBlock}>
            <div className={cls.chatModeTitle}>
              {running && <span className={cls.liveDot} aria-label="正在生成" />}
              <span>{shownTitle}</span>
            </div>
            <div className={cls.chatModeSubtitle}>
              {running && animated
                ? (
                  <span aria-label="正在生成…">
                    <TextShimmerWave as="span" className={cls.chatModeShimmer} aria-hidden="true" {...MOTION.shimmer}>正在生成…</TextShimmerWave>
                  </span>
                  )
                : (running ? '正在生成…' : 'Chat 模式')}
            </div>
          </div>
        </div>
        <div className={cls.chatModeHeaderActions}>
          <button
            type="button"
            className={cx(cls.chatModeToolbarButton, cls.chatModeToolbarPrimary)}
            aria-label="新对话"
            title="新对话"
            onClick={() => { void controller.enterNew() }}
          >
            <span className={cls.chatModeNewGlyph} aria-hidden="true">＋</span>
            <span className={cls.chatModeToolbarLabel}>新对话</span>
          </button>
          <button
            type="button"
            className={cx(cls.chatModeToolbarButton, trajectoryOpen && cls.chatModeToolbarActive)}
            aria-label={trajectoryOpen ? '收起轨迹' : '打开轨迹'}
            aria-pressed={trajectoryOpen}
            title="轨迹"
            onClick={toggleTrajectory}
          >
            <PanelGlyph open={trajectoryOpen} />
            <span className={cls.chatModeToolbarLabel}>轨迹</span>
          </button>
        </div>
      </header>

      <div className={cls.chatModeBody}>
        <div className={cls.chatModeMain}>
          <ChatInnerScrollContext.Provider value={true}>
            {renderFactorySlot('conversation.content', { variant: 'main', phase: 'active', hero: false }, {
              slots: { views: FixedChatModeView },
            })}
          </ChatInnerScrollContext.Provider>
          {session.blank === true && (
            <div className={cls.chatModeBlankState} aria-hidden="true">
              <div className={cls.chatModeBlankOrb} />
              <div className={cls.chatModeBlankTitle}>
                <TextEffect as="div" {...MOTION.textEffect.blankTitle} trigger={animated}>开始聊天</TextEffect>
              </div>
              <div className={cls.chatModeBlankHint}>纯对话模式：只聊天和查资料，不写文件、不跑命令。</div>
              <div className={cls.chatModeBlankHint}>输入框已就绪，随时可以开始。</div>
            </div>
          )}
        </div>
        <AnimatePresence initial={false}>
          {trajectoryOpen && (
            <motion.aside
              key="trajectory"
              className={cls.chatModeDock}
              aria-label="轨迹"
              initial={animated ? { width: 0, opacity: 0 } : false}
              animate={{ width: 360, opacity: 1 }}
              exit={animated ? { width: 0, opacity: 0 } : { opacity: 0, width: 0 }}
              transition={animated ? layoutSpring : { duration: 0 }}
            >
              <div className={cls.chatModeDockInner}>
                <div className={cls.chatModeDockHead}>
                  <span className={cls.chatModeDockTitle}>轨迹</span>
                  <button
                    type="button"
                    className={cls.chatModeIconButton}
                    aria-label="收起轨迹"
                    title="收起轨迹"
                    onClick={toggleTrajectory}
                  >
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                      <path d="m4 4 8 8M12 4l-8 8" />
                    </svg>
                  </button>
                </div>
                <div className={cls.chatModeDockBody}>
                  <div className={cls.chatModeDockConversation}>
                    {renderFactorySlot('conversation.content', { variant: 'embedded', phase: 'active', hero: false }, {
                      slots: { views: FixedTrajectoryView },
                    })}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ChatWorkspace