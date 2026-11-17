/**
 * 模型的思考过程：默认折叠，标题行在流式生成时带转圈。
 * 正文限高 260px 可滚，保留换行，用弱化颜色避免和正式回答抢注意力。
 */

import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import { cls } from './classes'
import { reducedMotion } from './motion'

export interface ReasoningProps {
  text: string
  streaming?: boolean
}

const BODY_TRANSITION: Transition = { duration: 0.18, ease: 'easeOut' }
const INSTANT_TRANSITION: Transition = { duration: 0 }

export function Reasoning ({ text, streaming }: ReasoningProps) {
  const [open, setOpen] = useState(false)
  const bodyId = useId() + '-reasoning'
  const isStreaming = streaming === true
  const body = text.trim() === '' ? '正在思考…' : text

  return (
    <div className={cls.reasoning} data-streaming={isStreaming ? 'true' : undefined}>
      <button
        type="button"
        className={cls.reasoningSummary}
        data-open={open ? 'true' : 'false'}
        aria-expanded={open}
        aria-controls={open ? bodyId : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        {isStreaming ? <span className={cls.reasoningSpinner} aria-hidden="true" title="生成中" /> : null}
        <span>思考过程</span>
      </button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="body"
            id={bodyId}
            className={cls.reasoningBody}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reducedMotion() ? INSTANT_TRANSITION : BODY_TRANSITION}
          >
            <div className={cls.reasoningText}>{body}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
