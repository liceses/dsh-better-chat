/**
 * 动效参数的唯一入口（对外保持稳定导出名）。
 *
 * 数值不在这里：全部来自 motion.config.json 的 tokens / roles（见 motion-config.ts）。
 * 这个文件只做一件事——把角色展开成 Framer 认识的形状。
 *
 * 新代码请优先用 `motion-primitives` 里的 hook（它们跟随 full/reduced 档位）；
 * 这里的常量是 B2 迁移期间给存量组件用的兼容层。
 */

import type { TargetAndTransition, Transition, Variants } from 'framer-motion'
import { getMotionLevel } from './motion-preference'
import { MOTION } from './motion-config'
import { expandRole } from './motion-roles'

const enterRole = expandRole('message.enter', 'full')
const exitRole = expandRole('message.exit', 'full')

/** 行入场 / 行重排的统一弹簧（tokens.springs.soft）。 */
export const spring = { type: 'spring', ...MOTION.tokens.springs.soft } as const

/** 容器类尺寸动画的弹簧（轨迹抽屉的宽度）。 */
export const layoutSpring = spring

/** 折叠体（思考 / 工具 / 上下文）展开收起的弹簧。 */
export const collapseSpring = spring

/** 行入场变体。 */
export const rowEnter: Variants = {
  initial: { opacity: enterRole.initial.opacity ?? 0, y: enterRole.initial.y ?? 0 },
  animate: { opacity: 1, y: 0, transition: spring },
}

/** 行退场目标：配合 `exit={rowExit}` 使用。 */
export const rowExit: TargetAndTransition = {
  opacity: exitRole.exit.opacity ?? 0,
  y: exitRole.exit.y ?? 0,
  transition: exitRole.transition as Transition,
}

/** 行入场的起始态（内联写法直接用）。 */
export const rowEnterStart = { opacity: enterRole.initial.opacity ?? 0, y: enterRole.initial.y ?? 0 } as const

/** 行入场的目标态（内联写法直接用）。 */
export const rowEntered = { opacity: 1, y: 0 } as const

/** 行退场的位移与透明度（内联写法直接用）。 */
export const rowExitTarget = { opacity: exitRole.exit.opacity ?? 0, y: exitRole.exit.y ?? 0 } as const

/**
 * 当前档位是否要求减少动态效果。
 * 统一走 motion-preference：用户显式选择优先于系统偏好。
 */
export function reducedMotion (): boolean {
  return getMotionLevel() === 'reduced'
}
