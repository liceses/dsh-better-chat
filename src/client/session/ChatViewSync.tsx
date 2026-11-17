/**
 * 把"存储里已经选了 Chat UI、但当前 Session 的 View store 仍停在原生对话"
 * 的会话拨回 Chat UI。
 *
 * 为什么会发生：原生 preset 选择器先打开空白 Session，View store 在此时
 * 就用旧偏好初始化；之后用户改选 Chat preset，插件才把偏好写成 chat-a2ui。
 * 只写 localStorage 不会更新已经存在的 store，于是首条消息后仍停在"对话"。
 *
 * 这里用一次真实的 tab 点击完成切换：走的是原生 selectView 路径，不碰
 * store 内部结构，也不会和用户后续手动切回"对话"打架（每个 session 只尝试一次）。
 */

import { useLayoutEffect, useRef } from 'react'
import type { ReactElement } from 'react'
import { CHAT_VIEW_ID, CHAT_VIEW_LABEL } from '../constants'
import { readStoredView } from './preferences'

/** 头部动作只关心当前 Session。 */
export interface ChatViewSyncProps {
  sessionId: string
}

/** 找到 Chat UI tab；只有真正渲染在 tablist 里才点得到。 */
function findChatTab (): HTMLButtonElement | undefined {
  const tabs = document.querySelectorAll<HTMLButtonElement>('[data-conversation-tabs] [role="tab"]')
  for (const tab of tabs) {
    if (tab.textContent?.trim() === CHAT_VIEW_LABEL) return tab
  }
  return undefined
}

/**
 * 不可见的 header action：在会话第一次出现 tab 行时，若偏好仍是 Chat UI
 * 但当前 tab 不是它，就点一次 Chat UI。渲染 null，不占布局。
 */
export function ChatViewSync ({ sessionId }: ChatViewSyncProps): ReactElement | null {
  const attempted = useRef(false)

  useLayoutEffect(() => {
    attempted.current = false
    if (readStoredView(sessionId) !== CHAT_VIEW_ID) return undefined

    let stopped = false
    const attempt = (): void => {
      if (stopped || attempted.current) return
      if (readStoredView(sessionId) !== CHAT_VIEW_ID) return
      const tab = findChatTab()
      if (tab === undefined) return
      if (tab.getAttribute('aria-selected') === 'true') {
        attempted.current = true
        return
      }
      attempted.current = true
      tab.click()
    }

    attempt()
    if (attempted.current) return undefined

    // 首条消息之前 header 不渲染 actions；tab 行出现后再试。
    const observer = new MutationObserver(attempt)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => {
      stopped = true
      observer.disconnect()
    }
  }, [sessionId])

  return null
}
