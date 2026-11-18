/**
 * 贴底跟随的「预开余量 + 弹簧」模型。
 *
 * 为什么不用「跟随到底」：宿主按批提交正文，一批能有半屏高；跟到底意味着
 * 最后一行总是贴着屏幕下沿出现，然后被下一批顶上去——读的人一直在追边。
 *
 * 这里换一种做法：
 * 1. 用高度的一阶低通估「生成速度」（px/s）；
 * 2. 按速度**预先**在底部留一段余量（headroom = 速度 × lead），所以新内容
 *    落地时离下沿还有一截，不需要把已有的字往上顶；
 * 3. 余量只涨不缩（turn 内保持），最后一句话结束后才慢慢收回去；
 * 4. 位置用弹簧积分推进，有速度、有阻尼，观感是「滑」不是「跳」。
 *
 * 全是纯函数：不读 DOM、不依赖帧率，可以直接单测。
 */

/** 跟随模型的参数（来自 motion.config.json 的 scroll.*）。 */
export interface FollowConfig {
  /** 提前多少秒的生成量作为底部余量。 */
  lead: number
  /** 余量上限（px）。 */
  headroomMax: number
  /** 估速用的时间常数（s）。 */
  speedTau: number
  /** 停止生成后，余量至少保持多久（ms）。 */
  holdMs: number
  /** 余量收回的时间常数（s）。 */
  releaseTau: number
  /** 弹簧刚度 / 阻尼 / 质量。 */
  stiffness: number
  damping: number
  mass: number
}

export interface FollowState {
  /** 当前 scrollTop。 */
  position: number
  /** 当前速度（px/s）。 */
  velocity: number
  /** 当前底部余量（px）。 */
  headroom: number
  /** 高度的一阶低通，用来估速。 */
  heightEma: number
  /** 上一次推进的时刻（ms）。 */
  at: number
  /** 上一次看到高度增长的时刻（ms）。 */
  growthAt: number
  /** 上一次看到的高度（px）。 */
  height: number
}

/** 单帧最多按 64ms 推进：后台标签 rAF 停摆后回来不会一次滑半屏。 */
export const MAX_FRAME_SECONDS = 0.064

/** 建一个静止状态。 */
export function createFollowState (position: number, at: number, height = 0): FollowState {
  return {
    position,
    velocity: 0,
    headroom: 0,
    heightEma: height,
    at,
    growthAt: at,
    height,
  }
}

export interface FollowStepInput {
  height: number
  viewport: number
  at: number
  config: FollowConfig
}

export interface FollowStepResult {
  state: FollowState
  /** 这一帧应该写回的 scrollTop。 */
  scrollTop: number
  /** 这一帧的目标位置（已扣掉余量）。 */
  target: number
  /** 这一帧结束后的底部余量。 */
  headroom: number
  /** 已经收敛：可以停掉 rAF。 */
  idle: boolean
}

/**
 * 推进一帧。
 *
 * 弹簧用半隐式欧拉积分：先算加速度再更新速度与位置，稳定、不会因为
 * 帧率抖动而发散；位置夹在 [0, 内容底部]，弹簧再兴奋也不会滚过内容。
 * @param state - 上一帧状态。
 * @param input - 当前内容高度、视口高度、时刻与参数。
 * @returns 新状态与本帧该写入的 scrollTop。
 */
export function stepFollow (state: FollowState, input: FollowStepInput): FollowStepResult {
  const { height, viewport, at, config } = input
  const dt = Math.min(Math.max((at - state.at) / 1000, 0), MAX_FRAME_SECONDS)
  const bottom = Math.max(0, height - viewport)
  const tau = Math.max(config.speedTau, 0.02)

  // 1) 估速：高度的一阶低通，比逐帧差分稳（批量到达时不会瞬间爆表）
  const baseline = state.height !== 0 ? state.heightEma : height
  const smooth = dt > 0 ? 1 - Math.exp(-dt / tau) : 0
  const heightEma = baseline + (height - baseline) * smooth
  const speed = Math.max(0, (height - heightEma) / tau)

  // 2) 余量：按速度预开；生成期间只涨不缩，停多久之后才开始回收
  const grew = height > state.height + 0.5
  const growthAt = grew ? at : state.growthAt
  const target = Math.min(config.headroomMax, speed * config.lead)
  let headroom = state.headroom
  if (grew || at - growthAt < config.holdMs) {
    headroom = Math.max(headroom, target)
  } else {
    const release = dt > 0 ? 1 - Math.exp(-dt / Math.max(config.releaseTau, 0.05)) : 0
    headroom = headroom + (0 - headroom) * release
  }
  if (headroom < 0.5) headroom = grew || at - growthAt < config.holdMs ? headroom : 0

  // 3) 目标位置：内容底部再往上让出余量
  const goal = Math.max(0, bottom - headroom)

  // 4) 弹簧积分
  const mass = Math.max(config.mass, 0.1)
  const accel = (goal - state.position) * (config.stiffness / mass) - state.velocity * (config.damping / mass)
  const velocity = state.velocity + accel * dt
  const position = Math.min(bottom, Math.max(0, state.position + velocity * dt))

  const settled = Math.abs(goal - position) < 0.5 && Math.abs(velocity) < 24
  const idle = settled && headroom < 0.5
  const nextState: FollowState = {
    position: idle ? goal : position,
    velocity: idle ? 0 : velocity,
    headroom,
    heightEma,
    at,
    growthAt,
    height,
  }
  return { state: nextState, scrollTop: nextState.position, target: goal, headroom, idle }
}
