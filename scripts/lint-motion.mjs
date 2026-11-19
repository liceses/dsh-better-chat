#!/usr/bin/env node
/**
 * 动效体系的门禁：组件里不许出现手写的动效数值。
 *
 *   npm run lint:motion
 *
 * 判据（与 README「动效体系」一节一致）：
 * 1. `src/client/chat-a2ui/**` 里（motion*.ts / style*.ts 除外）不许出现
 *    duration / delay / ease / stiffness / damping / mass 的字面量；
 * 2. `duration: 0` 放行（reduced 档的合法写法）；
 * 3. 白名单 motion-allowlist.json 逐条记录存量，匹配用「文件 + 该行文本」，
 *    行号漂移不影响；条目数不得超过 cap，失效条目也要报错。
 *
 * 退出码非零即失败，可直接进 CI。
 */
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const SRC = join(ROOT, 'src', 'client', 'chat-a2ui')
const ALLOWLIST = join(ROOT, 'motion-allowlist.json')

const SKIP = /(^|\/)(motion(-config|-roles|-primitives)?\.ts|style(-p06)?\.ts|scroll-follow\.ts|scroll-probe\.ts)$/
const KEYS = /(\bduration\b|\bdelay\b|\bease\b|\beasing\b|\bstiffness\b|\bdamping\b|\bmass\b)\s*:/

function files (dir) {
  const out = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const stat = statSync(full)
    if (stat.isDirectory()) out.push(...files(full))
    else if (/\.(ts|tsx)$/.test(name)) out.push(full)
  }
  return out
}

/** 收集违规点：{ file, snippet }。 */
function collect () {
  const hits = []
  for (const full of files(SRC)) {
    const rel = relative(ROOT, full).replaceAll('\\', '/')
    if (SKIP.test(rel)) continue
    const lines = readFileSync(full, 'utf8').split(String.fromCharCode(10))
    lines.forEach((raw, index) => {
      const line = raw.trim()
      if (!KEYS.test(line)) return
      if (/duration\s*:\s*0\b/.test(line)) return
      if (line.startsWith('*') || line.startsWith('//')) return
      // 类型标注与形参不算动效数值：{ duration: number } / duration?: number
      if (/\b(duration|delay|ease|easing|stiffness|damping|mass)\??\s*:\s*(number|string|Ease|Transition)/.test(line)) return
      if (/\b(duration|delay|ease|easing|stiffness|damping|mass)\?(?=\s*:) /.test(line)) return
      hits.push({ file: rel, line: index + 1, snippet: line })
    })
  }
  return hits
}

const hits = collect()
const allowlist = existsSync(ALLOWLIST)
  ? JSON.parse(readFileSync(ALLOWLIST, 'utf8'))
  : { cap: hits.length, entries: [] }

const key = (entry) => entry.file + '\u0000' + entry.snippet
const allowed = new Set(allowlist.entries.map(key))
const violations = hits.filter((hit) => !allowed.has(key(hit)))
const liveKeys = new Set(hits.map(key))
const stale = allowlist.entries.filter((entry) => !liveKeys.has(key(entry)))

if (process.argv.includes('--write-allowlist')) {
  const entries = hits.map((hit) => ({
    file: hit.file,
    snippet: hit.snippet,
    why: 'B1 存量（待迁移到 motion-roles）',
    since: '2026-11-19',
  }))
  writeFileSync(ALLOWLIST, JSON.stringify({ cap: entries.length, entries }, null, 2) + String.fromCharCode(10))
  console.log('[lint:motion] 已写入白名单：' + entries.length + ' 条')
  process.exit(0)
}

let failed = false
for (const hit of violations) {
  failed = true
  console.error('[lint:motion] 手写动效数值 ' + hit.file + ':' + hit.line + '  ' + hit.snippet)
}
for (const entry of stale) {
  failed = true
  console.error('[lint:motion] 白名单失效（该行已不存在）：' + entry.file + '  ' + entry.snippet)
}
if (allowlist.entries.length > allowlist.cap) {
  failed = true
  console.error('[lint:motion] 白名单超上限：' + allowlist.entries.length + ' > ' + allowlist.cap + '（只许减）')
}

const total = hits.length
console.log('[lint:motion] 违规 ' + violations.length + ' 处 · 白名单 ' + allowlist.entries.length + '/' + allowlist.cap + ' · 存量合计 ' + total + ' 处')
process.exit(failed ? 1 : 0)
