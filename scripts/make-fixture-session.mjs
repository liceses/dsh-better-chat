import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { constants, zstdCompressSync, zstdDecompressSync } from 'node:zlib'

const root = process.argv[2]
if (!root) throw new Error('usage: node make-fixture-session.mjs <DSH_HOME>')

const generatedId = 'session-0f0f0f0f-1111-4222-8333-444455556666'
const id = process.argv[3] ?? generatedId
const existingLog = process.argv[3] === undefined
  ? undefined
  : join(root, 'sessions', '--D-developing-DSH-plugin-dsh-A2UI--', id, 'session.v4.jsonl.zstd')
const cwd = 'D:\\developing\\DSH-plugin\\dsh-A2UI'
const now = Date.now()
const events = []
const push = (type, data, seq) => events.push(seq === undefined ? { type, data } : { type, seq, time: now + seq * 10, data })

if (existingLog === undefined) {
  events.push({
    type: 'session',
    version: 4,
    id,
    createdAt: now,
    cwd,
    isSeeded: true,
    delegationDepth: 0,
    agentPreset: 'chat',
  })
} else {
  const decoded = zstdDecompressSync(readFileSync(existingLog)).toString('utf8')
  const headerLine = decoded.split('\n').find((line) => line.trim().length > 0)
  if (headerLine === undefined) throw new Error('existing session log has no header')
  let header = JSON.parse(headerLine)
  while (header?.type === 'session' && header.data?.type === 'session') header = header.data
  events.push(header)
}
let seq = 0
const SURFACE_EVENTS = new Set(['user/message', 'assistant/message', 'tool/result'])
const ev = (type, data) => {
  const event = { type, seq, time: now + seq * 10, data }
  if (SURFACE_EVENTS.has(type)) event.surfaceOp = 'append'
  if (type === 'tool/result') event.sourceEventSeqs = [seq - 1]
  events.push(event)
  seq += 1
}
ev('permission/preset', { preset: 'danger-full-access' })
ev('sandbox/mode', { mode: 'danger-full-access' })
ev('approval/policy', { policy: 'never' })
ev('agent-preset/selected', { agentPreset: 'chat' })
ev('turn/start', { turn: 1 })
ev('step/start', { turn: 1, step: 1 })
const user1 = '你好！请介绍一下这个 Chat UI 的渲染能力，并给一个简短的代码示例。'
ev('user/message', {
  content: [{ type: 'text', text: user1 }],
  source: { kind: 'user' },
  role: 'user',
  id: '11111111-1111-4111-8111-111111111111',
})
const fence = String.fromCharCode(96).repeat(3)
const intro = [
  '# Chat UI 渲染验收',
  '',
  '这是一段**流式 Markdown**，用来检查标题、强调、列表、引用、代码块与链接。',
  '',
  '- 支持逐块生长',
  '- 支持图片与附件',
  '- 支持工具调用卡片',
  '',
  '> 布局用 Framer Motion 的 layout 与 spring 曲线。',
  '',
  fence + 'js',
  'const spring = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 }',
  fence,
  '',
  '查看 [DSH 文档](https://example.com/docs)。',
].join('\n')
ev('assistant/message', {
  turn: 1,
  step: 1,
  message: {
    role: 'assistant',
    content: [{ type: 'text', text: intro }],
    source: { kind: 'model', provider: 'fixture', model: 'fixture-model' },
    id: '22222222-2222-4222-8222-222222222222',
  },
  stream: [],
  usage: { inputTokens: 128, outputTokens: 96, totalTokens: 224, cacheReadTokens: 0 },
})
ev('step/end', { turn: 1, step: 1 })
ev('turn/end', { turn: 1, reason: { kind: 'completed' } })

