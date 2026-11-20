/**
 * 行模型（row-model）的离线验证：不碰 React，只验收「宿主节点 → 行视图」的收窄结果。
 *
 * 用例按改造前 ChatRow 的 switch 逐支覆盖：user / steering / context、
 * assistant-step、tool-call、turn-tail、notice 族、legacy 族、turn-trigger、
 * 未知 kind 以及各种脏 data。
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  LEGACY_KINDS,
  NOTICE_KINDS,
  noticeSpec,
  parseRow,
  readContextText,
  splitUserContent,
  type RowView,
} from '../src/client/chat-a2ui/row-model'

const TIME = 1_700_000_000_000

/**
 * 断言行类型，并把联合收窄到对应成员。
 * @param view - parseRow 的结果。
 * @param type - 期望的判别值。
 * @returns 收窄后的行视图，方便直接读字段。
 */
function viewOf<T extends RowView['type']> (view: RowView, type: T): Extract<RowView, { type: T }> {
  expect(view.type).toBe(type)
  return view as Extract<RowView, { type: T }>
}

describe('parseRow：user / steering / context', () => {
  it('user：文本与文件附件一起解析，图片按附件引用读出', () => {
    const data = {
      kind: 'user',
      seq: 3,
      time: TIME,
      content: [
        { type: 'text', text: '看这个' },
        { type: 'text', text: '还有这个' },
        { type: 'file', attachment: { attachmentId: 'f1', name: '报告.pdf', bytes: 2048 } },
        { type: 'image', attachment: { attachmentId: 'a1', mediaType: 'image/jpeg', bytes: 12, width: 40, height: 30, name: 'shot.jpg' } },
      ],
    }
    const view = viewOf(parseRow('user', data), 'user')
    expect(view.kind).toBe('user')
    expect(view.time).toBe(TIME)
    expect(view.parts.texts).toEqual(['看这个', '还有这个'])
    expect(view.parts.files).toEqual([{ name: '报告.pdf', bytes: 2048 }])
    expect(view.parts.images).toEqual([{ attachmentId: 'a1', mediaType: 'image/jpeg', bytes: 12, width: 40, height: 30, name: 'shot.jpg' }])
    expect(view.parts.unsupported).toBe(0)
  })

  it('user：只有文本时没有附件，也没有时间', () => {
    const view = viewOf(parseRow('user', { kind: 'user', content: [{ type: 'text', text: '只说话' }] }), 'user')
    expect(view.parts.texts).toEqual(['只说话'])
    expect(view.parts.files).toEqual([])
    expect(view.parts.images).toEqual([])
    expect(view.time).toBeUndefined()
  })

  it('user：只有附件；图片缺媒体类型与尺寸时补默认值，未知块计数', () => {
    const view = viewOf(parseRow('steering', {
      kind: 'user',
      content: [
        { type: 'file', attachment: { name: 'a.zip', bytes: 0 } },
        { type: 'image', attachment: { attachmentId: 'i2' } },
        { type: 'weird-block' },
      ],
    }), 'user')
    // 只认节点 kind：data.kind 写的是 user，仍然是 steering。
    expect(view.kind).toBe('steering')
    expect(view.parts.texts).toEqual([])
    expect(view.parts.files).toEqual([{ name: 'a.zip', bytes: 0 }])
    expect(view.parts.images).toEqual([{ attachmentId: 'i2', mediaType: 'image/png', bytes: 0, width: 0, height: 0 }])
    expect(view.parts.unsupported).toBe(1)
  })

  it('context：优先 source.sections，没有段落时退回 content 文本', () => {
    const withSections = viewOf(parseRow('context', {
      kind: 'context',
      time: TIME,
      source: { sections: [{ text: '注入 A' }, { text: '注入 B' }] },
      content: [{ type: 'text', text: '原始文本' }],
    }), 'context')
    expect(withSections.text).toBe('注入 A\n注入 B')
    expect(withSections.time).toBe(TIME)

    const fallback = viewOf(parseRow('context', { content: [{ type: 'text', text: '  <system-reminder>x</system-reminder>  ' }] }), 'context')
    expect(fallback.text).toBe('<system-reminder>x</system-reminder>')

    const empty = viewOf(parseRow('context', {}), 'context')
    expect(empty.text).toBe('')
    expect(empty.time).toBeUndefined()
  })
})

