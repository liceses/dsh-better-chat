/**
 * 角色 → 令牌 的展开。
 *
 * 组件只说角色的名字（`message.enter`），这里把它展开成 framer 能吃的
 * `initial / animate / exit / transition`。**纯函数**：不读 DOM、不读全局，
 * 所以能在测试里直接验。
 *
 * 动效档位（reduced）的语义在这里统一实现，见 GLOSSARY.md「动效档位」：
 * - 位移、缩放、模糊归零（前庭刺激）
 * - 不透明度保留，但压缩到 `tokens.dur.reduced`
 * - 循环类（spin / blink）保留：它们是状态指示，不是装饰
 */

import type { MotionConfig, MotionRoles, RoleId, RoleSpec } from './motion-config'
import { MOTION } from './motion-config'

/** 动效档位；与 motion-preference 的两个取值保持一致。 */
export type MotionLevel = 'full' | 'reduced'

/** 展开后的一帧动效：直接可以摊进 motion 组件。 */
export interface ExpandedRole {
  /** 进场起始态。 */
  initial: Record<string, number>
  /** 进场目标态。 */
  animate: Record<string, number>
  /** 退场目标态（没有退场语义的角色为空对象）。 */
  exit: Record<string, number>
  /** framer 过渡。 */
  transition: Record<string, unknown>
  /** 单元素动画时长（s）；CSS 侧同源。 */
  duration: number
  /** 模糊半径（px）；reduced 下为 0。 */
  blur: number
  /** 相邻元素的错峰（s）。 */
  stagger: number
  /** 循环周期（s）；非循环角色为 null。 */
  loop: number | null
}

/** 把 `message.enter` 这类点路径读成 RoleSpec。 */
export function roleSpec (id: RoleId, roles: MotionRoles = MOTION.roles): RoleSpec {
  let cursor: unknown = roles
  for (const key of id.split('.')) {
    if (typeof cursor !== 'object' || cursor === null) return {}
    cursor = (cursor as Record<string, unknown>)[key]
  }
  return (typeof cursor === 'object' && cursor !== null ? cursor : {}) as RoleSpec
}

/**
 * 展开一个角色。
 * @param id - 角色名。
 * @param level - 动效档位；reduced 会走上面的归零语义。
 * @param config - 配置（测试可以传自己的）。
 */
export function expandRole (
  id: RoleId,
  level: MotionLevel = 'full',
  config: MotionConfig = MOTION,
): ExpandedRole {
  const spec = roleSpec(id, config.roles)
  const tokens = config.tokens
  const reduced = level === 'reduced'

  const baseDuration = spec.duration === undefined ? tokens.dur.md : tokens.dur[spec.duration]
  const ease = spec.ease === undefined ? tokens.ease.out : tokens.ease[spec.ease]
  const duration = reduced ? tokens.dur.reduced : baseDuration
  const stagger = reduced ? 0 : (spec.stagger ?? 0)
  const blur = reduced ? 0 : (spec.blur ?? 0)
  const y = reduced ? 0 : (spec.y ?? 0)
  const scale = reduced ? 1 : (spec.scale ?? 1)
  const opacity = spec.opacity ?? 1

  const transition: Record<string, unknown> = spec.spring !== undefined && !reduced
    ? { type: 'spring', ...tokens.springs[spec.spring] }
    : { duration, ease }

  const initial: Record<string, number> = {}
  const animate: Record<string, number> = { opacity: 1 }
  const exit: Record<string, number> = {}

  if (spec.opacity !== undefined) initial.opacity = opacity
  if (spec.y !== undefined && !reduced) initial.y = y
  if (spec.scale !== undefined && !reduced) initial.scale = scale
  if (spec.y !== undefined && !reduced) animate.y = 0
  if (spec.scale !== undefined && !reduced) animate.scale = 1

  if (id === 'message.exit') {
    exit.opacity = spec.opacity ?? 0
    if (!reduced && spec.y !== undefined) exit.y = y
  }
  if (id === 'dialog.open') {
    // 退场复用进场目标的反向：淡出 + 回到起始缩放
    exit.opacity = 0
    if (!reduced && spec.scale !== undefined) exit.scale = scale
  }

  const loop = spec.loop === undefined ? null : tokens.loop[spec.loop]

  return { initial, animate, exit, transition, duration, blur, stagger, loop }
}