ev('turn/start', { turn: 2 })
ev('step/start', { turn: 2, step: 1 })
const user2 = '再演示一次工具调用卡片，并给我一句总结。'
ev('user/message', {
  content: [{ type: 'text', text: user2 }],
  source: { kind: 'user' },
  role: 'user',
  id: '33333333-3333-4333-8333-333333333333',
})
ev('assistant/message', {
  turn: 2,
  step: 1,
  message: {
    role: 'assistant',
    content: [
      { type: 'reasoning', text: '用户想验证工具卡。先发起一次 web_search，再把结果总结成一句话。' },
      { type: 'tool-call', id: 'call_fixture_1', name: 'web_search', arguments: JSON.stringify({ queries: ['DeepSeek Harness Chat UI'] }) },
    ],
    source: { kind: 'model', provider: 'fixture', model: 'fixture-model' },
    id: '44444444-4444-4444-8444-444444444444',
  },
  stream: [],
})
ev('tool/call', { turn: 2, step: 1, callId: 'call_fixture_1', name: 'web_search', arguments: JSON.stringify({ queries: ['DeepSeek Harness Chat UI'] }) })
ev('tool/result', {
  turn: 2,
  step: 1,
  message: {
    role: 'tool',
    source: { kind: 'tool', callId: 'call_fixture_1' },
    toolCallId: 'call_fixture_1',
    content: [{ type: 'text', text: '1 result: DeepSeek Harness - Chat UI fixture result.' }],
    isError: false,
    id: '55555555-5555-4555-8555-555555555555',
  },
})
ev('step/end', { turn: 2, step: 1 })
ev('step/start', { turn: 2, step: 2 })
ev('assistant/message', {
  turn: 2,
  step: 2,
  message: {
    role: 'assistant',
    content: [{ type: 'text', text: '工具调用成功：搜索返回了 **1 条**结果，这张卡片应当可以展开查看参数与输出。\n\n总结：自研 Chat 视图已经能渲染流式 Markdown、工具卡与分支入口。' }],
    source: { kind: 'model', provider: 'fixture', model: 'fixture-model' },
    id: '66666666-6666-4666-8666-666666666666',
  },
  stream: [],
})
ev('step/end', { turn: 2, step: 2 })
ev('turn/end', { turn: 2, reason: { kind: 'completed' } })

ev('turn/start', { turn: 3 })
ev('step/start', { turn: 3, step: 1 })
ev('user/message', {
  content: [
    {
      type: 'image',
      attachment: {
        attachmentId: 'sha256:99823de324deeea90a67f9a63f62e7b1aa694d5373a2b88811488c838ee16709',
        mediaType: 'image/png',
        bytes: 248776,
        width: 640,
        height: 360,
        name: 'chat-ui-sample.png',
      },
    },
    { type: 'text', text: '这张图里写了什么？' },
  ],
  source: { kind: 'user' },
  role: 'user',
  id: '77777777-7777-4777-8777-777777777777',
})
ev('assistant/message', {
  turn: 3,
  step: 1,
  message: {
    role: 'assistant',
    content: [{ type: 'text', text: '图片里是渐变色背景，写着“Chat UI 图片渲染”和“640 × 360 · 本地生成”。这是用户消息内联图片的渲染验收。' }],
    source: { kind: 'model', provider: 'fixture', model: 'fixture-model' },
    id: '88888888-8888-4888-8888-888888888888',
  },
  stream: [],
})
ev('step/end', { turn: 3, step: 1 })
ev('turn/end', { turn: 3, reason: { kind: 'completed' } })

ev('session/title', {
  title: 'Chat UI 渲染验收',
  messageSeqs: [6],
  source: { kind: 'fallback' },
})

const headerLine = JSON.stringify(events[0])
const body = events.slice(1).map((event) => JSON.stringify(event)).join('\n') + '\n'
const dir = join(root, 'sessions', '--D-developing-DSH-plugin-dsh-A2UI--', id)
mkdirSync(dir, { recursive: true })
const file = join(dir, 'session.v4.jsonl.zstd')
const options = { params: { [constants.ZSTD_c_checksumFlag]: 1 } }
const headerFrame = zstdCompressSync(Buffer.from(headerLine + '\n', 'utf8'), options)
const bodyFrame = zstdCompressSync(Buffer.from(body, 'utf8'), options)
writeFileSync(file, Buffer.concat([headerFrame, bodyFrame]))
console.log(file)
console.log('events', events.length, 'seq-last', seq - 1, 'bytes', body.length)