describe('parseRow：assistant-step', () => {
  it('blocks 原样保留（含未知块类型），复制文本只取 text 块', () => {
    const blocks = [
      { kind: 'text', text: '第一段' },
      { kind: 'reasoning', text: '想想' },
      { kind: 'other', block: { type: 'mystery', payload: 1 } },
      { kind: 'text', text: '第二段' },
    ]
    const view = viewOf(parseRow('assistant-step', { kind: 'assistant-step', status: 'settled', turn: 1, step: 1, time: TIME, blocks }), 'assistant')
    expect(view.status).toBe('settled')
    expect(view.live).toBe(false)
    expect(view.time).toBe(TIME)
    expect(view.blocks).toEqual(blocks)
    expect(view.copyText).toBe('第一段\n\n第二段')
  })

  it('status=running 时 live 为真；blocks 缺失或不是数组时给空数组', () => {
    const running = viewOf(parseRow('assistant-step', { status: 'running' }), 'assistant')
    expect(running.status).toBe('running')
    expect(running.live).toBe(true)
    expect(running.blocks).toEqual([])
    expect(running.copyText).toBe('')

    const garbage = viewOf(parseRow('assistant-step', { status: 'weird', blocks: 'nope' }), 'assistant')
    expect(garbage.status).toBeUndefined()
    expect(garbage.live).toBe(false)
    expect(garbage.blocks).toEqual([])
  })
})

describe('parseRow：tool-call', () => {
  it('正常调用：保留原始 data 引用，取出标题与状态', () => {
    const data = {
      kind: 'tool-call',
      root: { callId: 'c1', name: 'read_file', argsRaw: '{"path":"a.ts"}', phase: 'start', content: [{ type: 'text', text: 'ok' }] },
    }
    const view = viewOf(parseRow('tool-call', data), 'tool')
    expect(view.data).toBe(data)
    expect(view.root).toBe(data.root)
    expect(view.title).toBe('read_file')
    expect(view.status).toBe('done')
  })

  it('字段缺失：没有 root 或 root 不是对象 → unknown，不抛', () => {
    const missing = parseRow('tool-call', { kind: 'tool-call' })
    expect(missing.type).toBe('unknown')
    expect(parseRow('tool-call', { root: 'nope' }).type).toBe('unknown')
    expect(parseRow('tool-call', { root: null }).type).toBe('unknown')
  })

  it('可选字段缺失仍按工具解析，状态判据与卡片一致', () => {
    const bare = viewOf(parseRow('tool-call', { root: { name: 'bare' } }), 'tool')
    expect(bare.title).toBe('bare')
    expect(bare.status).toBe('done')

    const nameless = viewOf(parseRow('tool-call', { root: {} }), 'tool')
    expect(nameless.title).toBe('')
    expect(nameless.status).toBe('done')

    expect(viewOf(parseRow('tool-call', { root: { name: 'x', isError: true } }), 'tool').status).toBe('error')
    expect(viewOf(parseRow('tool-call', { root: { name: 'x', error: { code: 'E' } } }), 'tool').status).toBe('error')
    expect(viewOf(parseRow('tool-call', { root: { name: 'x', phase: 'preparing' } }), 'tool').status).toBe('running')
    expect(viewOf(parseRow('tool-call', { root: { name: 'x', phase: 'start' } }), 'tool').status).toBe('running')
    expect(viewOf(parseRow('tool-call', { root: { name: 'x', phase: 'start', content: [] } }), 'tool').status).toBe('done')
  })
})

