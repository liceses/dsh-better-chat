/**
 * Chat 视图的外壳：滚动容器、行动画、行级错误边界与空态。
 *
 * 数据订阅只发生在两处：这里订阅 order / running，ChatRow 自己订阅节点，
 * 所以流式输出只会重渲染当前行。
 */
import { Component, useRef, type ReactElement, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { ChatViewProps } from './types'
import { ChatRow } from './ChatRow'
import { ScrollToBottomButton, useStickToBottom } from './ScrollToBottom'
import { useChatStyles } from './style'
import { spring } from './motion'
import { cls } from './classes'
import { cx } from './util'
import { CHAT_VIEW_ID } from '../constants'

interface RowBoundaryProps {
  children?: ReactNode
}

interface RowBoundaryState {
  failed: boolean
}

/**
 * 行级错误边界：某个节点数据异常时只显示一条提示，
 * 不让整个聊天视图白屏。
 */
export class RowErrorBoundary extends Component<RowBoundaryProps, RowBoundaryState> {
  state: RowBoundaryState = { failed: false }

  static getDerivedStateFromError (): RowBoundaryState {
    return { failed: true }
  }

  componentDidCatch (error: unknown): void {
    console.error('[chat-a2ui] 消息行渲染失败', error)
  }

  render (): ReactNode {
    if (this.state.failed) {
      return (
        <div className={cx(cls.row, cls.rowNotice)}>
          <div className={cls.notice} role="alert">
            <span className={cls.noticeIcon} aria-hidden="true">!</span>
            <span className={cx(cls.noticeText, cls.toolError)}>此消息渲染失败</span>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

/** 空会话时的引导面板：只展示，不发送。 */
function EmptyChat (): ReactElement {
  return (
    <div className={cls.empty}>
      <div className={cls.emptyMark} aria-hidden="true">✦</div>
      <div className={cls.emptyTitle}>开始聊天</div>
      <div className={cls.emptyHint}>这是一个纯对话视图：没有文件与命令工具，输入框在下方，随时可以开始。</div>
      <div className={cls.emptyHint}>可以这样问：</div>
      <div className={cls.emptyHint}>· 用三句话解释一下这个视图适合做什么。</div>
      <div className={cls.emptyHint}>· 帮我把一个模糊的想法整理成三条待办。</div>
      <div className={cls.emptyHint}>· 比较两种方案，各说一个优点和一个缺点。</div>
    </div>
  )
}

/**
 * 聊天消息流。
 * @param props - 宿主注入的 store hooks、图片 loader 与分支动作。
 */
export function ChatA2UIView (props: ChatViewProps): ReactElement {
  const { useChat, useSession, loadImage, forkAt } = props
  useChatStyles()

  const order = useChat((snapshot) => snapshot.order)
  const running = useSession((snapshot) => snapshot.running) === true
  // 打开历史时 order 先为空、随后才灌入事件；这期间不能把“开始聊天”闪出来。
  const openState = useSession((snapshot) => snapshot.openState)
  const reduceMotion = useReducedMotion() === true

  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const keys = Array.isArray(order) ? order : []
  const { atBottom, outer, scrollToBottom } = useStickToBottom({
    containerRef,
    contentRef,
    revision: keys.length,
  })

  const rowTransition = reduceMotion ? { duration: 0 } : spring

  return (
    <div className={cls.root} data-chat-view={CHAT_VIEW_ID} data-scroll-owner={outer ? 'outer' : 'inner'}>
      <div className={cls.viewport} ref={containerRef}>
        <div
          className={cls.flow}
          ref={contentRef}
          role="log"
          aria-live="off"
          aria-label="对话消息"
          aria-busy={running}
        >
          {keys.length === 0 ? (
            openState === 'cold' || openState === 'loading'
              ? (
                <div className={cls.empty} aria-busy="true">
                  <div className={cls.emptyHint}>载入对话…</div>
                </div>
                )
              : openState === 'error'
                ? (
                  <div className={cls.empty}>
                    <div className={cls.emptyTitle}>历史加载失败</div>
                    <div className={cls.emptyHint}>可以切到“对话”标签查看错误详情，或重新打开这个会话。</div>
                  </div>
                  )
                : <EmptyChat />
          ) : (
            <AnimatePresence initial={false}>
              {keys.map((key) => (
                <motion.div
                  key={key}
                  layout
                  initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={rowTransition}
                >
                  <RowErrorBoundary>
                    <ChatRow
                      nodeKey={key}
                      useChat={useChat}
                      loadImage={loadImage}
                      forkAt={forkAt}
                      running={running}
                    />
                  </RowErrorBoundary>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
        <ScrollToBottomButton atBottom={atBottom} onScrollToBottom={scrollToBottom} />
      </div>
    </div>
  )
}

export default ChatA2UIView