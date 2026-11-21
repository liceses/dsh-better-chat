/**
 * 从宿主 Sessions 服务造一个 `useSessions` 选择器 hook。
 *
 * 以前这个 hook 由宿主通过 `sidebar.workspaces` 座位的 inject 送进来；我们把那个
 * 占位摘掉之后（ADR 0003：它会把宿主的工作区树顶掉），面板内部自己需要一个。
 * 只依赖 `sessions.list` 的 subscribe / getSnapshot，与宿主同一份快照。
 */

import { useSyncExternalStore } from 'react'
import type { SessionListSnapshot, SessionsApi, UseSessions } from '../chat-a2ui/types'

/**
 * 造一个跟随宿主会话快照的选择器 hook。
 * @param sessions - 宿主 Sessions 服务。
 * @returns 与宿主 `UseSessions` 同形的 hook。
 */
export function createUseSessions (sessions: SessionsApi): UseSessions {
  const subscribe = (listener: () => void): (() => void) => sessions.list.subscribe(listener)
  const read = (): SessionListSnapshot => sessions.list.getSnapshot()
  return function useSessions<T> (selector: (snapshot: SessionListSnapshot) => T): T {
    // 选择器必须返回稳定的值（宿主的快照对象本身稳定）；identity 选择器最安全。
    return useSyncExternalStore(subscribe, () => selector(read()), () => selector(read()))
  }
}
