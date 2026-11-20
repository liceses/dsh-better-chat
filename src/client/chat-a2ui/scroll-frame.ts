/**
 * 跟随器每帧的观测形状（探针 tick 的唯一来源）。
 *
 * 以前 tick 是个自由字段袋（`Record<string, unknown>`），谁都能往里塞一个键，
 * 而验收判据（checkEntries）读的是另一套名字。形状定死在这里之后，
 * 调用方少传一个键就编译不过。
 */

/** 一帧跟随观测。 */
export interface FollowFrame {
  /** 这一刻的 scrollTop（px）。 */
  top: number
  /** 内容高度（px）。 */
  content: number
  /** 底部余量（px）。 */
  margin: number
  /** 目标位置（内容底部再往上让出余量）。 */
  target: number
  /** 估出的生成速度（px/s）。 */
  rate: number
  /** 本帧实际写入的位移（px；正数向下）。 */
  moved: number
  /** 距上一帧的毫秒数。 */
  dt: number
  /** 1 = 正在跟随，0 = 已让位。 */
  stick: 0 | 1
}

/** 一帧的键名（tick 记录的字段顺序；测试按它造日志）。 */
export const FOLLOW_FRAME_KEYS: readonly (keyof FollowFrame)[] = [
  'top', 'content', 'margin', 'target', 'rate', 'moved', 'dt', 'stick',
]

/**
 * 把一帧摊平成探针记录：键名只有 FOLLOW_FRAME_KEYS 这一份，
 * 免得接口、探针与验收判据各记一套。
 * @param frame - 跟随器的一帧观测。
 * @returns 可直接交给 probeLog 的键值对。
 */
export function frameRecord (frame: FollowFrame): Record<string, unknown> {
  const record: Record<string, unknown> = {}
  for (const key of FOLLOW_FRAME_KEYS) record[key] = frame[key]
  return record
}
