/**
 * 样式按表面拆分（style.ts → styles/*.ts）+ P0.6 并回表面（style-p06.ts → styles/*.ts）。
 *
 * 五条不变量，按重要性排序：
 *
 * 1. 规则集合：与拆分前的基线逐条相同 —— 基线是拆分前 CHAT_CSS 的原样快照，
 *    合并 P0.6 之后唯一允许的差异是 B（抽屉宽度让给 framer），并且这条差异
 *    必须以显式常量的形式写在下面，多一条少一条都红。
 * 2. 级联等价：在每一种「视口宽度 × 媒体特性」状态里，对每个 (选择器, 属性)
 *    取按文档顺序最后一条生效声明，算出的最终值新旧必须完全一致。
 *    这是「P0.6 并回表面后谁覆盖谁没变」的唯一直接证据。
 * 3. 组合层：六块按 base → flow → composer → list → lightbox → misc 拼接，
 *    末尾不再接第七块。
 * 4. P0.6 已并回：style-p06.ts 不存在，也没有任何 import 指向它。
 * 5. 类名一致、无死类名、!important 只剩 5 处（原来第 6 处是 B 删掉的抽屉宽度）。
 *
 * 段比较一律先「去注释 + 折叠空白」：注释随规则搬家，位置变了不算改动；
 * 真正的改动只有选择器与声明。
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import { cls } from '../src/client/chat-a2ui/classes'
import { CHAT_VIEW_ID } from '../src/client/constants'
import { CHAT_CSS } from '../src/client/chat-a2ui/style'
import { BASE_CSS } from '../src/client/chat-a2ui/styles/base'
import { COMPOSER_CSS } from '../src/client/chat-a2ui/styles/composer'
import { FLOW_CSS } from '../src/client/chat-a2ui/styles/flow'
import { LIGHTBOX_CSS } from '../src/client/chat-a2ui/styles/lightbox'
import { LIST_CSS } from '../src/client/chat-a2ui/styles/list'
import { MISC_CSS } from '../src/client/chat-a2ui/styles/misc'

const ROOT = join(import.meta.dirname, '..')

/**
 * 拆分前 CHAT_CSS 的原样快照，拆分当天用旧 style.ts 里的模板串直接落盘。
 * 它的文档顺序就是合并前的旧组合：base → flow → composer → list → lightbox → misc，
 * 末尾接 P0.6 整层 —— 所以级联等价性直接拿它当「旧组合」的基准。
 */
const BEFORE = readFileSync(join(import.meta.dirname, 'fixtures', 'style-before.txt'), 'utf8')

/** 仓库开着 core.autocrlf，fixture 检出后可能是 CRLF：比较前统一换行。 */
const lf = (css: string): string => css.replace(/\r\n?/g, '\n')

/** 整段删掉注释：注释随规则搬家，位置变了不算改动（注释里的花括号也不许影响配对）。 */
const withoutComments = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, '')

/** 把空白折叠成单空格 —— 只看选择器与声明的实际内容。 */
const squash = (css: string): string => withoutComments(css).replace(/\s+/g, ' ').trim()

/**
 * 先删注释、再按 } 切成规则段、归一化、排序 —— 与书写顺序无关的多重集合。
 * @keyframes / @media 的内层也都落在这里，所以它同时看住「块不能被拆」这条约定。
 */
const rules = (css: string): string[] => withoutComments(lf(css)).split('}').map(squash).sort()

/**
 * 把样式表摊成「外层上下文 | 选择器 | 声明」的清单。
 *
 * 与「按 } 切段」相比，它**不受规则被搬进哪个 @media 块影响**：这正是
 * 「按表面归位」需要的判据——搬动分组不算改动，改选择器或声明才算。
 * @keyframes 不参与层叠，跳过。
 * @param css - 一份样式表文本。
 * @returns 每条规则的清单项（含 @media / @supports 的条件链）。
 */
