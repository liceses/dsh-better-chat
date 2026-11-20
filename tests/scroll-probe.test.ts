/**
 * 交互层验收（checkEntries）的规则测试。
 *
 * 这份判定直接决定「在浏览器里跑一遍算不算过」。它与 README 的 A/B/C 表格
 * 逐条对应：阈值只从 LIMITS / MOTION 取，判据缺测量时必须报 unverified，
 * 而不是给绿。
 */

import { describe, expect, it } from 'vitest'
import { checkEntries, type ProbeEntry } from '../src/client/chat-a2ui/scroll-probe'
import { FOLLOW_FRAME_KEYS, type FollowFrame } from '../src/client/chat-a2ui/scroll-frame'
import { MOTION } from '../src/client/chat-a2ui/motion-config'

/** 造一帧 tick：默认贴底、没有位移、余量充足。 */
function tick (t: number, overrides: Partial<FollowFrame> = {}): ProbeEntry {
  const frame: FollowFrame = {
    top: 1000,
    content: 2000,
    margin: 200,
    target: 1000,
    rate: 0,
    moved: 0,
    dt: 1000 / 60,
    stick: 1,
    ...overrides,
  }
  const entry: ProbeEntry = { t, kind: 'tick' }
  for (const key of FOLLOW_FRAME_KEYS) entry[key] = frame[key]
  return entry
}

/** 造一条 scroll 记录。 */
function scrollEntry (t: number, top: number, written: number, stick: 0 | 1): ProbeEntry {
  return { t, kind: 'scroll', top, w: written, delta: 0, ours: stick === 1 ? 1 : 0, stick, h: 2000 }
}

/** 造一条用户上滚记录。 */
const unstick = (t: number): ProbeEntry => ({ t, kind: 'unstick', by: 'wheel', delta: -240 })
/** 造一条会话切换标记。 */
const session = (t: number): ProbeEntry => ({ t, kind: 'session', id: 's1' })
/** 造一条 JS 错误。 */
const error = (t: number): ProbeEntry => ({ t, kind: 'error', message: 'boom' })

/**
 * 一份「什么都测到、什么都对」的日志：落位 → 用户上滚 → 让位 → 滚回底部 →
 * 重新吸附 → 落定。B1/B2/B3/B4 与 A3 都能判。
 */
function healthy (): ProbeEntry[] {
  const out: ProbeEntry[] = [session(0), scrollEntry(10, 1000, 1000, 1)]
  for (let i = 0; i < 10; i += 1) out.push(tick(20 + i * 10))
  out.push(unstick(200), scrollEntry(210, 800, 1000, 0))
  for (let i = 0; i < 39; i += 1) out.push(tick(220 + i * 10, { stick: 0, top: 800 }))
  out.push(scrollEntry(700, 801, 1000, 0), scrollEntry(710, 1005, 1000, 1))
  // 重新吸附之后跟随器把位置收回到 target（1000），落点判据才有东西可测。
  for (let i = 0; i < 10; i += 1) out.push(tick(720 + i * 10))
  return out
}