describe('parseRow：turn-tail', () => {
  it('时间、用量与分支可用性一次取好', () => {
    const view = viewOf(parseRow('turn-tail', {
      kind: 'turn-tail',
      turn: 2,
      seq: 7,
      time: TIME,
      closing: null,
      branchUnavailable: false,
      tokenUsage: { inputTokens: 1200, outputTokens: 340 },
    }), 'turn-tail')
    expect(view.seq).toBe(7)
    expect(view.time).toBe(TIME)
    expect(view.usage).toBe('输入 1,200 · 输出 340 tokens')
    expect(view.branchable).toBe(true)
  })

  it('seq 缺失或宿主禁止分支时 branchable 为假', () => {
    expect(viewOf(parseRow('turn-tail', { branchUnavailable: true, seq: 7 }), 'turn-tail').branchable).toBe(false)
    expect(viewOf(parseRow('turn-tail', { seq: 7 }), 'turn-tail').branchable).toBe(true)

    const noSeq = viewOf(parseRow('turn-tail', { branchUnavailable: false }), 'turn-tail')
    expect(noSeq.seq).toBeUndefined()
    expect(noSeq.branchable).toBe(false)
    expect(noSeq.usage).toBeUndefined()
  })
})

describe('parseRow：notice 族', () => {
  it('四种 kind 都归到 notice，并带上各自的图标与文案', () => {
    expect(NOTICE_KINDS).toEqual(['turn-error', 'turn-max-tokens', 'model-retry', 'turn-process'])

    const error = viewOf(parseRow('turn-error', { error: { message: '模型超时' } }), 'notice')
    expect(error.kind).toBe('turn-error')
    expect(error.spec).toEqual({ icon: '!', title: '本轮出错', text: '模型超时' })
    expect(noticeSpec('turn-error', {}).text).toBe('执行中断，可以重试一次。')

    const maxTokens = viewOf(parseRow('turn-max-tokens', {}), 'notice')
    expect(maxTokens.spec).toEqual({ icon: '…', title: '已达输出上限', text: '本轮回复被截断。' })

    const retry = viewOf(parseRow('model-retry', { attempt: 2, delayMs: 1500, reason: '上游 502' }), 'notice')
    expect(retry.kind).toBe('model-retry')
    expect(retry.spec).toEqual({ icon: '↻', title: '模型重试', text: '第 2 次尝试 · 2 秒后重试 · 上游 502' })
    expect(noticeSpec('model-retry', {})).toEqual({ icon: '↻', title: '模型重试', text: '正在重试模型请求' })
    expect(noticeSpec('model-retry', { attempts: 1, delay: 500 }).text).toBe('第 1 次尝试 · 500 毫秒后重试')

    const process = viewOf(parseRow('turn-process', { step: 3, text: '正在读取文件' }), 'notice')
    expect(process.spec).toEqual({ icon: '⋯', title: '处理过程', text: '步骤 3 · 正在读取文件' })
    expect(noticeSpec('turn-process', {}).text).toBeUndefined()
  })

  it('noticeSpec 的未知 kind 兜底：kind 原样当标题', () => {
    expect(noticeSpec('mystery', {})).toEqual({ icon: '·', title: 'mystery' })
    expect(noticeSpec('', {})).toEqual({ icon: '·', title: '未知消息' })
  })
})

describe('parseRow：legacy 族（仍走旧组件）', () => {
  it('command / compaction / manual-compaction 原样透传 data', () => {
    expect(LEGACY_KINDS).toEqual(['command', 'compaction', 'manual-compaction'])
    for (const kind of LEGACY_KINDS) {
      const data = { kind, seq: 1, summary: '压缩了', name: 'compact', args: null }
      const view = viewOf(parseRow(kind, data), 'legacy')
      expect(view.kind).toBe(kind)
      expect(view.data).toBe(data)
    }
  })
})

