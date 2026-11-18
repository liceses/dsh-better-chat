/**
 * Motion preference store: system default, explicit override, toggle, and
 * graceful fallback when localStorage is unavailable or holds junk.
 */

import { afterEach, describe, expect, it, vi } from 'vitest'

interface FakeWindow {
  matchMedia: ReturnType<typeof vi.fn>
  localStorage: {
    getItem: (key: string) => string | null
    setItem: (key: string, value: string) => void
  }
  addEventListener: ReturnType<typeof vi.fn>
}

/** Install a window with a controllable media query and storage map. */
function installWindow (options: {
  reduced?: boolean
} = {}): { win: FakeWindow; media: { matches: boolean; addEventListener: ReturnType<typeof vi.fn> }; writes: Map<string, string> } {
  const writes = new Map<string, string>()
  const media = { matches: options.reduced === true, addEventListener: vi.fn() }
  const win: FakeWindow = {
    matchMedia: vi.fn(() => media),
    localStorage: {
      getItem: (key) => writes.get(key) ?? null,
      setItem: (key, value) => { writes.set(key, value) },
    },
    addEventListener: vi.fn(),
  }
  vi.stubGlobal('window', win)
  return { win, media, writes }
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

describe('motion preference', () => {
  it('uses full when there is no window', async () => {
    vi.resetModules()
    const mod = await import('../src/client/chat-a2ui/motion-preference')
    expect(mod.getMotionLevel()).toBe('full')
  })

  it('follows the system reduced-motion setting', async () => {
    installWindow({ reduced: true })
    vi.resetModules()
    const mod = await import('../src/client/chat-a2ui/motion-preference')
    expect(mod.getMotionLevel()).toBe('reduced')
  })

  it('lets an explicit full override a reduced system setting', async () => {
    const { writes } = installWindow({ reduced: true })
    vi.resetModules()
    const mod = await import('../src/client/chat-a2ui/motion-preference')
    writes.set(mod.CHAT_MOTION_STORAGE_KEY, 'full')
    expect(mod.getMotionLevel()).toBe('full')
  })

  it('ignores invalid stored values and falls back to the system', async () => {
    const { writes } = installWindow({ reduced: true })
    vi.resetModules()
    const mod = await import('../src/client/chat-a2ui/motion-preference')
    writes.set(mod.CHAT_MOTION_STORAGE_KEY, 'loud')
    expect(mod.getMotionLevel()).toBe('reduced')
  })

  it('toggles, persists, and notifies subscribers', async () => {
    const { writes } = installWindow({ reduced: false })
    vi.resetModules()
    const mod = await import('../src/client/chat-a2ui/motion-preference')
    const listener = vi.fn()
    const unsubscribe = mod.subscribeMotion(listener)

    expect(mod.getMotionLevel()).toBe('full')
    expect(mod.toggleMotionLevel()).toBe('reduced')
    expect(mod.getMotionLevel()).toBe('reduced')
    expect(writes.get(mod.CHAT_MOTION_STORAGE_KEY)).toBe('reduced')
    expect(listener).toHaveBeenCalledTimes(1)

    unsubscribe()
    mod.setMotionLevel('full')
    expect(listener).toHaveBeenCalledTimes(1)
    expect(mod.getMotionLevel()).toBe('full')
  })
})