function inventory (css: string): string[] {
  const source = withoutComments(lf(css))
  const out: string[] = []
  const walk = (text: string, context: string[]): void => {
    let index = 0
    while (index < text.length) {
      const open = text.indexOf('{', index)
      if (open < 0) return
      const head = squash(text.slice(index, open))
      if (head.startsWith('@')) {
        let depth = 1
        let cursor = open + 1
        while (cursor < text.length && depth > 0) {
          if (text[cursor] === '{') depth += 1
          else if (text[cursor] === '}') depth -= 1
          cursor += 1
        }
        const inner = text.slice(open + 1, cursor - 1)
        if (!head.startsWith('@keyframes')) walk(inner, context.concat(head))
        index = cursor
        continue
      }
      const close = text.indexOf('}', open)
      if (close < 0) return
      const body = squash(text.slice(open + 1, close))
      out.push((context.length === 0 ? '' : context.join(' >> ') + ' | ') + head + ' | ' + body)
      index = close + 1
    }
  }
  walk(source, [])
  return out.sort()
}

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
 * 唯一允许的规则段差异（B：抽屉宽度改由 framer 独占）。
 *
 * 左边是旧组合里 .caui-chat-dock 在 @media (max-width: 900px) 中的规则段，
 * 右边是去掉 width 的 !important 声明、补上 max-width 之后的同一段。
 * 任何其它段落差异都会让下面的断言报出具体文字。
 */
const EXPECTED_RULE_DIFF = {
  删掉: ['.caui-chat-dock { position: absolute; z-index: 20; top: 0; right: 0; bottom: 0; width: min(88vw, 360px) !important; box-shadow: var(--caui-shadow);'],
  多出: ['.caui-chat-dock { position: absolute; z-index: 20; top: 0; right: 0; bottom: 0; max-width: min(88vw, 360px); box-shadow: var(--caui-shadow);'],
}

/** 未声明的哨兵：级联比较里用字面量区分「没有这条声明」，避免 undefined 与缺失混淆。 */
const ABSENT = '（无声明）'

/**
 * 级联等价性里唯一允许的差异，与 EXPECTED_RULE_DIFF 是同一条改动：
 * 补上的 max-width 与删掉的 width（按 key 排序，max-width 在前）。
 */
const CASCADE_ALLOWANCE = [
  { key: '.caui-chat-dock | max-width', before: ABSENT, after: 'min(88vw, 360px)' },
  { key: '.caui-chat-dock | width', before: 'min(88vw, 360px) !important', after: ABSENT },
]

/** 合并后 P0.6 的 124 条规则分别落进的块（写下来是为了让「搬去哪了」可复核）。 */
const P06_SPLIT: ReadonlyArray<readonly [string, number]> = [
  ['base', 16],
  ['flow', 56],
  ['composer', 4],
  ['list', 22],
  ['lightbox', 0],
  ['misc', 26],
]

interface Declaration {
  /** 外层的 @media / @supports 前奏，由外到内。 */
  conditions: string[]
  selector: string
  property: string
  value: string
}

interface CssNode {
  prelude: string
  body: string
}

/** 扫一段 CSS，产出顶层条目。这份样式表里没有字符串内的花括号，去注释后配对即可。 */
function nodes (source: string): CssNode[] {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, '')
  const out: CssNode[] = []
  let index = 0
  while (index < css.length) {
    const open = css.indexOf('{', index)
    if (open < 0) break
    const prelude = squash(css.slice(index, open))
    let depth = 0
    let cursor = open
    while (cursor < css.length) {
      if (css[cursor] === '{') depth += 1
      else if (css[cursor] === '}') {
        depth -= 1
        if (depth === 0) break
      }
      cursor += 1
    }
    out.push({ prelude, body: css.slice(open + 1, cursor) })
    index = cursor + 1
  }
  return out
}

/**
 * 把样式表摊成声明列表。
 * @keyframes 不参与层叠（它不产生任何 (选择器, 属性) 的值），整块跳过。
 */
function declarations (css: string, conditions: string[] = [], out: Declaration[] = []): Declaration[] {
  for (const node of nodes(css)) {
    if (node.prelude.startsWith('@keyframes')) continue
    if (node.prelude.startsWith('@')) {
      declarations(node.body, [...conditions, node.prelude], out)
      continue
    }
    for (const selector of node.prelude.split(',').map(squash).filter(Boolean)) {
      for (const piece of node.body.split(';')) {
        const cut = piece.indexOf(':')
        if (cut < 0) continue
        const property = piece.slice(0, cut).trim()
        const value = squash(piece.slice(cut + 1))
        if (property === '' || value === '') continue
        out.push({ conditions, selector, property, value })
      }
    }
  }
  return out
}

/** @media (max-width: Npx) 的断点；其它条件（媒体特性 / @supports）按环境位处理。 */
function widthOf (condition: string): number | null {
  const match = /^@media \(max-width: (\d+)px\)$/.exec(condition)
  return match === null ? null : Number(match[1])
}

