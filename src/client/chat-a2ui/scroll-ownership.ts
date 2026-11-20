/**
 * 滚动归属：谁拥有滚动、这一帧的位移是谁写的。
 *
 * 以前这两件事各猜各的：跟随器用 `closest([data-conversation-scroll])` 猜滚动体，
 * 探针又用 `.caui-viewport` 加高度启发猜一次；而「位移是不是我们自己写的」
 * 有三个不同阈值（2 / 4 / 2）。
 *
 * 这里把它们收成两条纯规则：
 * - `resolveScroller`：滚动体的权威顺序（forceInner → 外层声明 → 容器自己）。
 * - `createOwnership`：记住我们最后写进去的坐标，按容差判断这次变化归谁。
 *
 * 注意：这一层**不区分**「浏览器夹边」与「用户滚动」——两者在坐标上是同一件事，
 * 区分是策略层的事（external + down + 当前未贴底 才可能是夹边）。
 */

/** 原生会话壳在外层声明的滚动容器标记。 */
const OUTER_SCROLL_SELECTOR = '[data-conversation-scroll]'

/** 滚动体是按哪一条规则定下来的。 */
export type ScrollerReason = 'declared' | 'outer' | 'container'

/** 解析结果：元素可能为 null（容器还没挂载），原因始终有值。 */
export interface ResolvedScroller {
  element: HTMLElement | null
  reason: ScrollerReason
}

export interface ResolveScrollerOptions {
  /** 消息区自己的容器（可能还没挂载）。 */
  container: HTMLElement | null
  /** 强制使用本视图自己的容器，忽略外层原生滚动体。 */
  forceInner?: boolean
}

/**
 * 按权威顺序解析滚动体：forceInner 优先，其次 `[data-conversation-scroll]` 祖先，
 * 最后退回容器自己。判定只有这一处，探针与跟随器都从这里取。
 * @param options - 容器与是否强制内滚。
 * @returns 滚动体元素与判定来源（declared / outer / container）。
 */
export function resolveScroller ({ container, forceInner = false }: ResolveScrollerOptions): ResolvedScroller {
  if (container === null) return { element: null, reason: 'container' }
  if (forceInner) return { element: container, reason: 'declared' }
  const outer = container.closest(OUTER_SCROLL_SELECTOR)
  if (outer instanceof HTMLElement) return { element: outer, reason: 'outer' }
  return { element: container, reason: 'container' }
}

/** 位移的来源：我们写的，还是别人动的。 */
export type MoveSource = 'ours' | 'external'

/** 相对基准的方向。 */
export type MoveDirection = 'up' | 'down' | 'none'

export interface OwnershipVerdict {
  source: MoveSource
  /** 相对基准的位移（px；正数向下，负数向上）。 */
  delta: number
  direction: MoveDirection
}

export interface OwnershipOptions {
  /** 容差（px）：与基准的差不超过它就算我们自己的位移。只能来自配置。 */
  tolerance: number
  /** 初始基准；省略表示「还没有写入过」（这时 classify 不会凭空判外部）。 */
  initial?: number
}

/** 位移归属句柄：基准可写、坐标可判。 */
export interface Ownership {
  readonly tolerance: number
  /** 我们最后一次写入（或对齐）的坐标；null 表示还没有基准。 */
  readonly baseline: number | null
  /** 把某个坐标记为「我们的」：我们写进去的，或者对齐到的当前位置。 */
  write (top: number): void
  /** 判断这个坐标的位移归谁：容差以内是我们，其余按符号给方向。 */
  classify (top: number): OwnershipVerdict
}

/**
 * 方向只由符号决定（正数向下）。
 * @param delta - 相对基准的位移。
 * @returns up / down / none。
 */
function directionOf (delta: number): MoveDirection {
  if (delta < 0) return 'up'
  if (delta > 0) return 'down'
  return 'none'
}

/**
 * 建一个位移归属判断器。基准是我们最后一次写入的 scrollTop，
 * 后面的变化只要超出容差就归给外部（浏览器或用户）。
 * @param options - 容差与可选初始基准。
 * @returns 可写基准、可判归属的句柄。
 */
export function createOwnership ({ tolerance, initial }: OwnershipOptions): Ownership {
  let baseline: number | null = initial === undefined ? null : initial
  return {
    get tolerance (): number { return tolerance },
    get baseline (): number | null { return baseline },
    write (top: number): void {
      baseline = top
    },
    classify (top: number): OwnershipVerdict {
      if (baseline === null) return { source: 'ours', delta: 0, direction: 'none' }
      const delta = top - baseline
      const source: MoveSource = Math.abs(delta) <= tolerance ? 'ours' : 'external'
      return { source, delta, direction: directionOf(delta) }
    },
  }
}
