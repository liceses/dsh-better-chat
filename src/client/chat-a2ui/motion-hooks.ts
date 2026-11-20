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
 *
 * 刻意**不**提供 useExit / useCollapse / useLoop：它们只是 `useRole(id).x` 的单字段投影，
 * 却让调用方以为有第二条语义路径。单字段用途直接写 `useRole('message.exit').exit`，
 * 读的人一眼看到角色名，也就没有「第二个入口」可言。
 */

import { useMotionLevel } from './motion-preference'
import { expandRole, type ExpandedRole, type MotionLevel } from './motion-roles'
import type { RoleId } from './motion-config'

/**
 * 读一个角色的完整展开（跟随档位）。
 * @param id - 角色名，例如 `message.enter`。
 * @returns 展开后的 initial / animate / exit / transition 与派生量。
 */
export function useRole (id: RoleId): ExpandedRole {
  const level: MotionLevel = useMotionLevel()
  return expandRole(id, level)
}

/**
 * 进场：`<motion.div {...useEnter('message.enter')}>`。
 * @param id - 角色名。
 * @returns 只含进场三件套的切片。
 */
export function useEnter (id: RoleId): Pick<ExpandedRole, 'initial' | 'animate' | 'transition'> {
  const role = useRole(id)
  return { initial: role.initial, animate: role.animate, transition: role.transition }
}

/**
 * 流式文字：模糊半径、单字时长、错峰。
 * @param id - 角色名（目前只有 `text.stream`）。
 * @returns 逐字动画的三个派生量；reduced 档下 blur 与 stagger 均为 0。
 */
export function useStream (id: RoleId): { blur: number; duration: number; stagger: number } {
  const role = useRole(id)
  return { blur: role.blur, duration: role.duration, stagger: role.stagger }
}
