/**
 * preferences.ts 的单测。
 *
 * 这里自己 stub globalThis.localStorage（内存实现），不依赖 vitest 的
 * environment 配置：偏好存储必须同时兼容"有存储""没有存储""存储抛错"。
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  CONVERSATION_STORAGE_PREFIX,
  conversationStorageKey,
  hasStoredView,
  readStoredView,
  writeViewPreference,
} from '../src/client/session/preferences'

/** 内存版 Storage；只实现本模块用到的成员。 */
class MemoryStorage {
  private readonly items = new Map<string, string>()

  get length (): number {
    return this.items.size
  }

  clear (): void {
    this.items.clear()
  }

  getItem (key: string): string | null {
    return this.items.get(key) ?? null
  }

  key (index: number): string | null {
    return [...this.items.keys()][index] ?? null
  }

  removeItem (key: string): void {
    this.items.delete(key)
  }

  setItem (key: string, value: string): void {
    this.items.set(key, String(value))
  }
}

let storage: MemoryStorage

/** 安装内存存储；传 null 模拟"环境里没有 localStorage"。 */
function installStorage (value: MemoryStorage | null): void {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    enumerable: true,
    writable: true,
    value,
  })
}

/** 会话记录的键名。 */
function key (sessionId: string): string {
  return conversationStorageKey(sessionId)
}

/** 写入原始文本，允许故意写坏 JSON。 */
function writeRaw (sessionId: string, raw: string): void {
  storage.setItem(key(sessionId), raw)
}

/** 写入一条合法记录。 */
function writeState (sessionId: string, state: Record<string, unknown> | unknown[]): void {
  writeRaw(sessionId, JSON.stringify(state))
}

/** 读出原始 JSON 对象，用于断言字段是否被保留。 */
function readRaw (sessionId: string): Record<string, unknown> | null {
  const raw = storage.getItem(key(sessionId))
  return raw === null ? null : JSON.parse(raw) as Record<string, unknown>
}

beforeEach(() => {
  storage = new MemoryStorage()
  installStorage(storage)
})

afterEach(() => {
  vi.restoreAllMocks()
  Reflect.deleteProperty(globalThis, 'localStorage')
})

describe('conversationStorageKey', () => {
  it('使用宿主约定的 dsh.conversation.<sessionId> 键名', () => {
    expect(CONVERSATION_STORAGE_PREFIX).toBe('dsh.conversation.')
    expect(conversationStorageKey('sess-1')).toBe('dsh.conversation.sess-1')
  })
})

describe('readStoredView / hasStoredView', () => {
  it('读出字符串 view', () => {
    writeState('s', { draft: '草稿', view: 'chat-a2ui', viewRequest: 'chat-a2ui' })
    expect(readStoredView('s')).toBe('chat-a2ui')
    expect(hasStoredView('s')).toBe(true)
  })

  it('没有记录时返回 null / false', () => {
    expect(readStoredView('missing')).toBeNull()
    expect(hasStoredView('missing')).toBe(false)
  })

  it('只认字符串：null、数字、缺失都算未设置', () => {
    writeState('null-view', { view: null })
    writeState('number-view', { view: 42 })
    writeState('no-view', { draft: 'hi' })
    for (const id of ['null-view', 'number-view', 'no-view']) {
      expect(readStoredView(id)).toBeNull()
      expect(hasStoredView(id)).toBe(false)
    }
  })

  it('空字符串是 string，但不算已有视图', () => {
    writeState('empty', { view: '' })
    expect(readStoredView('empty')).toBe('')
    expect(hasStoredView('empty')).toBe(false)
  })

  it('坏 JSON、数组与标量都当作没有记录', () => {
    writeRaw('broken', '{"view":')
    writeState('array', ['chat-a2ui'])
    writeRaw('scalar', '"chat-a2ui"')
    writeRaw('null-json', 'null')
    for (const id of ['broken', 'array', 'scalar', 'null-json']) {
      expect(readStoredView(id)).toBeNull()
      expect(hasStoredView(id)).toBe(false)
    }
  })
})

