/** 跟随状态机的行为契约：五个入口都只问它，这里逐条钉住。 */

import { describe, expect, it } from 'vitest'
import { createFollowController, STICK_THRESHOLD, type FollowTarget } from '../src/client/chat-a2ui/follow-controller'
import { createOwnership } from '../src/client/chat-a2ui/scroll-ownership'
import { MOTION } from '../src/client/chat-a2ui/motion-config'

/** 一个可写的假滚动容器：记录每次写入，便于断言「有没有写」「写了多少」。 */
function fakeTarget (init: { top?: number; content?: number; viewport?: number } = {}): {
  target: FollowTarget
  writes: number[]
  state: { top: number; content: number; viewport: number }
  smooth: { calls: number; works: boolean }
} {
  const state = { top: init.top ?? 0, content: init.content ?? 2000, viewport: init.viewport ?? 500 }
  const writes: number[] = []
  const smooth = { calls: 0, works: false }
  const target: FollowTarget = {
    readTop: () => state.top,
    readContent: () => state.content,
    readViewport: () => state.viewport,
    writeTop: (top: number) => { state.top = top; writes.push(top) },
    smoothTo: (top: number): boolean => {
      smooth.calls += 1
      if (!smooth.works) return false
      state.top = top
      return true
    },
  }
  return { target, writes, state, smooth }
}

/** 建一个用假时钟的控制器。 */
function makeController (init?: { top?: number; content?: number; viewport?: number }) {
  const harness = fakeTarget(init)
  let clock = 0
  const sticks: boolean[] = []
  const unsticks: string[] = []
  const controller = createFollowController(harness.target, {
    ownership: createOwnership({ tolerance: MOTION.scroll.ownershipTolerance }),
    now: () => clock,
    onStickChange: (stick) => { sticks.push(stick) },
    onUnstick: (info) => { unsticks.push(info.by) },
  })
  return {
    controller,
    ...harness,
    sticks,
    unsticks,
    advance: (ms: number) => { clock += ms; return clock },
    get clock () { return clock },
  }
}

describe('follow-controller：状态机', () => {
  it('jump(auto) 直接落到底，并登记基准', () => {
    const h = makeController({ top: 0, content: 2000, viewport: 500 })
    h.controller.jump('auto')
    expect(h.state.top).toBe(2000)
    // 基准登记之后，同样的位置不会被判成「别人动的」。
    expect(h.controller.sticking).toBe(true)
  })

  it('jump(smooth) 在不支持平滑滚动的环境里退回直接赋值，且不丢基准', () => {
    const h = makeController({ top: 0, content: 2000, viewport: 500 })
    h.smooth.works = false
    h.controller.jump('smooth')
    expect(h.smooth.calls).toBe(1)
    expect(h.state.top).toBe(2000)
  })

  it('jump(smooth) 生效时进入抑制窗：窗口内的位移不算用户上滚', () => {
    const h = makeController({ top: 0, content: 2000, viewport: 500 })
    h.smooth.works = true
    h.controller.jump('smooth')
    expect(h.sticks).toEqual([])
    expect(h.controller.sticking).toBe(true)
  })

  it('用户上滚（超过容差）→ 让位，并报 unstick(scroll)', () => {
    // 内容 4000 / 视口 500 ⇒ 最大 scrollTop 3500；从 3200 上滚到 2800。
    const h = makeController({ top: 3200, content: 4000, viewport: 500 })
    h.controller.attach()
    h.advance(100)
    h.state.top = 2800
    h.controller.onScroll()
    expect(h.controller.sticking).toBe(false)
    expect(h.unsticks).toContain('scroll')
    expect(h.sticks.at(-1)).toBe(false)
  })

  it('让位之后 step() 不写位置，只报一条 idle 帧', () => {
    const h = makeController({ top: 3200, content: 4000, viewport: 500 })
    h.controller.attach()
    h.advance(100)
    h.state.top = 2800
    h.controller.onScroll()
    const before = h.writes.length
    h.advance(16)
    const more = h.controller.step()
    expect(more).toBe(false)
    expect(h.writes.length).toBe(before)
  })

  it('用户滚回底部（往下越过基准）→ 重新吸附', () => {
    const h = makeController({ top: 3200, content: 4000, viewport: 500 })
    h.controller.attach()
    h.advance(100)
    h.state.top = 2800
    h.controller.onScroll()
    expect(h.controller.sticking).toBe(false)
    // 往下滚回距底 ≤ 阈值的位置（3500 是底）
    h.state.top = 3500 - (STICK_THRESHOLD - 5)
    h.controller.onScroll()
    expect(h.controller.sticking).toBe(true)
  })

  it('滚轮 / 触摸立刻让位，不用等 scroll 事件', () => {
    const wheel = makeController({ top: 1800, content: 2000, viewport: 500 })
    wheel.controller.attach()
    wheel.controller.onIntent('wheel', -120)
    expect(wheel.controller.sticking).toBe(false)
    expect(wheel.unsticks).toContain('wheel')

    const touch = makeController({ top: 1800, content: 2000, viewport: 500 })
    touch.controller.attach()
    touch.controller.onIntent('touch')
    expect(touch.controller.sticking).toBe(false)
    expect(touch.unsticks).toContain('touch')
  })

  it('单帧位移不超过 maxSpeed × dt（与帧率无关）', () => {
    const h = makeController({ top: 0, content: 4000, viewport: 500 })
    h.controller.attach()
    h.advance(16)
    h.controller.step()
    const first = h.writes.at(-1) ?? 0
    expect(first).toBeLessThanOrEqual(MOTION.scroll.maxSpeed * 0.016 + 0.5)
  })

  it('跨度太大（instantAbove）时直接落位，不滑半屏', () => {
    const h = makeController({ top: 0, content: 4000, viewport: 500 })
    h.controller.attach()
    h.advance(5000)
    h.controller.step()
    expect(h.state.top).toBe(4000)
  })

  it('attach() 把基准对齐到当前位置，不把遗留位移当成用户上滚', () => {
    const h = makeController({ top: 1200, content: 2000, viewport: 500 })
    h.controller.attach()
    h.advance(100)
    h.controller.onScroll()
    expect(h.controller.sticking).toBe(true)
    expect(h.unsticks).toEqual([])
  })
})
