/**
 * 流式跟随：动态底部余量（spacer）+ 前馈限速。
 *
 * 问题：宿主按批提交正文，一批能有半屏高。跟着内容贴底的话，最后一行总在
 * 屏幕下沿出现、再被下一批顶上去——读的人一直在追边。
 *
 * 做法：消息流末尾放一个**可变高度的占位**（`space`）=「最后一行到视口下沿
 * 的距离」，滚动位置钉在「内容 + 占位」的底部：
 * - 内容增长 → 占位先被吃掉，画面不动（不会被顶上来）；
 * - 占位按**前馈 + 反馈**回涨：前馈是平滑后的生成速度，反馈把余量拉回目标；
 * - 目标余量同时看「生成速度」和「最近单批的高度」——后者决定一次能吸收多少；
 * - 速度变化率有限制（`accel`），起步收尾有惯性。
 *
 * 纯函数：不读 DOM、不依赖帧率。
 */

/** 跟随参数（来自 motion.config.json 的 scroll.*）。 */
export interface FollowConfig {
  /** 生成期间的最低底部余量（px）。 */
  minSpace: number
  /** 余量上限（占视口高度的比例，0–1）。 */
  maxSpaceRatio: number
  /** 余量 = 速度 × lead（s）。 */
  lead: number
  /** 按「最近单批高度」预留的比例。 */
  burstFactor: number
  /** 单批高度的记忆衰减（px/s）。 */
  burstDecay: number
  /** 前馈速度的上下限（px/s）。 */
  paceMin: number
  paceMax: number
  /** 速度上限 = pace × velocityCap。 */
  velocityCap: number
  /** 反馈增益（1/s）。 */
  gain: number
  /** 速度变化率上限（px/s²）。 */
  accel: number
  /** 估速的长时间常数（s）。 */
  speedTau: number
  /** 停止增长后多久把余量收回（ms）。 */
  holdMs: number
  instantAbove: number
}

export interface FollowState {
  /** 当前底部余量（px）。 */
  space: number
  /** 余量变化速度（px/s，正 = 让出空间 = 画面上移）。 */
  velocity: number
  /** 生成速度的平滑值（px/s）。 */
  rate: number
  /** 上一次看到的内容高度（不含占位）。 */
  height: number
  /** 最近一次单批增长的高度（px），缓慢衰减。 */
  burstMax: number
  /** 上一次推进的时刻（ms）。 */
  at: number
  /** 上一次看到增长的时刻（ms）。 */
  growthAt: number
}

/** 单帧最多按 64ms 推进：后台标签 rAF 停摆后回来不会一次滑半屏。 */
export const MAX_FRAME_SECONDS = 0.064

/** 小于这个高度变化不算「增长」：scrollHeight 取整会带来 ±1px 的假增长。 */
export const GROWTH_EPSILON = 1.5

/** 建一个静止状态。 */
export function createFollowState (at: number, height = 0, space = 0): FollowState {
  return { space, velocity: 0, rate: 0, height, burstMax: 0, at, growthAt: at }
}

export interface FollowStepInput {
  /** 内容高度（**不含**尾部占位）。 */
  height: number
  viewport: number
  at: number
  config: FollowConfig
}

export interface FollowStepResult {
  state: FollowState
  /** 这一帧该写进尾部占位的高度（px）。 */
  space: number
  /** 这一帧该写回的 scrollTop（已经包含占位）。 */
  scrollTop: number
  /** 平滑后的生成速度（px/s），调试用。 */
  pace: number
  /** 已经收敛：可以停掉 rAF。 */
  idle: boolean
}

function clamp (value: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, value))
}

/**
 * 推进一帧。
 * @param state - 上一帧状态。
 * @param input - 内容高度、视口高度、时刻与参数。
 * @returns 新状态、该写入的占位高度与 scrollTop。
 */
export function stepFollow (state: FollowState, input: FollowStepInput): FollowStepResult {
  const { height, viewport, at, config } = input
  const dt = clamp((at - state.at) / 1000, 0, MAX_FRAME_SECONDS)
  const tau = Math.max(config.speedTau, 0.05)
  const maxSpace = Math.max(0, config.maxSpaceRatio * viewport)

  // 1) 估速（短窗口，跟得上批次）+ 最近单批高度（决定一次能吸收多少）
  //
  // scrollHeight 是取整的，占位又是小数像素，直接相减会一直抖出 ±1px 的假增长；
  // 不设这个死区的话「成长中」永远不会过期，余量就永远收不回去。
  const raw = height - state.height
  const delta = raw >= GROWTH_EPSILON ? raw : 0
  const instant = dt > 0 ? delta / dt : 0
  const smooth = dt > 0 ? 1 - Math.exp(-dt / tau) : 0
  const rate = Math.max(0, state.rate + (instant - state.rate) * smooth)
  const burstMax = Math.max(delta, state.burstMax - config.burstDecay * dt)
  const grew = delta > 0.5
  const growthAt = grew ? at : state.growthAt
  const active = grew || at - growthAt < config.holdMs

  // 2) 目标余量：速度与单批高度取大者
  const pace = clamp(rate, config.paceMin, config.paceMax)
  const desired = active
    ? clamp(Math.max(config.minSpace, burstMax * config.burstFactor, pace * config.lead), 0, maxSpace)
    : 0

  // 3) 前馈（跟上内容）+ 反馈（把余量拉回目标）；速度变化率受限
  const cap = Math.max(config.paceMin, pace) * config.velocityCap
  const target = clamp(rate + (desired - state.space) * config.gain, -cap, cap)
  const velocity = clamp(
    state.velocity + clamp(target - state.velocity, -config.accel * dt, config.accel * dt),
    -cap,
    cap,
  )

  // 4) 占位演化：内容增长吃掉它，速度补回它；夹在 [0, 上限]
  let space = clamp(state.space + velocity * dt - delta, 0, maxSpace)
  if (space < 0.5 && desired < 0.5) space = 0

  const scrollTop = Math.max(0, height + space - viewport)
  const idle = Math.abs(desired - space) < 0.6 && Math.abs(velocity) < 24 && space < 0.5

  const nextState: FollowState = {
    space,
    velocity: idle ? 0 : velocity,
    rate: idle ? 0 : rate,
    height: delta > 0 ? height : state.height,
    burstMax,
    at,
    growthAt,
  }
  return { state: nextState, space, scrollTop, pace, idle }
}
