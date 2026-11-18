/**
 * 跟随核心算法的离线验证。
 *
 * 这里不测「UI 有没有装上」，而是直接按 60fps 跑算法，检查观众能看到的东西：
 * 每帧位移、方向反转、底部余量、以及停下之后有没有真正落到底。
 *
 * 所有断言都来自同一个结论：**位置是独立状态、速度有上限**，
 * 所以一帧最多走 maxSpeed × dt，与宿主一次投喂多少像素无关。
 */

import { describe, expect, it } from 'vitest'
import {
  MAX_FRAME_SECONDS,
  createFollowState,
  stepFollow,
  type FollowConfig,
  type FollowStepResult,
} from '../src/client/chat-a2ui/scroll-follow'
import { MOTION } from '../src/client/chat-a2ui/motion-config'

const VIEWPORT = 505
const FRAME = 1000 / 60
const config: FollowConfig = MOTION.scroll as FollowConfig

interface Metrics {
  maxMove: number
  p95Move: number
  marginMinWhileActive: number
  finalGap: number
  directionFlips: number
  frames: number
}

/**
 * 按固定帧率把算法跑一遍。
 * @param batches - 第 n 次投喂的像素高度（0 表示这一拍没有新内容）。
 * @param intervalMs - 投喂间隔。
 */
function simulate (batches: number[], intervalMs: number): Metrics {
  const initialHeight = 4000
  let state = createFollowState(0, initialHeight, initialHeight - VIEWPORT)
  let height = initialHeight
  let index = 0
  let previous = state.position
  let lastSign = 0
  let flips = 0
  const moves: number[] = []
  const marginsWhileActive: number[] = []
  const totalMs = intervalMs * batches.length + 8000
  let frames = 0

  for (let at = FRAME; at <= totalMs; at += FRAME) {
    while (index < batches.length && at >= index * intervalMs) {
      height += batches[index] as number
      index += 1
    }
    const result: FollowStepResult = stepFollow(state, { height, viewport: VIEWPORT, at, config })
    state = result.state
    frames += 1
    const move = result.position - previous
    previous = result.position
    if (Math.abs(move) >= 0.5) moves.push(Math.abs(move))
    const sign = Math.sign(move)
    if (sign !== 0 && lastSign !== 0 && sign !== lastSign) flips += 1
    if (sign !== 0) lastSign = sign
    // 只看「正在投喂」的区间：投喂结束后余量本来就该收回 0，不该算进来
    const feedingEnds = intervalMs * batches.length
    if (at > 500 && at <= feedingEnds) marginsWhileActive.push(result.margin)
  }

  const sorted = [...moves].sort((a, b) => a - b)
  return {
    maxMove: sorted[sorted.length - 1] ?? 0,
    p95Move: sorted[Math.floor(sorted.length * 0.95)] ?? 0,
    marginMinWhileActive: marginsWhileActive.length === 0 ? 0 : Math.min(...marginsWhileActive),
    finalGap: Math.max(0, height - previous - VIEWPORT),
    directionFlips: flips,
    frames,
  }
}

/** 每帧匀速增长（token 级投喂）。 */
const tokenLevel = Array.from({ length: 400 }, () => 20)

const feedPatterns: Array<{ name: string; batches: number[]; interval: number }> = [
  { name: 'token 级（每帧 20px）', batches: tokenLevel, interval: FRAME },
  { name: '60px / 100ms', batches: Array(80).fill(60), interval: 100 },
  { name: '135px / 500ms', batches: Array(30).fill(135), interval: 500 },
  { name: '250px / 1s', batches: Array(20).fill(250), interval: 1000 },
  { name: '500px / 2s', batches: Array(10).fill(500), interval: 2000 },
  { name: '900px / 3s（整段）', batches: Array(6).fill(900), interval: 3000 },
  { name: '停顿后 400px', batches: [400, 400, 0, 0, 400, 400, 0, 0, 400], interval: 3000 },
]

describe('跟随核心：速度上限、余量、收敛', () => {
  it('任何投喂模式下，单帧位移都不超过 maxSpeed × dt', () => {
    const limit = config.maxSpeed * (FRAME / 1000) + 1
    for (const pattern of feedPatterns) {
      const metrics = simulate(pattern.batches, pattern.interval)
      expect(metrics.maxMove, pattern.name).toBeLessThanOrEqual(limit)
    }
  })

  it('900px 整段到达也只是滑行，不是一帧跳过去', () => {
    const metrics = simulate(Array(6).fill(900), 3000)
    expect(metrics.maxMove).toBeLessThanOrEqual(config.maxSpeed * (FRAME / 1000) + 1)
    expect(metrics.maxMove).toBeLessThan(60)
  })

  it('方向基本单调：不会上下来回抖', () => {
    for (const pattern of feedPatterns) {
      const metrics = simulate(pattern.batches, pattern.interval)
      expect(metrics.directionFlips, pattern.name).toBeLessThanOrEqual(8)
    }
  })

  it('生成期间底部余量保持打开（低于最低余量的比例很少）', () => {
    const metrics = simulate(Array(20).fill(250), 1000)
    expect(metrics.marginMinWhileActive).toBeGreaterThan(config.minMargin * 0.6)
  })

  it('停下来之后落回真正的底部', () => {
    for (const pattern of feedPatterns) {
      const metrics = simulate(pattern.batches, pattern.interval)
      expect(metrics.finalGap, pattern.name).toBeLessThanOrEqual(1)
    }
  })

  it('内容比视口短时位置恒为 0', () => {
    let state = createFollowState(0, 300, 0)
    for (let frame = 1; frame <= 120; frame += 1) {
      const result = stepFollow(state, { height: 300, viewport: VIEWPORT, at: frame * FRAME, config })
      expect(result.position).toBe(0)
      state = result.state
    }
  })

  it('一次超长帧只按 64ms 推进', () => {
    const now = 10_000
    const fresh = { ...createFollowState(0, 3000, 0), at: now - MAX_FRAME_SECONDS * 1000 }
    const stalled = { ...createFollowState(0, 3000, 0), at: now - 5000 }
    const a = stepFollow(fresh, { height: 3000, viewport: VIEWPORT, at: now, config })
    const b = stepFollow(stalled, { height: 3000, viewport: VIEWPORT, at: now, config })
    expect(b.position).toBeCloseTo(a.position, 6)
  })
})
