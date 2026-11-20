// @vitest-environment jsdom

/**
 * 滚动归属：谁拥有滚动、这一帧的位移是谁写的。
 *
 * 这两件事以前分在两处（ScrollToBottom 的 resolveOwner、探针的 resolveScroller），
 * 阈值也散成三个不同的数；这里把它们钉成一条可单测的规则。
 */

import { describe, expect, it } from 'vitest'
import { createOwnership, resolveScroller } from '../src/client/chat-a2ui/scroll-ownership'
import { MOTION } from '../src/client/chat-a2ui/motion-config'

/** 造一棵「外层滚动体 ← 容器」的树（挂到 body 上才有 closest 可走）。 */
function tree (): { outer: HTMLElement; container: HTMLElement } {
  const outer = document.createElement('div')
  outer.setAttribute('data-conversation-scroll', '')
  const container = document.createElement('div')
  outer.appendChild(container)
  document.body.appendChild(outer)
  return { outer, container }
}

describe('resolveScroller：权威顺序', () => {
  it('forceInner 优先：有外层滚动体也用自己的容器，reason=declared', () => {
    const { outer, container } = tree()
    const resolved = resolveScroller({ container, forceInner: true })
    expect(resolved.element).toBe(container)
    expect(resolved.reason).toBe('declared')
    outer.remove()
  })

  it('没有 forceInner：用最近的 [data-conversation-scroll] 祖先，reason=outer', () => {
    const { outer, container } = tree()
    const resolved = resolveScroller({ container, forceInner: false })
    expect(resolved.element).toBe(outer)
    expect(resolved.reason).toBe('outer')
    outer.remove()
  })

  it('两样都没有：退回容器自己，reason=container', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const resolved = resolveScroller({ container })
    expect(resolved.element).toBe(container)
    expect(resolved.reason).toBe('container')
    container.remove()
  })

  it('容器为空：没有滚动体，也不报错', () => {
    const resolved = resolveScroller({ container: null, forceInner: true })
    expect(resolved.element).toBeNull()
  })
})

describe('createOwnership：位移归属', () => {
  const tolerance = MOTION.scroll.ownershipTolerance
  /** 容差以内的一点点位移。 */
  const within = Math.max(1, tolerance - 1)
  /** 明显超过容差的一点点位移。 */
  const beyond = tolerance + 3

  it('等于基准 → ours，方向 none', () => {
    const ownership = createOwnership({ tolerance })
    ownership.write(1000)
    const verdict = ownership.classify(1000)
    expect(verdict.source).toBe('ours')
    expect(verdict.delta).toBe(0)
    expect(verdict.direction).toBe('none')
  })

  it('差 ' + within + 'px（容差 ' + tolerance + '）→ ours', () => {
    const ownership = createOwnership({ tolerance })
    ownership.write(1000)
    const down = ownership.classify(1000 + within)
    expect(down.source).toBe('ours')
    expect(down.delta).toBe(within)
    const up = ownership.classify(1000 - within)
    expect(up.source).toBe('ours')
    expect(up.delta).toBe(-within)
  })

  it('差 ' + beyond + 'px → external，方向跟着符号走', () => {
    const ownership = createOwnership({ tolerance })
    ownership.write(1000)
    const down = ownership.classify(1000 + beyond)
    expect(down.source).toBe('external')
    expect(down.delta).toBe(beyond)
    expect(down.direction).toBe('down')
    const up = ownership.classify(1000 - beyond)
    expect(up.source).toBe('external')
    expect(up.delta).toBe(-beyond)
    expect(up.direction).toBe('up')
  })

  it('write 之后基准跟着走', () => {
    const ownership = createOwnership({ tolerance })
    ownership.write(1000)
    ownership.write(2000)
    expect(ownership.classify(2000).source).toBe('ours')
    expect(ownership.classify(1000).source).toBe('external')
  })

  it('还没有基准时不凭空判外部', () => {
    const ownership = createOwnership({ tolerance })
    expect(ownership.baseline).toBeNull()
    expect(ownership.classify(900).source).toBe('ours')
  })
})
