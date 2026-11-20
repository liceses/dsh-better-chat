/**
 * 样式按表面拆分（style.ts → styles/*.ts）的四条不变量。
 *
 * 1. 规则集合：拆分前后逐条相同。fixture 是拆分前 CHAT_CSS 的原样快照，
 *    这条证明「只搬家，没改一条选择器 / 一条声明」，是本次拆分最重要的验收。
 * 2. 类名一致：CSS 里出现的 .caui-* 都能在 classes.ts 找到；
 *    vendor 原语与写在组件里的字面量类名逐条白名单并注明原因。
 * 3. 无死类名：classes.ts 的每个值都能在 CSS 里命中；
 *    已知「有类名没样式」的冻结成清单，只许减少，不许新增。
 * 4. 组合顺序：base → flow → composer → list → lightbox → misc → P0.6。
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { cls } from '../src/client/chat-a2ui/classes'
import { CHAT_VIEW_ID } from '../src/client/constants'
import { CHAT_CSS } from '../src/client/chat-a2ui/style'
import { P06_CSS } from '../src/client/chat-a2ui/style-p06'
import { BASE_CSS } from '../src/client/chat-a2ui/styles/base'
import { COMPOSER_CSS } from '../src/client/chat-a2ui/styles/composer'
import { FLOW_CSS } from '../src/client/chat-a2ui/styles/flow'
import { LIGHTBOX_CSS } from '../src/client/chat-a2ui/styles/lightbox'
import { LIST_CSS } from '../src/client/chat-a2ui/styles/list'
import { MISC_CSS } from '../src/client/chat-a2ui/styles/misc'

/** 拆分前 CHAT_CSS 的原样快照，拆分当天用旧 style.ts 里的模板串直接落盘。 */
const BEFORE = readFileSync(join(import.meta.dirname, 'fixtures', 'style-before.txt'), 'utf8')

/** 仓库开着 core.autocrlf，fixture 检出后可能是 CRLF：比较前统一换行。 */
const lf = (css: string): string => css.replace(/\r\n?/g, '\n')

/** 按 } 切成规则、trim、排序 —— 与书写顺序无关的多重集合比较。 */
const rules = (css: string): string[] =>
  lf(css).split('}').map(rule => rule.trim()).sort()

/** CSS 里出现的类名（去重、排序）。 */
const CHAT_CLASS = /\.caui-[a-z0-9-]+/g
const cssClassNames = (css: string): string[] =>
  [...new Set([...lf(css).matchAll(CHAT_CLASS)].map(match => match[0].slice(1)))].sort()

/** classes.ts 里的全部类名：一个值可能带多个 class（'caui-flow-blur caui-flow-blur-top'）。 */
const TABLE_CLASSES = [...new Set(Object.values(cls).flatMap(value => value.split(/\s+/).filter(Boolean)))].sort()

/** 六个样式块，顺序即拼接顺序。 */
const BUCKETS: ReadonlyArray<readonly [string, string]> = [
  ['base', BASE_CSS],
  ['flow', FLOW_CSS],
  ['composer', COMPOSER_CSS],
  ['list', LIST_CSS],
  ['lightbox', LIGHTBOX_CSS],
  ['misc', MISC_CSS],
]

/**
 * 有样式、但类名不在 classes.ts 里的类 —— 只有两类，都逐条注明出处。
 *
 * A. vendor 动效原语：类名以字面量写在 motion-primitives/vendor/*.tsx 里。
 * B. 写在组件里而不是类名表里的字面量（Markdown 的流式包裹层、读屏副本）。
 */
const LITERAL_CLASSES = new Map<string, string>([
  ['caui-text-effect', 'vendor TextEffect 根节点（字面量挂载）'],
  ['caui-text-effect-line', 'vendor TextEffect 按行分段'],
  ['caui-text-effect-segment', 'vendor TextEffect 按段分段'],
  ['caui-text-effect-char', 'vendor TextEffect 逐字'],
  ['caui-text-scramble', 'vendor TextScramble 根节点（暂未使用，样式与组件都保留）'],
  ['caui-shimmer-char', 'vendor TextShimmerWave 逐字'],
  ['caui-progressive-blur', 'vendor ProgressiveBlur 根节点'],
  ['caui-progressive-blur-layer', 'vendor ProgressiveBlur 的渐隐层'],
  ['caui-border-trail', 'vendor BorderTrail 根节点（暂未使用，样式与组件都保留）'],
  ['caui-border-trail-dot', 'vendor BorderTrail 的流光点'],
  ['caui-sr-only', 'vendor TextEffect 的读屏副本'],
  ['caui-md-clip', 'Markdown.tsx 的流式包裹层字面量'],
  ['caui-md-clip-animated', 'Markdown.tsx 的流式高度补间开关'],
  ['caui-md-stream-char', 'Markdown.tsx 导出的 STREAM_CHAR_CLASS 常量'],
  // 只有样式、没有组件挂载的历史类名：拆分时只许搬家，不许顺手删。
  ['caui-' + CHAT_VIEW_ID + '-dot', '侧栏 Chat 行的状态点，当前无组件挂载（历史遗留样式）'],
])

/**
 * 有类名、但 CSS 里没有对应规则的类（classes.ts 里没人用的值）。
 *
 * 冻结清单：只许减少。真要新增一条，先把样式补上；
 * 反过来清理掉某条时，把这里的条目一起删掉，测试会提醒。
 */