describe('kind 错配：只认节点 kind', () => {
  it('{ kind: tool-call, data: { kind: user } } 仍按 tool-call 解析', () => {
    const view = viewOf(parseRow('tool-call', { kind: 'user', root: { name: 'read_file' } }), 'tool')
    expect(view.title).toBe('read_file')
  })

  it('user 数据自称 assistant-step 时仍按 user 解析', () => {
    const view = viewOf(parseRow('user', { kind: 'assistant-step', content: [{ type: 'text', text: '你好' }] }), 'user')
    expect(view.kind).toBe('user')
    expect(view.parts.texts).toEqual(['你好'])
  })

  it('steering 数据自称 user 时仍按 steering 解析（标签看节点 kind）', () => {
    const view = viewOf(parseRow('steering', { kind: 'user', content: [] }), 'user')
    expect(view.kind).toBe('steering')
  })
})

describe('脏 data：退化成 unknown，不抛', () => {
  it('null / undefined / 非对象 → unknown，并带着原始 data', () => {
    for (const data of [null, undefined, 42, 'text', true, false]) {
      const view = viewOf(parseRow('user', data), 'unknown')
      expect(view.kind).toBe('user')
      expect(view.data).toBe(data)
    }
  })

  it('缺字段不会崩：空对象按各 kind 解析成空壳', () => {
    expect(parseRow('user', {}).type).toBe('user')
    expect(parseRow('steering', {}).type).toBe('user')
    expect(parseRow('context', {}).type).toBe('context')
    expect(parseRow('assistant-step', {}).type).toBe('assistant')
    expect(parseRow('turn-tail', {}).type).toBe('turn-tail')
    expect(parseRow('tool-call', {}).type).toBe('unknown')
  })
})

describe('未知 kind → unknown', () => {
  it('宿主里存在但本插件还没渲染的 kind 不抛', () => {
    for (const kind of ['workflow-run', 'command-input', 'question-reply', 'system-prompt', 'unknown', 'nope']) {
      const data = { marker: kind }
      const view = viewOf(parseRow(kind, data), 'unknown')
      expect(view.kind).toBe(kind)
      expect(view.data).toBe(data)
    }
  })

  it('kind 为空串时原样保留，由兜底卡片显示 unknown', () => {
    const view = viewOf(parseRow('', {}), 'unknown')
    expect(view.kind).toBe('')
  })
})

describe('turn-trigger → hidden', () => {
  it('纯标记节点不渲染，payload 是对象还是空都不重要', () => {
    expect(parseRow('turn-trigger', {}).type).toBe('hidden')
    expect(parseRow('turn-trigger', { seq: 3, time: TIME }).type).toBe('hidden')
    expect(parseRow('turn-trigger', null).type).toBe('hidden')
  })
})

describe('健壮性与依赖边界', () => {
  it('任何 kind × 任何 payload 都不抛', () => {
    const kinds = [
      'user',
      'steering',
      'context',
      'assistant-step',
      'tool-call',
      'turn-tail',
      'command',
      'compaction',
      'manual-compaction',
      ...NOTICE_KINDS,
      'turn-trigger',
      '',
      'nope',
    ]
    const payloads: unknown[] = [null, undefined, 0, '', true, [], {}, { content: 1, blocks: 'x', root: 2, source: 3, tokenUsage: 'x' }]
    for (const kind of kinds) {
      for (const data of payloads) {
        expect(() => parseRow(kind, data)).not.toThrow()
      }
    }
  })

  it('工具函数对非对象 / 非数组输入给出空结果', () => {
    expect(splitUserContent(undefined)).toEqual({ texts: [], images: [], files: [], unsupported: 0 })
    expect(splitUserContent({})).toEqual({ texts: [], images: [], files: [], unsupported: 0 })
    expect(readContextText(null)).toBe('')
    expect(readContextText('nope')).toBe('')
  })

  it('row-model 只依赖类型声明，不引入 React', () => {
    const source = readFileSync(join(import.meta.dirname, '..', 'src', 'client', 'chat-a2ui', 'row-model.ts'), 'utf8')
    expect(source).not.toMatch(/from\s+'react/)
  })
})
