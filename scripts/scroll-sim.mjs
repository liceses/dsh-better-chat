/**
 * 跟随核心算法的离线验证（不碰浏览器）。
 *
 *   npm run sim:scroll
 *
 * 按 60fps 把 scroll-follow 的纯函数在几种「宿主投喂模式」下跑一遍，检查三件事：
 *   1. 单帧位移 ≤ maxSpeed × dt（与一次投喂多少像素无关）
 *   2. 方向基本单调（不上下抖）
 *   3. 停下来之后落回真底部
 *
 * 任何一条不满足就以非零码退出——这样它既是报告，也是门禁。
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createFollowState, stepFollow } from '../src/client/chat-a2ui/scroll-follow.ts'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const config = JSON.parse(readFileSync(join(root, 'motion.config.json'), 'utf8')).scroll

const VIEWPORT = 505
const FRAME = 1000 / 60

function simulate (batches, intervalMs) {
  const initialHeight = 4000
  let state = createFollowState(0, initialHeight, initialHeight - VIEWPORT)
  let height = initialHeight
  let index = 0
  let previous = state.position
  let lastSign = 0
  let flips = 0
  const moves = []
  const margins = []
  const total = intervalMs * batches.length + 8000
  for (let at = FRAME; at <= total; at += FRAME) {
    while (index < batches.length && at >= index * intervalMs) {
      height += batches[index]
      index += 1
    }
    const result = stepFollow(state, { height, viewport: VIEWPORT, at, config })
    state = result.state
    const move = result.position - previous
    previous = result.position
    if (Math.abs(move) >= 0.5) moves.push(Math.abs(move))
    const sign = Math.sign(move)
    if (sign !== 0 && lastSign !== 0 && sign !== lastSign) flips += 1
    if (sign !== 0) lastSign = sign
    if (at > 500 && at <= intervalMs * batches.length) margins.push(result.margin)
  }
  const sorted = [...moves].sort((a, b) => a - b)
  return {
    maxMove: sorted[sorted.length - 1] ?? 0,
    p95: sorted[Math.floor(sorted.length * 0.95)] ?? 0,
    marginMin: margins.length === 0 ? 0 : Math.min(...margins),
    marginMax: margins.length === 0 ? 0 : Math.max(...margins),
    finalGap: Math.max(0, height - previous - VIEWPORT),
    flips,
  }
}

const patterns = [
  ['token 级（每帧 20px）', Array(400).fill(20), FRAME],
  ['60px / 100ms', Array(80).fill(60), 100],
  ['135px / 500ms', Array(30).fill(135), 500],
  ['250px / 1s', Array(20).fill(250), 1000],
  ['500px / 2s', Array(10).fill(500), 2000],
  ['900px / 3s（整段）', Array(6).fill(900), 3000],
  ['停顿后 400px', [400, 400, 0, 0, 400, 400, 0, 0, 400], 3000],
]

const limit = config.maxSpeed * (FRAME / 1000) + 1
const rows = []
let failed = 0
console.log('模式 | maxMove | p95 | marginMin | marginMax | finalGap | 方向反转')
for (const [label, batches, interval] of patterns) {
  const r = simulate(batches, interval)
  rows.push({ label, ...r })
  const bad = r.maxMove > limit || r.flips > 8 || r.finalGap > 1
  if (bad) failed += 1
  console.log(
    label + ' | ' + Math.round(r.maxMove) + ' | ' + Math.round(r.p95) + ' | ' +
    Math.round(r.marginMin) + ' | ' + Math.round(r.marginMax) + ' | ' + r.finalGap + ' | ' + r.flips + (bad ? '  ✗' : ''),
  )
}
console.log('')
console.log('上限 maxSpeed×dt = ' + limit.toFixed(1) + 'px；' + (failed === 0 ? '全部通过' : failed + ' 个模式未通过'))
process.exit(failed === 0 ? 0 : 1)