const UNSTYLED_CLASSES = new Map<string, string>([
  ['caui-empty-title-text', '空态标题的文本层，P0.6 换成 TextEffect 的 caui-text-effect'],
  ['caui-flow-blur-top', '顶部渐隐由 .caui-flow-blur + 变量表达，没有 -top 规则（-bottom 才有）'],
  ['caui-chat-list-wide', 'ChatSessionList 挂的宽栏变体，没有对应样式'],
  ['caui-chat-list-empty', '会话列表 v2 家族：组件已改用 caui-chat-row 家族'],
  ['caui-chat-list-empty-title', '会话列表 v2 家族：同上'],
  ['caui-chat-list-empty-hint', '会话列表 v2 家族：同上'],
  ['caui-chat-list-item', '会话列表 v2 家族：同上'],
  ['caui-chat-list-item-active', '会话列表 v2 家族：同上'],
  ['caui-chat-list-item-main', '会话列表 v2 家族：同上'],
  ['caui-chat-list-item-title', '会话列表 v2 家族：同上'],
  ['caui-chat-list-item-meta', '会话列表 v2 家族：同上'],
  ['caui-chat-list-error', '会话列表 v2 家族：同上'],
  ['caui-chat-list-retry', '会话列表 v2 家族：同上'],
  ['caui-chat-panel-icon-active', '侧栏 Chat 图标激活态：激活由 caui-chat-row-active 表达'],
])

describe('样式按表面拆分', () => {
  it('规则集合与拆分前完全相同：只搬家，没改规则', () => {
    const before = rules(BEFORE)
    const after = rules(CHAT_CSS)
    // 防呆：@media / @supports / @keyframes 的嵌套块也会切出片段，但总条数必须够多，
    // 否则正则或读文件失效时这条门禁会空转通过。
    expect(before.length).toBeGreaterThan(231)
    expect(after.length).toBe(before.length)
    // 先给可读的差集，再用排序后的全量比较兜底（多重集合相等）。
    expect({
      拆分后丢掉: after.filter(rule => !before.includes(rule)),
      拆分后多出: before.filter(rule => !after.includes(rule)),
    }).toEqual({ 拆分后丢掉: [], 拆分后多出: [] })
    expect(after).toEqual(before)
  })

  it('组合层：六块按固定顺序拼接 + P0.6 视觉层', () => {
    expect(CHAT_CSS).toBe(BUCKETS.map(([, css]) => css).join('\n') + P06_CSS)
  })

  it('拼接顺序：base → flow → composer → list → lightbox → misc → P0.6', () => {
    const positions = BUCKETS.map(([name, css]) => ({ name, at: CHAT_CSS.indexOf(css) }))
    for (const { name, at } of positions) {
      expect(at, name + ' 整块没有出现在 CHAT_CSS 里').toBeGreaterThanOrEqual(0)
      expect(name.length, name + ' 这个名字不该为空').toBeGreaterThan(0)
    }
    for (let index = 1; index < positions.length; index += 1) {
      const previous = positions[index - 1]!
      const current = positions[index]!
      // 前一块的起点必须早于后一块的起点（每一块都是独立子串，indexOf 就是它的位置）
      expect(current.at, previous.name + ' 必须排在 ' + current.name + ' 之前').toBeGreaterThan(previous.at)
    }
    const last = positions[positions.length - 1]!
    expect(last.name).toBe('misc')
    expect(CHAT_CSS.slice(last.at + MISC_CSS.length), 'P0.6 必须原样接在最后').toBe(P06_CSS)
  })

  it('CSS 里的每个类名都能在 classes.ts 找到（vendor / 字面量白名单除外）', () => {
    const used = cssClassNames(CHAT_CSS)
    expect(used.length).toBeGreaterThan(100)
    const unknown = used.filter(name => !TABLE_CLASSES.includes(name) && !LITERAL_CLASSES.has(name))
    expect(unknown, '这些类名有样式但 classes.ts 里没有：' + unknown.join(', ')).toEqual([])
  })

  it('白名单不过期：条目仍在 CSS 里，且确实不在 classes.ts 里', () => {
    const used = new Set(cssClassNames(CHAT_CSS))
    for (const name of LITERAL_CLASSES.keys()) {
      expect(used.has(name), name + ' 已经不在 CSS 里，把它从 LITERAL_CLASSES 删掉').toBe(true)
      expect(TABLE_CLASSES.includes(name), name + ' 已经进了 classes.ts，把它从 LITERAL_CLASSES 删掉').toBe(false)
    }
  })

  it('没有死类名：classes.ts 的每个值都能在 CSS 里命中', () => {
    const used = new Set(cssClassNames(CHAT_CSS))
    const unstyled = TABLE_CLASSES.filter(name => !used.has(name))
    const known = [...UNSTYLED_CLASSES.keys()].sort()
    expect(unstyled, 'unstyled 与 UNSTYLED_CLASSES 不一致：多出的要先补样式，清掉的要把条目一起删').toEqual(known)
    for (const name of known) {
      expect(TABLE_CLASSES.includes(name), name + ' 已经不在 classes.ts 里，把它从 UNSTYLED_CLASSES 删掉').toBe(true)
    }
  })
})
