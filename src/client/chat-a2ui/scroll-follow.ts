/**
 * 贴底跟随的限速参数（来自 motion.config.json 的 scroll.*）。
 *
 * 用「速度」而不是「时长」描述跟随：一次内容到达可能三四十像素，也可能半屏，
 * 固定时长会让前者像瞬移、后者像拖拽；限速则让两者观感一致。
 */
export interface ScrollFollowConfig {
  /** 基础速度（px/s）：距离很小时的起步速度。 */
  speed: number
  /** 距离增益：每多 1px 距离，速度多加这么多 px/s。 */
  gain: number
  /** 速度上限（px/s）。 */
  maxSpeed: number
  /** 距离超过这个值就直接落位（切换会话、恢复滚动位置）。 */
  instantAbove: number
}

/** 单帧最多按 64ms 推进：后台标签 rAF 停摆后回来不会一次滑半屏。 */
export const MAX_FRAME_MS = 64

/**
 * 这一帧该前进多少像素。
 *
 * 纯函数，不读 DOM：每帧只依赖「当前距离 + 距上一帧的毫秒数」，
 * 所以补间途中再来一批新内容只是让 distance 变大，位置不会跳。
 * @param options - 当前距离、帧间隔与限速参数。
 * @returns 需要增加的 scrollTop（0 到 distance 之间，不会越过目标）。
 */
export function stepScroll (options: { distance: number; dtMs: number; config: ScrollFollowConfig }): number {
  const { distance, dtMs, config } = options
  if (!(distance > 0)) return 0
  const seconds = Math.min(Math.max(dtMs, 0), MAX_FRAME_MS) / 1000
  if (seconds <= 0) return 0
  const speed = Math.min(config.maxSpeed, config.speed + distance * config.gain)
  return Math.min(distance, speed * seconds)
}
