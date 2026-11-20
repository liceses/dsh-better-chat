/**
 * 交互层验收（checkEntries）的规则测试。
 *
 * 这份判定直接决定「在浏览器里跑一遍算不算过」，以前只有控制台里的
 * `__cauiProbe.check()`，没有测试。用例里的阈值一律从 MOTION 取，
 * 免得又长出一份和 motion.config.json 对不上的真源。
 */

import { describe, expect, it } from 'vitest'
import { checkEntries, type ProbeEntry } from '../src/client/chat-a2ui/scroll-probe'
import { FOLLOW_FRAME_KEYS, type FollowFrame } from '../src/client/chat-a2ui/scroll-frame'
import { MOTION } from '../src/client/chat-a2ui/motion-config'

/** 一帧的时长（60fps）：只用来把「单帧位移」换算成速度。 */
const FRAME_MS = 1000 / 60
const MAX_SPEED = MOTION.scroll.maxSpeed

/** 造一帧 tick：默认已经贴底、没有位移。 */
function tick (overrides: Partial<FollowFrame> = {}): ProbeEntry {
  const frame: FollowFrame = {
    top: 1000,
    content: 2000,
    margin: 0,
    target: 1000,
    rate: 0,
    moved: 0,
    dt: FRAME_MS,
    stick: 1,
    ...overrides,
  }
  const entry: ProbeEntry = { t: 0, kind: 'tick' }
  for (const key of FOLLOW_FRAME_KEYS) entry[key] = frame[key]
  return entry
}

/** 一份「什么都对」的日志：默认 12 帧，贴底、没动、余量 0。 */
function healthy (count = 12): ProbeEntry[] {
  return Array.from({ length: count }, () => tick())
}

describe('checkEntries：交互层验收判据', () => {
  it('整份日志都合规时判通过', () => {
    const result = checkEntries(healthy(12))
    expect(result.evidence.enough).toBe(true)
    expect(result.pass).toBe(true)
    expect(result.move.maxVelocity).toBe(0)
  })

  it('证据不足（少于 10 个 tick）不给通过', () => {
    const result = checkEntries(healthy(9))
    expect(result.evidence.ticks).toBe(9)
    expect(result.evidence.enough).toBe(false)
    expect(result.pass).toBe(false)
  })

  it('速度超过 maxSpeed×1.05 判 move 不通过', () => {
    const limit = MAX_SPEED * 1.05
    // 一帧走这么多像素：换算成速度刚好越过上限。
    const tooFast = limit * (FRAME_MS / 1000) + 1
    const result = checkEntries(healthy(11).concat(tick({ moved: tooFast })))
    expect(result.move.limit).toBeCloseTo(limit, 6)
    expect(result.move.ok).toBe(false)
    expect(result.pass).toBe(false)
  })

  it('贴底帧 target 与 top 差 5px 判 settle 不通过', () => {
    const result = checkEntries(healthy(11).concat(tick({ top: 1000, target: 1005 })))
    expect(result.settle.gap).toBe(5)
    expect(result.settle.ok).toBe(false)
    expect(result.pass).toBe(false)
  })

  it('用户在最后 8px 接管 → settle 判「不适用」而不是失败', () => {
    // 真实见过的一幕：滑行到 target 前 8px 时用户滚轮接管。
    // 拿那一帧判落点会冤枉跟随器，所以记 takenOver。
    const entries = healthy(11).concat([
      tick({ top: 992, target: 1000 }),
      { t: 0, kind: 'unstick', by: 'wheel' },
    ])
    const result = checkEntries(entries)
    expect(result.settle.gap).toBeNull()
    expect(result.settle.takenOver).toBe(true)
    expect(result.settle.ok).toBe(true)
  })

  it('unstick 之后还有写入 → quiet 记违规', () => {
    const entries = healthy(12).concat([
      { t: 0, kind: 'unstick', by: 'wheel' },
      tick({ moved: 1 }),
    ])
    const result = checkEntries(entries)
    expect(result.quiet.unstick).toBe(1)
    expect(result.quiet.violated).toBeGreaterThan(0)
    expect(result.quiet.ok).toBe(false)
  })

  it('重新吸附但位置没有越过基准 → restick 记可疑', () => {
    const written = 1000
    const entries = healthy(12).concat([
      { t: 0, kind: 'scroll', top: 900, delta: -100, w: written, ours: 0, stick: 0, h: 2000 },
      { t: 0, kind: 'scroll', top: written, delta: 100, w: written, ours: 0, stick: 1, h: 2000 },
    ])
    const result = checkEntries(entries)
    expect(result.restick.resticks).toBe(1)
    expect(result.restick.suspicious).toBe(1)
    expect(result.restick.ok).toBe(false)
  })
})