/** 视口抽样：每个断点的两侧都要取到，单调性（640 ⊂ 900）由真实宽度值自然保证。 */
const WIDTHS = [320, 400, 480, 560, 640, 641, 700, 767, 850, 900, 901, 1024, 1280, 1600]

/** 某一状态下每个 (选择器, 属性) 的最终生效值：文档顺序里最后一条生效的声明获胜。 */
function effective (decls: Declaration[], viewport: number, flags: ReadonlySet<string>): Map<string, string> {
  const map = new Map<string, string>()
  for (const decl of decls) {
    const active = decl.conditions.every(condition => {
      const limit = widthOf(condition)
      return limit === null ? flags.has(condition) : viewport <= limit
    })
    if (active) map.set(decl.selector + ' | ' + decl.property, decl.value)
  }
  return map
}

/**
 * 枚举全部「视口 × 媒体特性」状态，返回新旧两组声明的差异条目（去重、排序）。
 *
 * 模型边界：只按「同一个选择器文本」比较，不展开选择器之间的特异性关系。
 * 对这次合并够用 —— P0.6 的规则几乎都是重声明各块已有的同名选择器，
 * 跨选择器的相撞（例如 .caui-tool-header .caui-tool-name 压 .caui-tool-name）
 * 靠特异性本来就与先后无关。
 */
function cascadeDiff (before: Declaration[], after: Declaration[]): Array<{ key: string, before: string, after: string }> {
  const flags = [...new Set([...before, ...after].flatMap(decl => decl.conditions).filter(condition => widthOf(condition) === null))].sort()
  const found = new Map<string, { key: string, before: string, after: string }>()
  for (const viewport of WIDTHS) {
    for (let mask = 0; mask < 2 ** flags.length; mask += 1) {
      const active = new Set(flags.filter((_, index) => ((mask >> index) & 1) === 1))
      const oldValues = effective(before, viewport, active)
      const newValues = effective(after, viewport, active)
      for (const key of new Set([...oldValues.keys(), ...newValues.keys()])) {
        const oldValue = oldValues.get(key) ?? ABSENT
        const newValue = newValues.get(key) ?? ABSENT
        if (oldValue === newValue) continue
        found.set(key + '\u0000' + oldValue + '\u0000' + newValue, { key, before: oldValue, after: newValue })
      }
    }
  }
  return [...found.values()].sort((a, b) => a.key.localeCompare(b.key))
}

/** CSS 里出现的类名（去重、排序）。 */
const CHAT_CLASS = /\.caui-[a-z0-9-]+/g
const cssClassNames = (css: string): string[] =>
  [...new Set([...lf(css).matchAll(CHAT_CLASS)].map(match => match[0].slice(1)))].sort()

/** classes.ts 里的全部类名：一个值可能带多个 class（'caui-flow-blur caui-flow-blur-top'）。 */
const TABLE_CLASSES = [...new Set(Object.values(cls).flatMap(value => value.split(/\s+/).filter(Boolean)))].sort()

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

/** 递归收集会被打进产物的源码（src / tests / scripts），用于「没有 import 指向 P0.6」。 */
function sourceFiles (): string[] {
  const out: string[] = []
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = join(dir, entry.name)
      if (entry.isDirectory()) walk(abs)
      else if (/\.(ts|tsx|mjs|cjs|js)$/.test(entry.name)) out.push(abs)
    }
  }
  for (const dir of ['src', 'tests', 'scripts']) walk(join(ROOT, dir))
  return out
}

