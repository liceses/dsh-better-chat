/**
 * 动效参数的唯一入口。
 *
 * 数值本身不在这里：全部来自仓库根的 motion.config.json（见 motion-config.ts），
 * 这里只把它们翻成 Framer 认识的形状，并保证导出名稳定——
 * 消息行、折叠体、灯箱、左栏列表都从这一处取手感。
 */

import type { TargetAndTransition, Transition, Variants } from 'framer-motion'
import { getMotionLevel } from './motion-preference'
import { MOTION } from './motion-config'

/** 行入场 / 行重排的统一弹簧（motion.config.json → springs.row）。 */
export const spring = { type: 'spring', ...MOTION.springs.row } as const

/** 容器类尺寸动画的弹簧（轨迹抽屉的宽度）。 */
export const layoutSpring = { type: 'spring', ...MOTION.springs.layout } as const

/** 折叠体（思考 / 工具 / 上下文）展开收起的弹簧。 */
export const collapseSpring = { type: 'spring', ...MOTION.springs.collapse } as const

/** 退场比入场快：列表收缩时不拖泥带水（motion.config.json → row.exit）。 */
const exitTransition: Transition = {
  duration: MOTION.row.exit.duration,
  ease: MOTION.row.exit.ease,
}

/**
 * 消息行入场变体。
 * 两种用法都成立：
 * - `<motion.div variants={rowEnter} initial="initial" animate="animate">`
 * - `<motion.div initial={rowEnter.initial} animate={rowEnter.animate}>`
 */
export const rowEnter: Variants = {
  initial: { opacity: MOTION.row.enter.opacity, y: MOTION.row.enter.y },
  animate: { opacity: 1, y: 0, transition: spring },
}

/** 消息行退场目标：配合 `exit={rowExit}` 使用，仅淡出并轻微上移。 */
export const rowExit: TargetAndTransition = {
  opacity: MOTION.row.exit.opacity,
  y: MOTION.row.exit.y,
  transition: exitTransition,
}

/** 行入场的起始态（内联写法直接用）。 */
export const rowEnterStart = { opacity: MOTION.row.enter.opacity, y: MOTION.row.enter.y } as const

/** 行入场的目标态（内联写法直接用）。 */
export const rowEntered = { opacity: 1, y: 0 } as const

/** 行退场的位移与透明度（内联写法直接用，过渡交给调用方的 transition）。 */
export const rowExitTarget = { opacity: MOTION.row.exit.opacity, y: MOTION.row.exit.y } as const

/**
 * 读取当前动效档位是否要求减少动态效果。
 * 统一走 motion-preference：用户显式选择优先于系统偏好；
 * SSR、没有 window 或存储抛错时按 full 处理。
 */
export function reducedMotion (): boolean {
  return getMotionLevel() === 'reduced'
}
