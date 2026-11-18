/**
 * 模型的思考过程：默认折叠，标题行在流式生成时带转圈。
 * 正文限高 260px 可滚，保留换行，用弱化颜色避免和正式回答抢注意力。
 * 折叠体来自 motion-primitives 的 disclosure（见 vendor/CollapsibleBody）。
 */

import { useId, useState } from 'react'
import { cls } from './classes'
import { CollapsibleBody } from './motion-primitives/vendor/CollapsibleBody'

export interface ReasoningProps {
  text: string
  streaming?: boolean
}

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
      <CollapsibleBody open={open} id={bodyId} className={cls.reasoningBody}>
        <div className={cls.reasoningText}>{body}</div>
      </CollapsibleBody>
    </div>
  )
}

export default Reasoning
