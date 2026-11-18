/** 动态底部余量 + 限速弹簧：纯函数，不依赖浏览器帧率。 */

import { describe, expect, it } from 'vitest'
import {
  MAX_FRAME_SECONDS,
  createFollowState,
  stepFollow,
  type FollowConfig,
  type FollowState,
  type FollowStepResult,
} from '../src/client/chat-a2ui/scroll-follow'
import { MOTION } from '../src/client/chat-a2ui/motion-config'

const config: FollowConfig = MOTION.scroll

/** 按 16ms 一帧推进，内容高度由 heightAt(frame) 给出。 */
function run (options: {
  frames: number
  viewport: number
  heightAt: (frame: number) => number
  from?: number
  state?: FollowState
}): FollowStepResult {
  const { frames, viewport, heightAt, from = 0 } = options
  let state = options.state ?? createFollowState(from, heightAt(0), 0)
  let result: FollowStepResult = { state, space: 0, scrollTop: 0, pace: 0, idle: false }
  for (let frame = 1; frame <= frames; frame += 1) {
    result = stepFollow(state, { height: heightAt(frame), viewport, at: from + frame * 16, config })
    state = result.state
  }
  return result
}

describe('动态底部余量', () => {
  it('静止时不留余量，停在真正的底部', () => {
    const result = run({ frames: 240, viewport: 500, heightAt: () => 2000 })
    expect(result.space).toBe(0)
    expect(result.scrollTop).toBeCloseTo(1500, 0)
    expect(result.idle).toBe(true)
  })

  it('持续生成时余量能张开到上限，并把大批到达吃掉', () => {
    let at = 0
    let state = createFollowState(0, 2000, 0)
    let last: FollowStepResult = { state, space: 0, scrollTop: 2000 - 500, pace: 0, idle: false }
    for (let frame = 1; frame <= 150; frame += 1) {
      at = frame * 16
      last = stepFollow(state, { height: 2000 + frame * 40, viewport: 500, at, config })
      state = last.state
    }
    // 稳态应该接近「视口比例上限」而不是 0
    expect(last.space).toBeGreaterThan(config.minSpace)
    expect(last.space).toBeGreaterThan(config.maxSpaceRatio * 500 * 0.9)

    // 对照组：一帧涨 40
    const control = stepFollow(state, { height: last.state.height + 40, viewport: 500, at: at + 16, config })
    // 实验组：一帧涨 500（宿主一次提交半屏）
    const burst = stepFollow(state, { height: last.state.height + 500, viewport: 500, at: at + 16, config })
    const controlStep = control.scrollTop - last.scrollTop
    const burstStep = burst.scrollTop - last.scrollTop
    expect(burst.space).toBeLessThan(control.space)
    // 余量先被吃掉，所以画面位移远小于 500
    expect(burstStep).toBeLessThan(500 - last.space + 60)
    expect(burstStep).toBeGreaterThan(controlStep)
  })

  it('余量回涨有速度上限（pace × velocityCap）', () => {
    let state = createFollowState(0, 2000, 0)
    let at = 0
    let last: FollowStepResult = { state, space: 0, scrollTop: 0, pace: 0, idle: false }
    for (let frame = 1; frame <= 120; frame += 1) {
      at = frame * 16
      last = stepFollow(state, { height: 2000 + frame * 40, viewport: 500, at, config })
      state = last.state
    }
    // 制造 120px 的赤字，再回涨 10 帧（160ms）
    const squeezed = { ...state, space: Math.max(0, state.space - 120) }
    const cap = config.paceMax * config.velocityCap
    let before = squeezed.space
    let current = squeezed
    for (let frame = 1; frame <= 10; frame += 1) {
      const result = stepFollow(current, { height: current.height, viewport: 500, at: at + frame * 16, config })
      const perSecond = (result.space - before) / 0.016
      expect(perSecond).toBeLessThanOrEqual(cap + 1)
      before = result.space
      current = result.state
    }
    expect(current.space).toBeGreaterThan(squeezed.space)
  })

  it('scrollTop 恒等于「内容高度 + 余量 - 视口」且不为负', () => {
    let state = createFollowState(0, 800, 0)
    let at = 0
    for (let frame = 1; frame <= 200; frame += 1) {
      at = frame * 16
      const height = 800 + frame * 25
      const result = stepFollow(state, { height, viewport: 500, at, config })
      expect(result.scrollTop).toBeCloseTo(Math.max(0, height + result.space - 500), 6)
      expect(result.scrollTop).toBeGreaterThanOrEqual(0)
      state = result.state
    }
  })

  it('停止生成后余量收回 0（回到真底部）', () => {
    let at = 0
    let state = createFollowState(0, 2000, 0)
    for (let frame = 1; frame <= 120; frame += 1) {
      at = frame * 16
      state = stepFollow(state, { height: 2000 + frame * 40, viewport: 500, at, config }).state
    }
    expect(state.space).toBeGreaterThan(0)
    let last: FollowStepResult = { state, space: state.space, scrollTop: 0, pace: 0, idle: false }
    for (let frame = 1; frame <= 500; frame += 1) {
      last = stepFollow(last.state, { height: 6800, viewport: 500, at: at + frame * 16, config })
    }
    expect(last.space).toBeLessThan(0.5)
    expect(last.scrollTop).toBeCloseTo(6800 - 500, 0)
    expect(last.idle).toBe(true)
  })

  it('一次超长帧只按 64ms 推进', () => {
    const now = 10_000
    const fresh = { ...createFollowState(0, 3000, 0), at: now - MAX_FRAME_SECONDS * 1000, growthAt: now - 100 }
    const stalled = { ...createFollowState(0, 3000, 0), at: now - 5000, growthAt: now - 100 }
    const a = stepFollow(fresh, { height: 3000, viewport: 500, at: now, config })
    const b = stepFollow(stalled, { height: 3000, viewport: 500, at: now, config })
    expect(b.space).toBeCloseTo(a.space, 6)
    expect(b.scrollTop).toBeCloseTo(a.scrollTop, 6)
  })

  it('余量永不超过视口比例上限', () => {
    let state = createFollowState(0, 1000, 0)
    let at = 0
    for (let frame = 1; frame <= 200; frame += 1) {
      at = frame * 16
      const height = 1000 + frame * 90
      const result = stepFollow(state, { height, viewport: 500, at, config })
      expect(result.space).toBeLessThanOrEqual(config.maxSpaceRatio * 500 + 0.001)
      state = result.state
    }
  })
})
