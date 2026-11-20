/**
 * 动效档位写进 DOM 的唯一出口。
 *
 * CSS 侧的选择器形如 `.caui-root:not([data-motion="full"]) .caui-empty-mark` ——
 * 档位属性必须挂在**根元素自身**，所以不能像主题那样在外面再包一层容器，
 * 只能由每个子树的根把属性摊到自己身上。
 *
 * 手写 `data-motion={level}` 的问题是「漏一处，静默失效」：那个子树里的 CSS 动效
 * 会一直按 full 跑，reduced 档只对用户可见的一部分生效，又没有任何报错。
 * 所以字面量只允许出现在本文件里，四个根一律 `<div {...useMotionAttribute()}>`
 * （`tests/motion-system.test.ts` 有门禁守着这条约定）。
 *
 * 子树根清单：ChatA2UIView（.caui-root）、ChatPage（.caui-chat-page）、
 * ChatWorkspace（.caui-chat-page 的工作区）、ChatSessionList（.caui-chat-list）。
 */

import { useMotionLevel, type ChatMotionLevel } from './motion-preference'

/**
 * 挂在根元素上的档位属性。
 * 只有一根键：spread 时不会覆盖其它 DOM 属性。
 */
export interface MotionAttribute {
  /** 当前动效档位：`full`（完整动效）或 `reduced`（只留必要反馈）。 */
  'data-motion': ChatMotionLevel
}

/**
 * 当前档位对应的 DOM 属性，供根元素 spread 使用。
 *
 * 内部订阅 `useMotionLevel()`：用户在侧栏切换档位时，根元素立刻换属性，
 * 对应的 CSS 分支同一帧生效（不等重新挂载）。
 * @returns `{ 'data-motion': level }`；形如 `<div className={cls.root} {...useMotionAttribute()}>`。
 */
export function useMotionAttribute (): MotionAttribute {
  const level = useMotionLevel()
  return { 'data-motion': level }
}
