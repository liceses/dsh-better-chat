/** 贴底跟随的限速数学：不依赖浏览器帧率，纯函数直接断言。 */

import { describe, expect, it } from 'vitest'
import { MAX_FRAME_MS, stepScroll } from '../src/client/chat-a2ui/scroll-follow'
import { MOTION } from '../src/client/chat-a2ui/motion-config'

const config = MOTION.scroll

describe('贴底限速跟随', () => {
  it('距离越大越快，但被 maxSpeed 封顶', () => {
    const near = stepScroll({ distance: 20, dtMs: 16, config })
    const mid = stepScroll({ distance: 300, dtMs: 16, config })
    const far = stepScroll({ distance: 5000, dtMs: 16, config })
    expect(near).toBeGreaterThan(0)
    expect(near).toBeLessThan(mid)
    // 封顶后只按 maxSpeed 走
    expect(far).toBeCloseTo((config.maxSpeed * 16) / 1000, 6)
    expect(far).toBeGreaterThan(mid)
  })

  it('单帧位移不超过 maxSpeed × 帧间隔', () => {
    for (const dtMs of [1, 8, 16, 33, MAX_FRAME_MS]) {
      const advance = stepScroll({ distance: 800, dtMs, config })
      expect(advance).toBeLessThanOrEqual((config.maxSpeed * dtMs) / 1000 + 1e-9)
    }
  })

  it('后台标签回来（超长帧）只按 64ms 推进', () => {
    const normal = stepScroll({ distance: 900, dtMs: MAX_FRAME_MS, config })
    const stalled = stepScroll({ distance: 900, dtMs: 5000, config })
    expect(stalled).toBeCloseTo(normal, 6)
  })

  it('不越过目标，也不往回走', () => {
    expect(stepScroll({ distance: 1, dtMs: MAX_FRAME_MS, config })).toBeLessThanOrEqual(1)
    expect(stepScroll({ distance: 0, dtMs: 16, config })).toBe(0)
    expect(stepScroll({ distance: -40, dtMs: 16, config })).toBe(0)
    expect(stepScroll({ distance: 100, dtMs: 0, config })).toBe(0)
  })

  it('连续推进能收敛到目标（大跨度约 0.4–0.6s 走完）', () => {
    let remaining = 531
    let frames = 0
    while (remaining > 0.5 && frames < 600) {
      remaining -= stepScroll({ distance: remaining, dtMs: 16, config })
      frames += 1
    }
    expect(remaining).toBeLessThanOrEqual(0.5)
    const ms = frames * 16
    expect(ms).toBeGreaterThan(120)
    expect(ms).toBeLessThan(1200)
  })
})
