/**
 * 动效参数的唯一来源：所有消息行、折叠面板、灯箱都从这里取弹簧与时长，
 * 避免每个组件各写一套导致手感不一致。
 */

import type { TargetAndTransition, Transition, Variants } from 'framer-motion'

/** 消息行入场的统一弹簧：420/34/0.8 跟手但不过冲。 */
export const spring = { type: 'spring', stiffness: 420, damping: 34, mass: 0.8 } as const

/** 退场比入场快：列表收缩时不拖泥带水。 */
const exitTransition: Transition = { duration: 0.16, ease: 'easeOut' }

/**
 * 消息行入场变体。
 * 两种用法都成立：
 * - `<motion.div variants={rowEnter} initial="initial" animate="animate">`
 * - `<motion.div initial={rowEnter.initial} animate={rowEnter.animate}>`
 */
export const rowEnter: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: spring },
}

/** 消息行退场目标：配合 `exit={rowExit}` 使用，仅淡出并轻微上移。 */
export const rowExit: TargetAndTransition = { opacity: 0, y: -6, transition: exitTransition }

/**
 * 读取系统「减少动态效果」偏好。
 * SSR、没有 window 或 matchMedia 抛错时一律按「不需要减少」处理，
 * 让调用方不用再写环境判断。
 */
export function reducedMotion (): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}