describe('checkEntries：交互层验收判据', () => {
  it('全部测到且都合规时判通过', () => {
    const result = checkEntries(healthy())
    expect(result.unverified).toEqual([])
    expect(result.complete).toBe(true)
    expect(result.pass).toBe(true)
    expect(result.move.limit).toBe(MOTION.scroll.maxSpeed)
    expect(result.settle.gap).toBe(0)
  })

  it('证据不足（少于 10 个 tick）不给通过', () => {
    const entries = healthy().filter(entry => entry.kind !== 'tick').concat(tick(10), tick(20))
    const result = checkEntries(entries)
    expect(result.evidence.enough).toBe(false)
    expect(result.pass).toBe(false)
  })

  it('没测到的判据记进 unverified，且不算通过', () => {
    // 没有任何用户上滚、也没有会话标记：B1/B2/B4 无从判断。
    const entries = Array.from({ length: 12 }, (_, i) => tick(10 + i * 10))
    const result = checkEntries(entries)
    expect(result.unverified).toEqual(expect.arrayContaining(['B1', 'B2', 'B4']))
    expect(result.complete).toBe(false)
    expect(result.pass).toBe(false)
  })

  it('用户中途接管时，落点记为「没测到」而不是通过', () => {
    const result = checkEntries(healthy().slice(0, 12).concat([unstick(500)]))
    expect(result.settle.measured).toBe(false)
    expect(result.settle.ok).toBe(false)
    expect(result.pass).toBe(false)
  })

  it('速度超过 maxSpeed（不再有 1.05 余量）判 move 不通过', () => {
    const tooFast = MOTION.scroll.maxSpeed / 1000 * 20 * 1.2
    const entries = healthy()
    entries.push(tick(900, { moved: tooFast, dt: 20 }))
    const result = checkEntries(entries)
    expect(result.move.maxVelocity).toBeGreaterThan(result.move.limit)
    expect(result.move.ok).toBe(false)
    expect(result.pass).toBe(false)
  })

  it('落点 2px 判不通过（README 的 A3 是 ≤ 1px）', () => {
    const entries = healthy()
    const last = entries[entries.length - 1]
    if (last !== undefined) last.top = 998
    const result = checkEntries(entries)
    expect(result.settle.gap).toBe(2)
    expect(result.settle.ok).toBe(false)
  })

  it('生成期余量低于 120 判 margin 不通过（C2）', () => {
    const entries = healthy().map(entry => (entry.kind === 'tick' ? { ...entry, margin: 100 } : entry))
    const result = checkEntries(entries)
    expect(result.margin.min).toBe(100)
    expect(result.margin.c2).toBe(120)
    expect(result.margin.ok).toBe(false)
  })

  it('B1 用 500ms 时间窗，不再用「之后 40 条」', () => {
    // 300ms 内写一次 → 违规
    const near = healthy()
    near.push(tick(300, { moved: 3, stick: 0, top: 803 }))
    const bad = checkEntries(near)
    expect(bad.quiet.windowMs).toBe(500)
    expect(bad.quiet.violations).toBe(1)
    expect(bad.quiet.ok).toBe(false)

    // 800ms 之后写一次 → 不在窗口内，不算违规
    const far = healthy()
    far.push(tick(900, { moved: 3, stick: 0 }))
    expect(checkEntries(far).quiet.violations).toBe(0)
  })

  it('B2 上滚后 1s 内累计漂移超过 2px 判不通过', () => {
    const entries = healthy()
    entries.push(tick(400, { moved: 2, stick: 0, top: 802 }), tick(420, { moved: 2, stick: 0, top: 804 }))
    const result = checkEntries(entries)
    expect(result.drift.max).toBeGreaterThan(2)
    expect(result.drift.ok).toBe(false)
  })

  it('B3 重新吸附没有越过写入位置 2px 时记可疑', () => {
    const entries = healthy().map(entry => (entry.kind === 'scroll' && entry.t === 710 ? { ...entry, top: 1001 } : entry))
    const result = checkEntries(entries)
    expect(result.restick.resticks).toBe(1)
    expect(result.restick.suspicious).toBe(1)
    expect(result.restick.ok).toBe(false)
  })

  it('B4 落位之后还在动判不通过；帧数不够记没测到', () => {
    const moving = healthy().map(entry => (entry.kind === 'tick' && entry.t === 30 ? { ...entry, moved: 3 } : entry))
    const movedResult = checkEntries(moving)
    expect(movedResult.switchLanding.measured).toBe(true)
    expect(movedResult.switchLanding.ok).toBe(false)

    const short = [session(0), scrollEntry(10, 1000, 1000, 1), tick(20), tick(30)]
    const shortResult = checkEntries(short)
    expect(shortResult.switchLanding.measured).toBe(false)
    expect(shortResult.unverified).toContain('B4')
  })

  it('B5 运行期错误必须真的被记到，而不是写死 0', () => {
    const entries = healthy().concat([error(999)])
    const result = checkEntries(entries)
    expect(result.errors.count).toBe(1)
    expect(result.errors.ok).toBe(false)
    expect(result.pass).toBe(false)
  })
})
