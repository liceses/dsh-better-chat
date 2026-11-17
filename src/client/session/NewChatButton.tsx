/** 会话头部动作区的紧凑「新对话」按钮。 */

import { useCallback, useState } from 'react'
import type { ReactElement } from 'react'
import { cls } from '../chat-a2ui/classes'
import { useChatStyles } from '../chat-a2ui/style'
import type { NewChatProps } from '../chat-a2ui/types'
import { cx } from '../chat-a2ui/util'

/** 失败时展示的一句话，避免把宿主错误原文甩给用户。 */
const FAILURE_TEXT = '新建对话失败，请重试'

/**
 * 挂在 `conversation.session.header.actions` 的紧凑按钮：
 * 点击后创建 Chat 会话并切换过去；创建期间禁用并显示旋转指示器，
 * 失败时就地给一行可被读屏播报的提示。
 */
export function NewChatButton ({ sessionId, createChat }: NewChatProps): ReactElement {
  useChatStyles()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = useCallback((): void => {
    if (pending) return
    setPending(true)
    setError(null)
    void (async () => {
      try {
        const created = await createChat()
        if (created === undefined) setError(FAILURE_TEXT)
      } catch (cause) {
        console.warn('[chat-a2ui] 新对话失败：', cause)
        setError(FAILURE_TEXT)
      } finally {
        setPending(false)
      }
    })()
  }, [createChat, pending])

  return (
    <div className={cls.newChat} data-session-id={sessionId}>
      <button
        type="button"
        className={cls.newChatButton}
        title="新建对话并切换到 Chat 视图"
        aria-label="新对话"
        aria-busy={pending}
        disabled={pending}
        onClick={handleClick}
      >
        {pending
          ? (
            // 复用 classes.ts 里已登记的旋转指示器样式，不新增未定义的 class。
            <span className={cx(cls.newChatIcon, cls.reasoningSpinner)} aria-hidden="true" />
            )
          : (
            <span className={cls.newChatIcon} aria-hidden="true">
              <svg
                viewBox="0 0 16 16"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                role="presentation"
                focusable="false"
              >
                <path d="M8 3.2v9.6M3.2 8h9.6" />
              </svg>
            </span>
            )}
        <span>新对话</span>
      </button>
      <span className={cls.newChatError} aria-live="polite">{error ?? ''}</span>
    </div>
  )
}
