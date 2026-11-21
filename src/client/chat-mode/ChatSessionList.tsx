/** Chat-only Session list shown in the left Sidebar while Chat mode is open. */

import { useCallback, useMemo, useState } from 'react'
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
  /**
   * 归档一个会话。返回宿主是否接受（运行中的会话会被拒绝）。
   * 没有这个能力时按钮不渲染：宁可不给入口，也不要给一个点了没反应的按钮。
   */
  archive?: (sessionId: string) => Promise<{ ok: boolean; reason?: string }>
  /** 撤销归档（宿主没有给插件用的 toast，所以撤销入口由我们自己画）。 */
  unarchive?: (sessionId: string) => void | Promise<void>
  /**
   * 宿主的 Workspace 快照选择器（宿主会随座位注入）。我们只读 `archivedSessionIds`；
   * 缺省时退化成只看本地隐藏（旧宿主 / 测试替身）。
   */
  useWorkspaces?: (selector: (snapshot: { archivedSessionIds?: readonly string[] }) => readonly string[]) => readonly string[]
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
export function ChatSessionList ({ controller, useSessions, archive, unarchive, useWorkspaces, wide = true }: ChatSessionListProps): ReactElement {
  useChatStyles()
  const snapshot = useSessions(state => state)
  const mode = useChatMode(controller)
  const level = useMotionLevel()
  const animated = level === 'full'
  // 档位属性统一由 useMotionAttribute 给出：CSS 选择器挂在根元素自身。
  const motionAttrs = useMotionAttribute()
  // 归档态来自宿主的全局归档集；只有宿主**接受**之后才本地补记一次，
  // 避免「被拒绝的行在本地永久消失」（宿主会拒绝正在生成的会话）。
  const hostArchived = useWorkspaces === undefined
    ? undefined
    : useWorkspaces(snapshot => snapshot.archivedSessionIds ?? [])
  const [archivedLocal, setArchivedLocal] = useState<readonly string[]>([])
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string; sessionId: string } | null>(null)
  const allRows = useMemo(() => listChatSessionsSafe(snapshot), [snapshot])
  const hidden = useMemo(() => {
    const set = new Set(archivedLocal)
    for (const id of hostArchived ?? []) set.add(id)
    return set
  }, [archivedLocal, hostArchived])
  const rows = useMemo(() => allRows.filter(row => !hidden.has(row.id)), [allRows, hidden])
  const handleArchive = useCallback((sessionId: string, title: string) => {
    if (archive === undefined) return
    void archive(sessionId).then((result) => {
      if (result.ok) {
        setArchivedLocal(current => current.includes(sessionId) ? current : current.concat(sessionId))
        setNotice({ kind: 'ok', text: '已归档「' + title + '」', sessionId })
        return
      }
      setNotice({ kind: 'error', text: result.reason ?? '归档失败', sessionId })
    })
  }, [archive])
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
                    {archive === undefined ? null : (
                      <span
                        role="button"
                        tabIndex={0}
                        className={cls.chatModeRowAction}
                        aria-label={'归档对话：' + chatRowTitle(row)}
                        title="归档（可在通知里撤销）"
                        onClick={(event) => {
                          // 行本身就是按钮：别让点击冒泡过去把会话打开。
                          event.stopPropagation()
                          handleArchive(row.id, chatRowTitle(row))
                        }}
                        onKeyDown={(event) => {
                          if (event.key !== 'Enter' && event.key !== ' ') return
                          event.preventDefault()
                          event.stopPropagation()
                          handleArchive(row.id, chatRowTitle(row))
                        }}
                      >
                        <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 5.5h12M5.5 5.5V3.5h5v2M3.5 5.5V13h9V5.5M6.5 8.5v2M9.5 8.5v2" />
                        </svg>
                      </span>
                    )}
                  </motion.button>
                )
              })}
            </AnimatePresence>
            )}
      </div>

      {notice === null ? null : (
        <div
          className={cx(cls.chatModeListNotice, notice.kind === 'error' && cls.chatModeListNoticeError)}
          role={notice.kind === 'error' ? 'alert' : 'status'}
        >
          <span>{notice.text}</span>
          {notice.kind === 'ok' && unarchive !== undefined && (
            <button
              type="button"
              className={cls.chatModeListRetry}
              onClick={() => {
                void unarchive(notice.sessionId)
                setArchivedLocal(current => current.filter(id => id !== notice.sessionId))
                setNotice(null)
              }}
            >
              撤销
            </button>
          )}
          {notice.kind === 'error' && (
            <button type="button" className={cls.chatModeListRetry} onClick={() => { setNotice(null) }}>知道了</button>
          )}
        </div>
      )}

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
