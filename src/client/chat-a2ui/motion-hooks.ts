/**
 * 动效原语（hook 形态）：组件只从这里拿动效，不自己写时长/曲线。
 *
 * 注意：项目里另有 motion-primitives/ 目录，那是 vendor 的通用组件；
 * 这里只放跟随档位的 hook，别混用同一个名字。
 *
 * 每个 hook 都会跟随「动效档位」重渲染——用户在侧栏切换 full/reduced 时，
 * 已经挂载的组件要立刻换一套语义，而不是等下次重新挂载。
 *
 * 约束：这里的 hook 只返回 `initial/animate/exit/transition` 与派生量，
 * 不返回业务属性（那是组件的职责）。
 */

import { useMotionLevel } from './motion-preference'
import { expandRole, type ExpandedRole, type MotionLevel } from './motion-roles'
import type { RoleId } from './motion-config'

/** 读一个角色的完整展开（跟随档位）。 */
export function useRole (id: RoleId): ExpandedRole {
  const level: MotionLevel = useMotionLevel()
  return expandRole(id, level)
}

/** 进场：`<motion.div {...useEnter('message.enter')}>`。 */
export function useEnter (id: RoleId): Pick<ExpandedRole, 'initial' | 'animate' | 'transition'> {
  const role = useRole(id)
  return { initial: role.initial, animate: role.animate, transition: role.transition }
}

/** 退场目标：配上 `<AnimatePresence>` 使用。 */
export function useExit (id: RoleId): Record<string, number> {
  return useRole(id).exit
}

/** 折叠 / 尺寸类动画的过渡。 */
export function useCollapse (id: RoleId): Record<string, unknown> {
  return useRole(id).transition
}

/** 流式文字：模糊半径、单字时长、错峰。 */
export function useStream (id: RoleId): { blur: number; duration: number; stagger: number } {
  const role = useRole(id)
  return { blur: role.blur, duration: role.duration, stagger: role.stagger }
}

/** 循环类动画的周期（秒）；非循环角色返回 null。 */
export function useLoop (id: RoleId): number | null {
  return useRole(id).loop
}