describe('样式按表面拆分 + P0.6 并回表面', () => {
  it('规则清单（选择器 + 声明 + 条件链）与拆分前的基线相同，只允许 B 那一条改动', () => {
    const before = inventory(BEFORE)
    const after = inventory(CHAT_CSS)
    // 防呆：清单必须够多，否则解析失效时这条门禁会空转通过。
    expect(before.length).toBeGreaterThan(200)
    const removed = before.filter(rule => !after.includes(rule))
    const added = after.filter(rule => !before.includes(rule))
    // 这条基线守的是「拆分没有弄丢/改动任何规则」，不禁止**新增**规则：
    // 新功能加样式是正常的，新增的规则在别处评审。
    expect(removed).toHaveLength(1)
    expect(removed[0]).toContain('.caui-chat-dock')
    expect(removed[0]).toContain('width: min(88vw, 360px) !important')
    const dockAdded = added.filter(rule => rule.includes('.caui-chat-dock'))
    expect(dockAdded).toHaveLength(1)
    expect(dockAdded[0]).toContain('max-width: min(88vw, 360px)')
    expect(EXPECTED_RULE_DIFF.删掉[0]).toContain('width: min(88vw, 360px) !important')
    // 新增规则不在这里判定：这条基线守的是「拆分没有弄丢/改动任何规则」，
    // 新功能加样式是正常的（新增的规则由 code review 与级联回归分别看）。
  })

  it('级联回归：基线里已有的每个（选择器, 属性）生效值都不变（允许新增规则）', () => {
    const diff = cascadeDiff(declarations(BEFORE), declarations(CHAT_CSS))
    // 这条守的是「已有规则没有被改坏」：只允许 B 的那一对差异；
    // 基线里不存在的 (选择器, 属性) 属于新增功能，不在此处判定。
    const allowanceKeys = new Set(CASCADE_ALLOWANCE.map(entry => entry.key))
    const regressions = diff.filter(entry => entry.before !== ABSENT && !allowanceKeys.has(entry.key))
    expect(regressions).toEqual([])
    // 允许清单本身仍然成立（B 的 width→max-width）。
    for (const entry of CASCADE_ALLOWANCE) {
      expect(diff.find(item => item.key === entry.key)).toEqual(entry)
    }
  })

  it('组合层：六块按固定顺序拼接，末尾不再接任何东西', () => {
    expect(CHAT_CSS).toBe(BUCKETS.map(([, css]) => css).join('\n'))
  })

  it('拼接顺序：base → flow → composer → list → lightbox → misc', () => {
    const positions = BUCKETS.map(([name, css]) => ({ name, at: CHAT_CSS.indexOf(css) }))
    for (const { name, at } of positions) {
      expect(at, name + ' 整块没有出现在 CHAT_CSS 里').toBeGreaterThanOrEqual(0)
    }
    for (let index = 1; index < positions.length; index += 1) {
      const previous = positions[index - 1]!
      const current = positions[index]!
      // 前一块的起点必须早于后一块的起点（每一块都是独立子串，indexOf 就是它的位置）
      expect(current.at, previous.name + ' 必须排在 ' + current.name + ' 之前').toBeGreaterThan(previous.at)
    }
    const last = positions[positions.length - 1]!
    expect(last.name).toBe('misc')
    expect(CHAT_CSS.slice(last.at + MISC_CSS.length), 'misc 之后不许再接第七块').toBe('')
  })

  it('P0.6 那一层已经并回各表面：文件不存在，也没有任何地方 import 它', () => {
    const rel = 'src/client/chat-a2ui/style-p06.ts'
    expect(existsSync(join(ROOT, rel)), rel + ' 应该已经删除').toBe(false)
    // 找 import / export … from 与动态 import 里对 style-p06 的引用（本条断言自己不算）。
    const pattern = /from\s+['"][^'"\n]*style-p06['"]|import\(\s*['"][^'"\n]*style-p06['"]/
    const offenders = sourceFiles()
      .filter(file => pattern.test(readFileSync(file, 'utf8')))
      .map(file => relative(ROOT, file).replaceAll('\\', '/'))
    expect(offenders, '这些文件还在引用 style-p06：' + offenders.join(', ')).toEqual([])
  })

  it('P0.6 的 124 条规则全部并回六个块，没有遗留第七块', () => {
    expect(P06_SPLIT.reduce((sum, [, count]) => sum + count, 0)).toBe(124)
    // 除灯箱外每块都要留下玻璃层的痕迹（P0.6 没有灯箱规则，lightbox 计 0）。
    for (const [name, count] of P06_SPLIT) {
      if (count === 0) continue
      const css = BUCKETS.find(([bucket]) => bucket === name)![1]
      expect(/--caui-glass-|caui-text-effect|caui-orb-breathe/.test(css), name + ' 里看不到 P0.6 的痕迹').toBe(true)
    }
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

  it('!important 只剩 5 处：P0.6 并回后没有多出来的重量级声明', () => {
    const important = withoutComments(CHAT_CSS).match(/!important/g) ?? []
    // 5 处：composer 藏嵌输入框、flow 两条 reduced 档 animation、misc 的 1ms 过渡、
    // misc 里隐藏权限模式按钮（原 P0.6）。原来第 6 处是 B 删掉的抽屉宽度。
    expect(important).toHaveLength(5)
  })
})
