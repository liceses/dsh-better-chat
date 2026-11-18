/**
 * Chat 视图的外壳：滚动容器、行动画、行级错误边界与空态。
 *
 * 数据订阅只发生在两处：这里订阅 order / running，ChatRow 自己订阅节点，
 * 所以流式输出只会重渲染当前行。
 */
import { Component, useRef, type ReactElement, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { ChatViewProps } from './types'
import { ChatRow } from './ChatRow'
import { ScrollToBottomButton, useStickToBottom } from './ScrollToBottom'
import { useChatStyles } from './style'
import { rowEnterStart, rowEntered, rowExitTarget, spring } from './motion'
import { MOTION } from './motion-config'
import { useMotionLevel } from './motion-preference'
import { AnimatedGroup } from './motion-primitives/vendor/AnimatedGroup'
import { ProgressiveBlur } from './motion-primitives/vendor/ProgressiveBlur'
import { TextEffect } from './motion-primitives/vendor/TextEffect'
import { cls } from './classes'
import { useChatInnerScroll } from './scroll-context'
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

const SUGGESTIONS = [
  '用三句话解释一下这个视图适合做什么。',
  '帮我把一个模糊的想法整理成三条待办。',
  '比较两种方案，各说一个优点和一个缺点。',
]

/** 空会话时的引导面板：只展示，不发送。 */
function EmptyChat ({ animated }: { animated: boolean }): ReactElement {
  return (
    <div className={cls.empty} aria-label="开始聊天">
      <div className={cls.emptyMark} aria-hidden="true">✦</div>
      <div className={cls.emptyTitle} aria-hidden="true">
        <TextEffect as="div" {...MOTION.textEffect.emptyTitle} trigger={animated}>开始聊天</TextEffect>
      </div>
      <div className={cls.emptyHint}>纯对话模式：只聊天和查资料，不写文件、不跑命令。输入框在下方，随时可以开始。</div>
      {animated
        ? (
          <AnimatedGroup
            preset={MOTION.animatedGroup.suggestions.preset}
            className={cls.emptySuggestions}
            variants={{
              container: {
                visible: { transition: { staggerChildren: MOTION.animatedGroup.suggestions.stagger } },
              },
            }}
          >
            {SUGGESTIONS.map(text => <div key={text} className={cls.emptySuggestion}>{text}</div>)}
          </AnimatedGroup>
          )
        : (
          <div className={cls.emptySuggestions}>
            {SUGGESTIONS.map(text => <div key={text} className={cls.emptySuggestion}>{text}</div>)}
          </div>
          )}
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
  const motionLevel = useMotionLevel()
  const animated = motionLevel === 'full'

  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  // 消息流末尾的可变占位：跟随器直接写它的高度，用来「预先」让出底部空间。
  const tailRef = useRef<HTMLDivElement>(null)
  const keys = Array.isArray(order) ? order : []
  // Chat 主面板里消息区必须自己拥有滚动：原生 viewArea 的高度已经扣掉了
  // composer，让外层滚动会让内容伸到输入框底下（viewArea 不会跟着长高）。
  // 原生 conversation 的 Chat UI tab 仍由外层滚动容器负责。
  const forceInner = useChatInnerScroll()
  const { atBottom, outer, scrollToBottom } = useStickToBottom({
    containerRef,
    contentRef,
    revision: keys.length,
    forceInner,
    tailRef,
  })

  const rowTransition = animated ? spring : { duration: 0 }

  return (
    <div
      className={cls.root}
      data-chat-view={CHAT_VIEW_ID}
      data-scroll-owner={forceInner || !outer ? 'inner' : 'outer'}
      data-motion={motionLevel}
    >
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
                : <EmptyChat animated={animated} />
          ) : (
            <AnimatePresence initial={false}>
              {keys.map((key) => (
                <motion.div
                  key={key}
                  // 生成中不做 layout 弹簧：那一层会对同一段高度变化再做一次
                  // scale 修正，和块高度补间叠加，产生二次位移。
                  layout={animated && !running}
                  initial={animated ? rowEnterStart : false}
                  animate={rowEntered}
                  exit={animated ? rowExitTarget : { opacity: 0 }}
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
          <div ref={tailRef} className="caui-flow-tail" aria-hidden="true" />
        </div>
        <ScrollToBottomButton atBottom={atBottom} onScrollToBottom={scrollToBottom} />
      </div>
      {forceInner && (
        <>
          <ProgressiveBlur direction="top" className={cls.flowBlurTop} blurLayers={6} blurIntensity={0.32} />
          <ProgressiveBlur direction="bottom" className={cls.flowBlurBottom} blurLayers={6} blurIntensity={0.32} />
        </>
      )}
    </div>
  )
}

export default ChatA2UIView
