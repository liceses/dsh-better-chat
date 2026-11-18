/**
 * 消息区滚动归属的上下文。
 *
 * Chat 主面板里，原生 viewArea 的高度已经扣掉了 composer，消息区必须自己滚动；
 * 原生 conversation 的 Chat UI tab 则由外层 [data-conversation-scroll] 负责滚动。
 * 两种承载方式共用同一个 ChatA2UIView，所以由外壳显式声明，而不是组件自己猜。
 */

import { createContext, useContext } from 'react'

/** true 表示消息区使用自己的滚动容器。 */
export const ChatInnerScrollContext = createContext(false)

/** 读取当前承载方式是否要求内滚动。 */
export function useChatInnerScroll (): boolean {
  return useContext(ChatInnerScrollContext)
}
