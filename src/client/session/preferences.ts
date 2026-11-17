/**
 * 会话视图偏好存储。
 *
 * 宿主把草稿和当前视图放在同一条 localStorage 记录里：
 *   `dsh.conversation.<sessionId>` → `{ draft, view, viewRequest, ...未知字段 }`
 * 本模块只读写其中的 `view`，其余字段一律原样保留。
 *
 * localStorage 在隐私模式、被禁用的 iframe、配额已满时都可能失败；
 * 这里所有访问都包在 try/catch 里，失败只返回安全默认值，绝不向外抛。
 */

/** 会话记录的 localStorage 键前缀（宿主约定，不能改）。 */
export const CONVERSATION_STORAGE_PREFIX = 'dsh.conversation.'

/** 一条会话记录的完整键名，例如 `dsh.conversation.abc123`。 */
export function conversationStorageKey (sessionId: string): string {
  return CONVERSATION_STORAGE_PREFIX + sessionId
}

/** 解析后的会话记录；未知字段原样保留。 */
type ConversationState = Record<string, unknown>

/** {@link writeViewPreference} 的可选项。 */
export interface WriteViewOptions {
  /** 已经存在字符串 view 时不覆盖（用于"用户显式选过视图"的场景）。 */
  respectExisting?: boolean
}

/** 合法的视图 id：非空字符串。 */
function isUsableView (value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

/**
 * 取当前环境的 localStorage；不存在或被禁用时返回 null。
 * 读取 globalThis.localStorage 本身也可能抛错（沙箱 iframe），因此也包在 try 里。
 */
function getStorage (): Storage | null {
  try {
    const scope = globalThis as { localStorage?: Storage | null }
    return scope.localStorage ?? null
  } catch {
    return null
  }
}

/** 读取并解析一条会话记录；缺失、坏 JSON、不是对象都返回 null。 */
function readState (sessionId: string): ConversationState | null {
  const storage = getStorage()
  if (storage === null) return null
  try {
    const raw = storage.getItem(conversationStorageKey(sessionId))
    if (typeof raw !== 'string' || raw.length === 0) return null
    const parsed: unknown = JSON.parse(raw)
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    return parsed as ConversationState
  } catch {
    // 坏 JSON 或存储实现异常：按"没有记录"处理，后续写入会整条重写。
    return null
  }
}

/**
 * 读取已存储的视图 id；只有字符串才算数。
 * `view: null`、数字、缺失或坏记录都返回 null。
 */
export function readStoredView (sessionId: string): string | null {
  const state = readState(sessionId)
  if (state === null) return null
  return typeof state.view === 'string' ? state.view : null
}

/**
 * 会话是否已经有可用的视图偏好。
 * 空字符串不算——它不是合法的视图 id，视同未设置。
 */
export function hasStoredView (sessionId: string): boolean {
  return isUsableView(readStoredView(sessionId))
}

/**
 * 把视图偏好写进会话记录，保留 draft、viewRequest 与所有未知字段。
 * @param sessionId 目标会话。
 * @param view 要写入的视图 id；空字符串会被拒绝。
 * @param options `respectExisting` 为 true 且已有字符串 view 时什么都不做。
 * @returns 是否真的写入了 localStorage。
 */
export function writeViewPreference (
  sessionId: string,
  view: string,
  options: WriteViewOptions = {},
): boolean {
  if (!isUsableView(view)) return false
  const storage = getStorage()
  if (storage === null) return false
  try {
    const existing = readState(sessionId)
    if (options.respectExisting === true && existing !== null && typeof existing.view === 'string') {
      // 用户已经选择过视图，补写不能覆盖它。
      return false
    }
    const next: ConversationState = existing === null ? {} : { ...existing }
    next.view = view
    storage.setItem(conversationStorageKey(sessionId), JSON.stringify(next))
    return true
  } catch {
    // 配额满 / 存储被禁用：静默失败，视图补写不该阻塞建会话。
    return false
  }
}
