/**
 * Chat 动效档位：full / reduced。
 *
 * 默认跟随系统 prefers-reduced-motion；用户在侧栏切换后写 localStorage，
 * 显式选择优先于系统偏好。所有 Framer 动效与 CSS 动画都读这一个来源，
 * 避免“文字在动、卡片不动”的割裂感。
 */

import { useSyncExternalStore } from 'react'

/** 两档动效。reduced 仍保留必要的一帧反馈，不做位移动画。 */
export type ChatMotionLevel = 'full' | 'reduced'

/** localStorage 键；只保存 full / reduced。 */
export const CHAT_MOTION_STORAGE_KEY = 'chat-a2ui.motion'

const listeners = new Set<() => void>()
let cached: ChatMotionLevel | null = null
let media: MediaQueryList | null = null
let listening = false

function hasWindow (): boolean {
  return typeof window !== 'undefined'
}

/** 读取系统偏好；没有 matchMedia 时按 full 处理。 */
function systemLevel (): ChatMotionLevel {
  if (!hasWindow()) return 'full'
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'full'
  } catch {
    return 'full'
  }
}

/** 读取用户显式选择；非法值、无 localStorage 都返回 null。 */
function readStored (): ChatMotionLevel | null {
  if (!hasWindow()) return null
  try {
    const value = window.localStorage.getItem(CHAT_MOTION_STORAGE_KEY)
    return value === 'full' || value === 'reduced' ? value : null
  } catch {
    return null
  }
}

/** 解析当前档位：显式选择优先，否则跟随系统。 */
function resolve (): ChatMotionLevel {
  return readStored() ?? systemLevel()
}

/** 通知所有订阅者；先清缓存，让 getSnapshot 重新解析。 */
function notify (): void {
  cached = null
  for (const listener of listeners) listener()
}

/** 懒挂系统与跨标签页监听，避免模块导入时产生副作用。 */
function ensureListening (): void {
  if (listening || !hasWindow()) return
  listening = true
  try {
    media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onSystemChange = (): void => {
      // 用户显式选择时，系统变化不覆盖用户选择。
      if (readStored() === null) notify()
    }
    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', onSystemChange)
    } else if (typeof media.addListener === 'function') {
      media.addListener(onSystemChange)
    }
  } catch {
    media = null
  }
  try {
    window.addEventListener('storage', (event) => {
      if (event.key !== null && event.key !== CHAT_MOTION_STORAGE_KEY) return
      notify()
    })
  } catch {
    // 某些隐私模式会拒绝监听；动效仍可用，只是不跨标签同步。
  }
}

/** 稳定快照：没有 window 的 SSR 环境按 full。 */
export function getMotionLevel (): ChatMotionLevel {
  if (!hasWindow()) return 'full'
  ensureListening()
  if (cached === null) cached = resolve()
  return cached
}

/** useSyncExternalStore 订阅函数。 */
export function subscribeMotion (listener: () => void): () => void {
  ensureListening()
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

/** 写入显式选择；写失败也更新当前页面，不阻断交互。 */
export function setMotionLevel (level: ChatMotionLevel): void {
  cached = level
  if (hasWindow()) {
    try {
      window.localStorage.setItem(CHAT_MOTION_STORAGE_KEY, level)
    } catch {
      // 忽略配额/隐私模式错误：本次页面仍然生效。
    }
  }
  for (const listener of listeners) listener()
}

/** 当前档位的 React 订阅。 */
export function useMotionLevel (): ChatMotionLevel {
  return useSyncExternalStore(subscribeMotion, getMotionLevel, () => 'full')
}

/** 是否允许完整动效。 */
export function useMotionEnabled (): boolean {
  return useMotionLevel() === 'full'
}

/** 在 full / reduced 之间切换。 */
export function toggleMotionLevel (): ChatMotionLevel {
  const next: ChatMotionLevel = getMotionLevel() === 'full' ? 'reduced' : 'full'
  setMotionLevel(next)
  return next
}
