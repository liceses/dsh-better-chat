// Local OpenAI-compatible streaming stub for the isolated Chat UI test home.
// It exists only to exercise real token streaming, Markdown growth and the
// composer -> Session -> view pipeline without any external credentials.
import { createServer } from 'node:http'

const PORT = Number(process.env.FAKE_PORT ?? 18999)
const DELAY = Number(process.env.FAKE_DELAY ?? 90)

const CHUNKS = [
  '## 流式渲染检查\n\n',
  '这是**真正的模型流**，不是回放。',
  '每个分片到达后，Chat 视图应当只更新正在生长的这一段，',
  '已经完成的 Markdown 块保持稳定。\n\n',
  '1. 标题、强调与列表会边到边渲染\n',
  '2. 代码块只在闭合后高亮\n',
  '3. 布局用 Framer Motion 的 layout 弹簧推挤\n\n',
  '> 如果你看到这段文字逐字出现，流式链路就是通的。\n\n',
  '```ts\nconst spring = { type: "spring", stiffness: 420, damping: 34, mass: 0.8 }\n```\n\n',
  '最后一句：**流式完成**。',
]

function sendJson (res, status, value) {
  const body = JSON.stringify(value)
  res.writeHead(status, { 'content-type': 'application/json', 'content-length': Buffer.byteLength(body) })
  res.end(body)
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://127.0.0.1')
  if (req.method === 'GET' && (url.pathname === '/v1/models' || url.pathname === '/models')) {
    return sendJson(res, 200, { object: 'list', data: [{ id: 'fake-chat', object: 'model', owned_by: 'local' }] })
  }
  if (req.method !== 'POST' || !url.pathname.endsWith('/chat/completions')) {
    return sendJson(res, 404, { error: { message: 'not found', type: 'invalid_request_error' } })
  }

  let raw = ''
  for await (const part of req) raw += part
  let body = {}
  try { body = JSON.parse(raw) } catch { /* the stub does not need a valid body */ }
  const stream = body.stream !== false
  if (!stream) {
    return sendJson(res, 200, {
      id: 'chatcmpl-fake', object: 'chat.completion', created: Math.floor(Date.now() / 1000), model: 'fake-chat',
      choices: [{ index: 0, message: { role: 'assistant', content: CHUNKS.join('') }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 42, completion_tokens: 96, total_tokens: 138 },
    })
  }

  res.writeHead(200, {
    'content-type': 'text/event-stream; charset=utf-8',
    'cache-control': 'no-cache',
    connection: 'keep-alive',
  })
  const id = 'chatcmpl-fake-' + Date.now()
  const base = { id, object: 'chat.completion.chunk', created: Math.floor(Date.now() / 1000), model: 'fake-chat' }
  res.write('data: ' + JSON.stringify({ ...base, choices: [{ index: 0, delta: { role: 'assistant', content: '' }, finish_reason: null }] }) + '\n\n')
  for (const text of CHUNKS) {
    await new Promise(resolve => setTimeout(resolve, DELAY))
    res.write('data: ' + JSON.stringify({ ...base, choices: [{ index: 0, delta: { content: text }, finish_reason: null }] }) + '\n\n')
  }
  res.write('data: ' + JSON.stringify({ ...base, choices: [{ index: 0, delta: {}, finish_reason: 'stop' }], usage: { prompt_tokens: 42, completion_tokens: 96, total_tokens: 138 } }) + '\n\n')
  res.write('data: [DONE]\n\n')
  res.end()
})

server.listen(PORT, '127.0.0.1', () => {
  console.log('fake OpenAI server listening on http://127.0.0.1:' + PORT + '/v1')
})
