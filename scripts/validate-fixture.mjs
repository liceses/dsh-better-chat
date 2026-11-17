import { readFileSync } from 'node:fs'
import { zstdDecompressSync } from 'node:zlib'
import { adoptSessionEvent, KNOWN_SESSION_EVENT_TYPES } from '../.dsh-test-cli/node_modules/@deepseek-ai/dsh-session/lib/index.js'

const file = process.argv[2]
const text = zstdDecompressSync(readFileSync(file)).toString('utf8')
const lines = text.split('\n').filter(Boolean)
for (const [i, line] of lines.entries()) {
  const event = JSON.parse(line)
  if (event.type === 'session') continue
  try {
    adoptSessionEvent(event)
  } catch (error) {
    console.log('FAIL', i, event.type, event.seq, String(error))
    process.exit(1)
  }
}
console.log('OK', lines.length)
