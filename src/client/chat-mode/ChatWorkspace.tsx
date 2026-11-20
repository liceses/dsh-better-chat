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
import { useMotionAttribute } from '../chat-a2ui/motion-scope'
import { TextEffect } from '../chat-a2ui/motion-primitives/vendor/TextEffect'
import { TextShimmerWave } from '../chat-a2ui/motion-primitives/vendor/TextShimmerWave'
import { ChatInnerScrollContext } from '../chat-a2ui/scroll-context'
import { probeLog } from '../chat-a2ui/scroll-probe'
import { useChatStyles } from '../chat-a2ui/style'
import type {
  UseSession,
  UseSessions,
} from '../chat-a2ui/types'
import { cx } from '../chat-a2ui/util'
import { CHAT_PANEL_ID, CHAT_VIEW_ID } from '../constants'
import type { ChatModeController } from './controller'
import {
  describeAffordances,
  findNewSessionControls,
  isNewSessionControl,
  isNewSessionShortcut,
} from './host-affordance'

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

/** 自检延迟：等侧栏与窗口标题栏把首屏渲染完再看，避免把「还没渲染」误判成「已经改版」。 */
const AFFORDANCE_PROBE_MS = 800

/** 自检只告警一次（模块级，跨挂载保持），免得面板反复开关刷屏。 */
let affordanceWarned = false

/**
 * 在页面里找宿主认得出的新建会话控件；一个都找不到就告警一次。
 * 只读 DOM，不抛错、不影响渲染。
 */
function checkNewSessionAffordances (): void {
  if (affordanceWarned) return
  if (findNewSessionControls(document).length > 0) return
  affordanceWarned = true
  console.warn(
    '[chat-a2ui] 页面上找不到宿主的新建会话控件，捕获阶段的拦截可能已失效。当前判据：'
    + describeAffordances()
    + '。宿主 UI 可能已改，请更新 src/client/chat-mode/host-affordance.ts。'
    + '（侧栏被收起，或当前访问快照不含 session/create 时，这条告警属正常。）',
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
  // 档位属性统一由 useMotionAttribute 给出：CSS 选择器挂在根元素自身。
  const motionAttrs = useMotionAttribute()

  const toggleTrajectory = useCallback((): void => {
    setTrajectoryOpen(open => !open)
  }, [])

  // B4「切会话单次落位」需要知道「什么时候换了会话」。探针只在开启时记录，
  // 所以这里是零成本的一条标记，而不是一条业务逻辑。
  useEffect(() => {
    probeLog('session', { id: sessionId.slice(0, 12) })
  }, [sessionId])

  // While Chat is the active panel, the shell's own New Session affordances
  // must create a Chat conversation instead of a native Session (which would
  // switch the main column away). This host build offers no action slot for
  // that entry: the sidebar row is rendered by the shell itself (its only hole,
  // `sidebar.session.action`, is an HOC that decorates the shell's own button
  // content and leaves the create action with the shell), the window-chrome
  // control belongs to `shell.leading`, and the `session.new` command belongs
  // to ui-workspace. So capture the click and the global shortcut before React
  // or the shortcut service reaches them. The criteria themselves live in
  // host-affordance.ts so the self-check below can share them.
  useEffect(() => {
    const onClick = (event: MouseEvent): void => {
      if (!isNewSessionControl(event.target)) return
      event.preventDefault()
      event.stopPropagation()
      void controller.enterNew()
    }
    const onKeyDown = (event: KeyboardEvent): void => {
      if (!isNewSessionShortcut(event)) return
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

  // 自检：上面那套判据认的是宿主的 aria 约定，宿主改版会让拦截**静默**失效
  // （点击不再被接管，页面却不会报错）。挂载后检查一次页面里是否还存在被认出的
  // 新建会话控件，没有就告警一次——告警是这套捕获方案的可观测性兜底，不是装饰。
  useEffect(() => {
    const timer = window.setTimeout(checkNewSessionAffordances, AFFORDANCE_PROBE_MS)
    return () => { window.clearTimeout(timer) }
  }, [])

  const shownTitle = typeof title === 'string' && title.trim().length > 0 ? title.trim() : '新对话'
  const running = session.running === true

  return (
    <div
      className={cx(cls.chatModeWorkspace, session.blank === true && cls.chatModeBlank)}
      data-chat-panel={CHAT_PANEL_ID}
      data-chat-workspace=""
      {...motionAttrs}
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