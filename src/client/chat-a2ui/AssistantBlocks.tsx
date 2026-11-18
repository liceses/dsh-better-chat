/**
 * assistant-step 的内容块渲染。
 *
 * 两点约定：
 * 1. 块顺序即模型输出顺序；只有「最后一个块」承担流式状态，
 *    保证同一时刻不会出现两个光标或两个 spinner。
 * 2. tool-call 块一律跳过：原生 Chat 会把工具调用投影成独立的
 *    kind='tool-call' 节点，由 ChatRow 单独渲染，这里再画一次会出现两张卡。
 */
import { memo, type ReactElement } from 'react'
import type { AssistantBlock, AssistantData, ImageAttachmentRef } from './types'
import { Markdown } from './Markdown'
import { Reasoning } from './Reasoning'
import { ChatImage } from './ChatImage'
import { cls } from './classes'

/** 宿主注入的附件 loader：把引用换成可显示的图片地址。 */
export type LoadImage = (attachment: ImageAttachmentRef) => string | Promise<string>

export interface AssistantBlocksProps {
  /** 当前 step 的全部内容块。 */
  blocks: readonly AssistantBlock[]
  /** step 状态：running 时最后一个块进入流式态。 */
  status?: AssistantData['status']
  /** 这一行是不是「当前正在写的那一行」（宿主没给 status=running 时的兜底）。 */
  live?: boolean
  /** 图片块加载器。 */
  loadImage: LoadImage
}

/** 'other' 块只读取类型名，绝不把未知结构塞进 DOM。 */
function otherLabel (block: unknown): string {
  if (typeof block === 'object' && block !== null) {
    const type = (block as Record<string, unknown>)['type']
    if (typeof type === 'string' && type !== '') return type
  }
  return '未知内容'
}

/**
 * 渲染一个 assistant step 的所有块。
 * 空 blocks 返回 null，让调用方只显示页脚时间。
 */
export const AssistantBlocks = memo(function AssistantBlocks ({ blocks, status, live = false, loadImage }: AssistantBlocksProps): ReactElement | null {
  if (!Array.isArray(blocks) || blocks.length === 0) return null
  const streaming = status === 'running'
  const lastIndex = blocks.length - 1

  const rendered = blocks.map((block, index) => {
    // 节点数据来自多版本宿主，这里按运行时形状兜底，绝不因为形状异常抛错。
    if (typeof block !== 'object' || block === null) {
      return (
        <div key={index} className={cls.unknown}>
          <span className={cls.unknownType}>{otherLabel(block)}</span>
        </div>
      )
    }
    switch (block.kind) {
      case 'text':
        return (
          <div key={index} className={cls.assistantText}>
            <Markdown
              text={block.text}
              streaming={streaming && index === lastIndex}
              tail={live && index === lastIndex}
            />
          </div>
        )
      case 'reasoning':
        return <Reasoning key={index} text={block.text} streaming={streaming && index === lastIndex} />
      case 'tool-call':
        // 由独立的 kind='tool-call' 节点渲染，见文件头说明。
        return null
      case 'image':
        return <ChatImage key={index} attachment={block.attachment} loadImage={loadImage} />
      default:
        return (
          <div key={index} className={cls.unknown}>
            <span className={cls.unknownType}>{otherLabel(block.block)}</span>
            <span className={cls.unknownBody}>暂不支持的内容块</span>
          </div>
        )
    }
  })

  return <>{rendered}</>
})

export default AssistantBlocks
