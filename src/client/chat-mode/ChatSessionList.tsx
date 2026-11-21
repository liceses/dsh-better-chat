/** Chat-only Session list shown in the left Sidebar while Chat mode is open. */

import { useMemo } from 'react'
import type { ReactElement } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cls } from '../chat-a2ui/classes'
import { spring } from '../chat-a2ui/motion'
import { toggleMotionLevel, useMotionLevel } from '../chat-a2ui/motion-preference'
import { useMotionAttribute } from '../chat-a2ui/motion-scope'
import { useChatStyles } from '../chat-a2ui/style'
import type { UseSessions } from '../chat-a2ui/types'
import { cx } from '../chat-a2ui/util'
import type { ChatModeController } from './controller'
import { chatRowTitle, listChatSessions } from './select'
import { useChatMode } from './useChatMode'

/** Props injected into the sidebar.workspaces occupant. */
export interface ChatSessionListProps {
  controller: ChatModeController
  useSessions: UseSessions
  wide?: boolean
}

/** Short relative time; old rows fall back to a date. */
function formatWhen (updatedAt: number): string {
  if (!Number.isFinite(updatedAt) || updatedAt <= 0) return ''
  const elapsed = Date.now() - updatedAt
  const minute = 60_000
  const hour = 60 * minute
  if (elapsed < minute) return '刚刚'
  if (elapsed < hour) return `${Math.floor(elapsed / minute)} 分钟前`
  if (elapsed < 24 * hour) return `${Math.floor(elapsed / hour)} 小时前`
  if (elapsed < 7 * 24 * hour) return `${Math.floor(elapsed / (24 * hour))} 天前`
  const date = new Date(updatedAt)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

/**
 * Render Chat Sessions instead of the workspace browser.
 * The occupant is installed by the controller only while the Chat panel is
 * mounted, so leaving Chat restores the native workspace list.
 */
export function ChatSessionList ({ controller, useSessions, wide = true }: ChatSessionListProps): ReactElement {
  useChatStyles()
  const snapshot = useSessions(state => state)
  const mode = useChatMode(controller)
  const level = useMotionLevel()
  const animated = level === 'full'
  // 档位属性统一由 useMotionAttribute 给出：CSS 选择器挂在根元素自身。
  const motionAttrs = useMotionAttribute()
  const rows = useMemo(() => listChatSessionsSafe(snapshot), [snapshot])
  const rowTransition = animated ? spring : { duration: 0 }

  return (
    <div
      className={cx(cls.chatModeList, wide && cls.chatModeListWide)}
      data-chat-mode-sidebar=""
      {...motionAttrs}
    >
      <div className={cls.chatModeListHead}>
        <span className={cls.chatModeListTitle}>Chat 会话</span>
        <span className={cls.chatModeListCount}>{rows.length}</span>
        {wide && (
          <button
            type="button"
            className={cls.chatModeMotionToggle}
            aria-label={animated ? '关闭 Chat 动效' : '开启 Chat 动效'}
            aria-pressed={animated}
            title={animated ? '关闭动效' : '开启动效'}
            onClick={() => { toggleMotionLevel() }}
          >
            <span className={cls.chatModeMotionIcon} aria-hidden="true">{animated ? '✦' : '◌'}</span>
          </button>
        )}
      </div>

      <motion.button
        type="button"
        className={cls.chatModeNew}
        aria-label="新建 Chat 对话"
        onClick={() => { void controller.enterNew() }}
        whileHover={animated ? { y: -1 } : undefined}
        whileTap={animated ? { scale: 0.99 } : undefined}
        transition={rowTransition}
      >
        <span>新对话</span>
      </motion.button>

      <div className={cls.chatModeListBody} aria-label="Chat 会话列表">
        {rows.length === 0
          ? (
            <div className={cls.chatModeEmpty}>
              <div className={cls.chatModeEmptyTitle}>还没有对话</div>
              <div className={cls.chatModeEmptyHint}>点“新对话”开始，记录会保存在当前工作区。</div>
            </div>
            )
          : (
            <AnimatePresence initial={false}>
              {rows.map(row => {
                const active = mode.activeSessionId === row.id
                return (
                  <motion.button
                    key={row.id}
                    layout="position"
                    type="button"
                    className={cx(cls.chatModeRow, active && cls.chatModeRowActive)}
                    aria-current={active ? 'true' : undefined}
                    data-session-id={row.id}
                    onClick={() => { controller.openSession(row.id) }}
                    initial={animated ? { opacity: 0, y: 4 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={animated ? { opacity: 0, y: -4 } : { opacity: 0 }}
                    transition={rowTransition}
                    whileHover={animated ? { y: -1 } : undefined}
                  >
                    <AnimatePresence initial={false}>
                      {active && (
                        <motion.span
                          layoutId="caui-chat-active-row"
                          className={cls.chatModeRowActiveBg}
                          aria-hidden="true"
                          transition={rowTransition}
                        />
                      )}
                    </AnimatePresence>
                    <span className={cls.chatModeRowTop}>
                      {row.running && <span className={cls.liveDot} aria-label="正在生成" />}
                      <span className={cls.chatModeRowTitle}>{chatRowTitle(row)}</span>
                    </span>
                    <span className={cls.chatModeRowMeta}>
                      <span>{formatWhen(row.updatedAt)}</span>
                    </span>
                  </motion.button>
                )
              })}
            </AnimatePresence>
            )}
      </div>

      {mode.phase === 'error' && mode.error !== null && (
        <div className={cls.chatModeError} role="alert">
          <span>{mode.error}</span>
          <button type="button" className={cls.chatModeRetry} onClick={() => { void controller.retry() }}>重试</button>
        </div>
      )}
    </div>
  )
}

/** Filter without letting a malformed snapshot break the sidebar. */
function listChatSessionsSafe (snapshot: Parameters<typeof listChatSessions>[0]): ReturnType<typeof listChatSessions> {
  try {
    return listChatSessions(snapshot)
  } catch (error) {
    console.warn('[chat-a2ui] 过滤 Chat 会话失败：', error)
    return []
  }
}

export default ChatSessionList
