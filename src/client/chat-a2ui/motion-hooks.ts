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
import { MOTION, clipSeconds, type RoleId } from './motion-config'

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

/** 流式文字的派生量：逐字动画 + 尾巴的行为参数，一次给全。 */
export interface StreamValues {
  /** 逐字模糊半径（px）；reduced 档为 0。 */
  blur: number
  /** 单字时长（秒）。 */
  duration: number
  /** 逐字错峰（秒）；reduced 档为 0。 */
  stagger: number
  /** 尾巴最多渲染多少个字符（超出就不再增长 DOM）。 */
  maxChars: number
  /** 一次到达的新内容不足阈值时，高度补间的最短时长（秒）。 */
  clipMin: number
  /** 新内容字数 → 高度补间时长（秒）。 */
  clipSeconds: (grown: number) => number
}

/**
 * 流式文字：模糊半径、单字时长、错峰，以及尾巴的行为参数。
 *
 * 之所以把 `maxChars` / `clipMin` / `clipSeconds` 也放在这里：它们是**同一段动效的
 * 参数**，组件只该有一个入口。否则 Markdown 就要从 `motion-config` 再开一扇门，
 * 「改一个数，组件不知道」的旧问题会从旁边长回来。
 * @param id - 角色名（目前只有 `text.stream`）。
 * @returns 逐字动画与尾巴动画的全部派生量。
 */
export function useStream (id: RoleId): StreamValues {
  const role = useRole(id)
  return {
    blur: role.blur,
    duration: role.duration,
    stagger: role.stagger,
    maxChars: MOTION.stream.maxChars,
    clipMin: MOTION.stream.clipMin,
    clipSeconds,
  }
}
