/**
 * 会话视图的唯一样式来源。
 *
 * 没有 CSS import、没有 CSS-in-JS 依赖：整份样式是一个字符串，
 * 由 useChatStyles() 在需要时一次性注入 document.head。
 * 样式表常驻即可，插件卸载时不需要移除（宿主会整体刷新页面）。
 *
 * 样式按表面切成六块（见 styles/），再加上最后接的 P0.6 视觉层（style-p06.ts），
 * 一共七块；这里只负责按固定顺序拼起来：
 * base → flow → composer → list → lightbox → misc → P0.6。
 * 顺序有意义：同一元素上的低特异性规则仍靠先后手决定胜负，
 * 调整拼接顺序等于调整样式，tests/style-split.test.ts 会盯住它。
 */

import { P06_CSS } from './style-p06'
import { motionCssVars } from './motion-config'
import { BASE_CSS } from './styles/base'
import { FLOW_CSS } from './styles/flow'
import { COMPOSER_CSS } from './styles/composer'
import { LIST_CSS } from './styles/list'
import { LIGHTBOX_CSS } from './styles/lightbox'
import { MISC_CSS } from './styles/misc'

/** 注入的 <style> 元素使用的标记属性。 */
export const CHAT_STYLE_ATTR = 'data-dsh-chat-a2ui'

/** 动效变量块的标记属性：4 个 CSS 时长由 motion.config.json 生成。 */
export const MOTION_VARS_ATTR = 'data-caui-motion-vars'

/**
 * 完整样式表。
 * 作用域：除灯箱外，所有选择器都限定在 .caui-root 之下。
 * 灯箱渲染到 document.body（避免被滚动容器裁剪），因此是顶层选择器。
 */
export const CHAT_CSS = [
  BASE_CSS,
  FLOW_CSS,
  COMPOSER_CSS,
  LIST_CSS,
  LIGHTBOX_CSS,
  MISC_CSS,
].join('\n') + P06_CSS

/** 已经注入过样式的文档（同一实例可能被嵌进多个文档）。 */
const injectedDocs = new WeakSet<Document>()

/**
 * 确保样式表已注入当前文档；重复调用不会重复插入。
 * 在 SSR / 没有 document 的环境里安全地什么都不做。
 */
export function useChatStyles (): void {
  if (typeof document === 'undefined') return
  const doc = document
  if (injectedDocs.has(doc)) return
  const head = doc.head
  if (head === null || head === undefined) return
  if (head.querySelector('style[' + CHAT_STYLE_ATTR + ']') === null) {
    const element = doc.createElement('style')
    element.setAttribute(CHAT_STYLE_ATTR, '')
    element.textContent = CHAT_CSS
    head.appendChild(element)
  }
  // 动效时长单独一块：内容来自 motion.config.json，改配置不需要动样式表本身。
  if (head.querySelector('style[' + MOTION_VARS_ATTR + ']') === null) {
    const vars = doc.createElement('style')
    vars.setAttribute(MOTION_VARS_ATTR, '')
    vars.textContent = motionCssVars()
    head.appendChild(vars)
  }
  injectedDocs.add(doc)
}