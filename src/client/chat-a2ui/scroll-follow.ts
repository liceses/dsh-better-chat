/**
 * 贴底跟随的核心算法：限速跟随 + 速度相关的底部余量。
 *
 * 设计约束（为什么长这样）：
 *
 * 1. **位置必须是独立状态**，不能写成 `scrollTop = 内容高度 - 视口`。
 *    后者把位置和内容绑死：内容一帧长 500px，位置就只能一帧跳 500px，
 *    任何「平滑」都无从谈起。这里位置自己走，速度有上限。
 *
 * 2. **每帧位移的上限 = maxSpeed × dt**，与内容一次来多少无关。
 *    900px 的整段到达也只是一段约 0.35s 的滑行，而不是一帧跳过去。
 *
 * 3. **余量（margin）让目标位置停在内容底部之上**，所以最后一行不会顶着
 *    视口下沿出现；余量按生成速度预开（速度 × lead），停下后收回。
 *
 * 4. 内容比视口短、或用户往上滚时，位置被夹在 [0, 内容底部]。
 *
 * 纯函数：不读 DOM、不依赖帧率，可直接离线仿真。
 */

/** 跟随参数（来自 motion.config.json 的 scroll.*）。 */
export interface FollowConfig {
  /** 生成期间的最低底部余量（px）。 */
  minMargin: number
  /** 余量上限（占视口高度的比例，0–1）。 */
  maxMarginRatio: number
  /** 余量 = 速度 × lead（s）。 */
  lead: number
  /** 起步速度（px/s）与距离增益（1/s）。 */
  speed: number
  gain: number
  /** 速度上限（px/s）。 */
  maxSpeed: number
  /** 估速的长时间常数（s）。 */
  speedTau: number
  /** 停止增长后余量保持多久（ms）。 */
  holdMs: number
  /** 余量收回的时间常数（s）。 */
  releaseTau: number
}

export interface FollowState {
  /** 当前 scrollTop。 */
  position: number
  /** 当前底部余量（px）。 */
  margin: number
  /** 生成速度的平滑值（px/s）。 */
  rate: number
  /** 生成速度的峰值保持（慢衰减），余量按它来算，避免批次抖动带着余量抖。 */
  ratePeak: number
  /** 上一次看到的内容高度（不含任何占位）。 */
  height: number
  /** 上一次推进的时刻（ms）。 */
  at: number
  /** 上一次看到增长的时刻（ms）。 */
  growthAt: number
}

/** 单帧最多按 64ms 推进：后台标签 rAF 停摆后回来不会一次滑半屏。 */
export const MAX_FRAME_SECONDS = 0.064

/** 小于这个高度变化不算「增长」：scrollHeight 取整会带来 ±1px 的假增长。 */
export const GROWTH_EPSILON = 1.5

/** 余量自身的最大变化速度（px/s）：它直接推动目标位置，不能突变。 */
export const MARGIN_MAX_SPEED = 600

/** 建一个静止状态。 */
export function createFollowState (at: number, height = 0, position = 0): FollowState {
  return {
    position,
    margin: 0,
    rate: 0,
    ratePeak: 0,
    height,
    at,
    growthAt: Number.NEGATIVE_INFINITY,
  }
}

export interface FollowStepInput {
  /** 内容高度（不含任何占位）。 */
  height: number
  viewport: number
  at: number
  config: FollowConfig
}

export interface FollowStepResult {
  state: FollowState
  /** 这一帧该写回的 scrollTop。 */
  position: number
  /** 目标位置（内容底部再往上让出余量）。 */
  target: number
  /** 当前底部余量。 */
  margin: number
  /** 估算出的生成速度（px/s），调试用。 */
  rate: number
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
 * @returns 新状态与本帧该写入的 scrollTop。
 */
export function stepFollow (state: FollowState, input: FollowStepInput): FollowStepResult {
  const { height, viewport, at, config } = input
  const dt = clamp((at - state.at) / 1000, 0, MAX_FRAME_SECONDS)
  const tau = Math.max(config.speedTau, 0.05)

  // 1) 估速：短窗口低通，用来决定余量和速度上限
  const raw = height - state.height
  const delta = raw >= GROWTH_EPSILON ? raw : 0
  const instant = dt > 0 ? delta / dt : 0
  const smooth = dt > 0 ? 1 - Math.exp(-dt / tau) : 0
  const rate = Math.max(0, state.rate + (instant - state.rate) * smooth)

  const grew = delta > 0
  const growthAt = grew ? at : state.growthAt
  const active = grew || at - growthAt < config.holdMs

  // 2) 余量：按「峰值速度」预开（慢衰减），并且限定它自己的变化速率——
  //    余量一变目标位置就跟着变，余量抖就等于画面上下来回抖。
  const maxMargin = Math.max(0, config.maxMarginRatio * viewport)
  const ratePeak = Math.max(rate, state.ratePeak * Math.exp(-dt / 2))
  const marginTarget = active ? clamp(Math.max(config.minMargin, ratePeak * config.lead), 0, maxMargin) : 0
  const marginSlew = clamp(marginTarget - state.margin, -MARGIN_MAX_SPEED * dt, MARGIN_MAX_SPEED * dt)
  const margin = clamp(state.margin + marginSlew, 0, maxMargin)

  // 3) 目标与限速跟随
  const bottom = Math.max(0, height - viewport)
  const target = Math.max(0, bottom - margin)
  const distance = target - state.position
  const speed = Math.min(config.maxSpeed, config.speed + Math.abs(distance) * config.gain)
  const step = clamp(distance, -speed * dt, speed * dt)
  const position = clamp(state.position + step, 0, bottom)

  const idle = Math.abs(target - position) < 0.5 && margin < 0.5
  const nextState: FollowState = {
    position: idle ? target : position,
    margin,
    rate: idle ? 0 : rate,
    ratePeak: idle ? 0 : ratePeak,
    height,
    at,
    growthAt,
  }
  return { state: nextState, position: nextState.position, target, margin, rate, idle }
}