describe('writeViewPreference', () => {
  it('新记录只写入 view', () => {
    expect(writeViewPreference('fresh', 'chat-a2ui')).toBe(true)
    expect(readRaw('fresh')).toStrictEqual({ view: 'chat-a2ui' })
    expect(readStoredView('fresh')).toBe('chat-a2ui')
  })

  it('保留 draft、viewRequest 与未知字段', () => {
    writeState('s', {
      draft: '还没发送的草稿',
      view: null,
      viewRequest: { id: 'native' },
      extra: ['x', { y: 1 }],
      schema: 3,
    })
    expect(writeViewPreference('s', 'chat-a2ui')).toBe(true)
    expect(readRaw('s')).toStrictEqual({
      draft: '还没发送的草稿',
      view: 'chat-a2ui',
      viewRequest: { id: 'native' },
      extra: ['x', { y: 1 }],
      schema: 3,
    })
  })

  it('只改自己那条记录', () => {
    writeState('other', { draft: '别人的草稿', view: 'native' })
    expect(writeViewPreference('mine', 'chat-a2ui')).toBe(true)
    expect(readRaw('other')).toStrictEqual({ draft: '别人的草稿', view: 'native' })
  })

  it('respectExisting 不会覆盖已有字符串 view', () => {
    writeState('s', { draft: 'hi', view: 'native' })
    expect(writeViewPreference('s', 'chat-a2ui', { respectExisting: true })).toBe(false)
    expect(readRaw('s')).toStrictEqual({ draft: 'hi', view: 'native' })
  })

  it('respectExisting 在 view 为 null 或缺失时照常写入', () => {
    writeState('null-view', { draft: 'd', view: null })
    expect(writeViewPreference('null-view', 'chat-a2ui', { respectExisting: true })).toBe(true)
    expect(readRaw('null-view')).toStrictEqual({ draft: 'd', view: 'chat-a2ui' })

    expect(writeViewPreference('missing', 'chat-a2ui', { respectExisting: true })).toBe(true)
    expect(readStoredView('missing')).toBe('chat-a2ui')
  })

  it('坏 JSON 会被整条重写成合法记录', () => {
    writeRaw('broken', 'not json at all')
    expect(writeViewPreference('broken', 'chat-a2ui')).toBe(true)
    expect(readRaw('broken')).toStrictEqual({ view: 'chat-a2ui' })
  })

  it('拒绝空 view', () => {
    expect(writeViewPreference('s', '')).toBe(false)
    expect(storage.getItem(key('s'))).toBeNull()
  })

  it('localStorage 缺失时读取返回 null、写入返回 false', () => {
    installStorage(null)
    expect(readStoredView('s')).toBeNull()
    expect(hasStoredView('s')).toBe(false)
    expect(writeViewPreference('s', 'chat-a2ui')).toBe(false)
    expect(() => writeViewPreference('s', 'chat-a2ui')).not.toThrow()
  })

  it('读取 localStorage 自身抛错时不向外抛', () => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get () {
        throw new Error('storage 被禁用')
      },
    })
    expect(readStoredView('s')).toBeNull()
    expect(hasStoredView('s')).toBe(false)
    expect(writeViewPreference('s', 'chat-a2ui')).toBe(false)
  })

  it('getItem 抛错时按没有记录处理', () => {
    vi.spyOn(storage, 'getItem').mockImplementation(() => {
      throw new Error('read failed')
    })
    expect(readStoredView('s')).toBeNull()
    expect(hasStoredView('s')).toBe(false)
  })

  it('setItem 抛配额异常时返回 false 且保留旧数据', () => {
    writeState('s', { draft: '保留我', view: 'native' })
    const before = storage.getItem(key('s'))
    vi.spyOn(storage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    expect(writeViewPreference('s', 'chat-a2ui')).toBe(false)
    expect(storage.getItem(key('s'))).toBe(before)
  })
})
