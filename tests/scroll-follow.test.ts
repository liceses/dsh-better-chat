/** 预开余量 + 弹簧跟随：纯函数，不依赖浏览器帧率。 */

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

/** 按 16ms 一帧推进 frames 帧，内容高度由 heights(i) 给出。 */
function advance (options: {
  frames: number
  viewport: number
  start?: number
  from?: number
  heightAt: (frame: number) => number
  seedHeight?: number
}): FollowStepResult {
  const { frames, viewport, start = 0, from = 0, heightAt, seedHeight } = options
  let state: FollowState = createFollowState(start, 0, seedHeight ?? heightAt(0))
  let result: FollowStepResult = { state, scrollTop: state.position, target: 0, headroom: 0, idle: false }
  for (let frame = 1; frame <= frames; frame += 1) {
    result = stepFollow(result.state, {
      height: heightAt(frame),
      viewport,
      at: from + frame * 16,
      config,
    })
  }
  return result
}

describe('预开余量的弹簧跟随', () => {
  it('静止时不留余量，弹簧落到真正的底部', () => {
    const result = advance({ frames: 120, viewport: 500, heightAt: () => 2000 })
    expect(result.headroom).toBe(0)
    expect(result.scrollTop).toBeCloseTo(1500, 0)
    expect(result.idle).toBe(true)
  })

  it('内容增长时先预开余量，目标位置在内容底部之上', () => {
    const result = advance({
      frames: 90,
      viewport: 500,
      heightAt: (frame) => 2000 + Math.min(frame, 30) * 20,
    })
    const bottom = 2000 + 30 * 20 - 500
    expect(result.headroom).toBeGreaterThan(10)
    expect(result.headroom).toBeLessThanOrEqual(config.headroomMax)
    expect(result.target).toBeCloseTo(bottom - result.headroom, 3)
    expect(result.scrollTop).toBeLessThanOrEqual(bottom)
  })

  it('生成期间余量只涨不缩（不会上下抖）', () => {
    let result = advance({ frames: 40, viewport: 500, heightAt: (f) => 2000 + f * 30 })
    const peak = result.headroom
    expect(peak).toBeGreaterThan(0)
    // 之后 40 帧（640ms < holdMs）不再增长，余量不该往回退
    for (let frame = 1; frame <= 40; frame += 1) {
      result = stepFollow(result.state, {
        height: 2000 + 1200,
        viewport: 500,
        at: 40 * 16 + frame * 16,
        config,
      })
    }
    expect(result.headroom).toBeGreaterThanOrEqual(peak - 0.01)
  })

  it('静止超过 holdMs 后余量收回 0，并停在真正的底部', () => {
    let result = advance({ frames: 40, viewport: 500, heightAt: (f) => 2000 + f * 30 })
    expect(result.headroom).toBeGreaterThan(0)
    for (let frame = 1; frame <= 500; frame += 1) {
      result = stepFollow(result.state, {
        height: 3200,
        viewport: 500,
        at: 40 * 16 + frame * 16,
        config,
      })
    }
    expect(result.headroom).toBeLessThan(0.5)
    expect(result.scrollTop).toBeCloseTo(2700, 0)
    expect(result.idle).toBe(true)
  })

  it('位置永远不越过内容底部', () => {
    let result = advance({ frames: 60, viewport: 500, heightAt: (f) => 1500 + f * 80 })
    let state = result.state
    let at = 60 * 16
    for (let frame = 0; frame < 120; frame += 1) {
      at += 16
      const height = 6200 + frame * 40
      result = stepFollow(state, { height, viewport: 500, at, config })
      state = result.state
      expect(result.scrollTop).toBeLessThanOrEqual(Math.max(0, height - 500) + 0.001)
      expect(result.scrollTop).toBeGreaterThanOrEqual(0)
    }
  })

  it('一次超长帧只按 64ms 推进（后台标签回来不会一次滑半屏）', () => {
    const base = createFollowState(0, 0, 3000)
    const short = stepFollow(base, { height: 3000, viewport: 500, at: MAX_FRAME_SECONDS * 1000, config })
    const stalled = stepFollow(base, { height: 3000, viewport: 500, at: 5000, config })
    expect(stalled.scrollTop).toBeCloseTo(short.scrollTop, 6)
  })

  it('单帧高度暴涨时余量不会超过上限', () => {
    let result = advance({ frames: 30, viewport: 500, heightAt: () => 2000 })
    result = stepFollow(result.state, { height: 9000, viewport: 500, at: 30 * 16 + 16, config })
    expect(result.headroom).toBeLessThanOrEqual(config.headroomMax + 0.001)
  })
})
