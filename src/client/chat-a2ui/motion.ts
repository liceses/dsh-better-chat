/**
 * 动效参数的手写兼容层（存量调用点专用）。
 *
 * 数值不在这里：全部来自 motion.config.json 的 tokens / roles（见 motion-config.ts）。
 * 新代码请用 `motion-hooks.ts` 里的 hook —— 它们跟随 full/reduced 档位重渲染。
 *
 * 这里只保留仍然被真实调用点引用的三样东西：
 * - `spring` / `layoutSpring`：还没 hook 化的弹簧（灯箱放大、左栏行重排、轨迹抽屉宽度）；
 * - `reducedMotion()`：滚动行为（scroll 相关文件）需要的非 hook 判断。
 *
 * 注意：曾经在这里的 `collapseSpring` 与 `rowEnter*`/`rowExit*` 是组件改用 hook 之后
 * 留下的死层，已在 2026-11 的动效收敛里删除；`tests/motion-system.test.ts` 有门禁
 * 保证「导出必有引用」，别再往这里加没人用的常量。
 */

import { getMotionLevel } from './motion-preference'
import { MOTION } from './motion-config'

/** 行入场 / 行重排的统一弹簧（tokens.springs.soft）。 */
export const spring = { type: 'spring', ...MOTION.tokens.springs.soft } as const

/** 容器类尺寸动画的弹簧（轨迹抽屉的宽度）。 */
export const layoutSpring = spring

/**
 * 当前档位是否要求减少动态效果。
 * 统一走 motion-preference：用户显式选择优先于系统偏好。
 * @returns reduced 档为 true。
 */
export function reducedMotion (): boolean {
  return getMotionLevel() === 'reduced'
}
