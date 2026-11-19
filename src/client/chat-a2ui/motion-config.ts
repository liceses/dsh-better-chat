/**
 * 动效配置：唯一真源是仓库根的 motion.config.json。
 *
 * 构建时由 esbuild 把 JSON 内联进 bundle（发布包不依赖这个文件存在），这里只负责：
 * 类型、兜底与校验。任何一项写坏都只退回该键的默认值 + 一条 issue，
 * 绝不抛错——配置文件不能成为聊天界面白屏的原因。
 *
 * 结构分两层（见 GLOSSARY.md）：
 * - **tokens**：原子取值（弹簧、时长、缓动、距离、错峰、模糊、循环周期）
 * - **roles**：语义角色，只引用 token 名，不写字面量
 */

import raw from '../../../motion.config.json'

export type TextEffectPer = 'word' | 'char' | 'line'
export type TextEffectPresetName = 'blur' | 'fade-in-blur' | 'scale' | 'fade' | 'slide'
export type AnimatedGroupPresetName =
  | 'fade' | 'slide' | 'scale' | 'blur' | 'blur-slide'
  | 'zoom' | 'flip' | 'bounce' | 'rotate' | 'swing'

export interface SpringSpec {
  stiffness: number
  damping: number
  mass: number
}

/** 四段贝塞尔：[x1, y1, x2, y2]。 */
export type EaseSpec = [number, number, number, number]

export interface TextEffectSpec {
  per: TextEffectPer
  preset: TextEffectPresetName
  delay: number
  speedReveal: number
  speedSegment: number
}

/** 原子取值。改观感先改这里，不要改组件。 */
export interface MotionTokens {
  springs: { soft: SpringSpec }
  dur: { xs: number; sm: number; md: number; lg: number; reduced: number }
  ease: { out: EaseSpec; linear: EaseSpec; inOut: EaseSpec }
  dist: { sm: number; md: number }
  stagger: { tight: number; loose: number }
  blur: { stream: number }
  loop: { spin: number; blink: number; pulse: number; orb: number; trail: number }
}

export type SpringToken = keyof MotionTokens['springs']
export type DurToken = keyof MotionTokens['dur']
export type EaseToken = keyof MotionTokens['ease']
export type LoopToken = keyof MotionTokens['loop']

/**
 * 一个语义角色。所有字段都是**引用**（spring/duration/ease/loop）或
 * **属性目标值**（opacity/y/scale/blur/stagger），不出现时长数字。
 */
export interface RoleSpec {
  spring?: SpringToken
  duration?: DurToken
  ease?: EaseToken
  loop?: LoopToken
  opacity?: number
  y?: number
  scale?: number
  blur?: number
  stagger?: number
}

export interface MotionRoles {
  message: { enter: RoleSpec; exit: RoleSpec }
  panel: { collapse: RoleSpec }
  drawer: { resize: RoleSpec }
  dialog: { open: RoleSpec }
  text: { stream: RoleSpec }
  list: { item: RoleSpec }
  empty: { state: RoleSpec }
  affordance: { hover: RoleSpec }
  system: { spin: RoleSpec; blink: RoleSpec }
}

/** 角色全名：JSON 里是嵌套的，代码里用点号读写。 */
export const ROLE_IDS = [
  'message.enter', 'message.exit',
  'panel.collapse', 'drawer.resize', 'dialog.open',
  'text.stream', 'list.item', 'empty.state',
  'affordance.hover', 'system.spin', 'system.blink',
] as const

export type RoleId = typeof ROLE_IDS[number]

export interface MotionConfig {
  tokens: MotionTokens
  roles: MotionRoles
  textEffect: { emptyTitle: TextEffectSpec; blankTitle: TextEffectSpec }
  animatedGroup: { suggestions: { preset: AnimatedGroupPresetName; stagger: number } }
  shimmer: {
    duration: number
    spread: number
    zDistance: number
    xDistance: number
    yDistance: number
    scaleDistance: number
    rotateYDistance: number
  }
  /** 贴底跟随：限速跟随 + 速度相关的底部余量。 */
  scroll: {
    /** 生成期间的最低底部余量（px）。 */
    minMargin: number
    /** 余量上限（占视口比例）。 */
    maxMarginRatio: number
    /** 余量 = 速度 × lead（s）。 */
    lead: number
    /** 起步速度（px/s）、距离增益（1/s）、速度上限（px/s）。 */
    speed: number
    gain: number
    maxSpeed: number
    /** 估速的长时间常数（s）、停止后余量保持（ms）、收回时间常数（s）。 */
    speedTau: number
    holdMs: number
    releaseTau: number
    instantAbove: number
  }
  /** 流式块的高度补充：每帧最多处理多少字、补间速度与时长上下限。 */
  stream: {
    maxChars: number
    clipSpeed: number
    clipMin: number
    clipMax: number
  }
  scramble: { duration: number; speed: number }
  borderTrail: { size: number; duration: number }
  progressiveBlur: { blurLayers: number; blurIntensity: number }
}

/** 出厂值：配置文件缺键 / 写坏时的兜底。改这里等于改默认观感。 */
export const DEFAULT_MOTION: MotionConfig = {
  tokens: {
    springs: { soft: { stiffness: 420, damping: 34, mass: 0.8 } },
    dur: { xs: 0.12, sm: 0.16, md: 0.24, lg: 0.42, reduced: 0.14 },
    ease: { out: [0.22, 1, 0.36, 1], linear: [0, 0, 1, 1], inOut: [0.42, 0, 0.58, 1] },
    dist: { sm: 6, md: 10 },
    stagger: { tight: 0.004, loose: 0.03 },
    blur: { stream: 9 },
    loop: { spin: 0.8, blink: 1.05, pulse: 1.6, orb: 5.4, trail: 5 },
  },
  roles: {
    message: {
      enter: { spring: 'soft', opacity: 0, y: 6 },
      exit: { duration: 'sm', ease: 'out', opacity: 0, y: -4 },
    },
    panel: { collapse: { spring: 'soft' } },
    drawer: { resize: { spring: 'soft' } },
    dialog: { open: { duration: 'sm', ease: 'out', opacity: 0, scale: 0.98 } },
    text: { stream: { duration: 'lg', ease: 'out', blur: 9, stagger: 0.004 } },
    list: { item: { spring: 'soft', opacity: 0, y: 4 } },
    empty: { state: { duration: 'md', ease: 'out', opacity: 0, y: 8, stagger: 0.03 } },
    affordance: { hover: { duration: 'xs', ease: 'out' } },
    system: { spin: { loop: 'spin' }, blink: { loop: 'blink' } },
  },
  textEffect: {
    emptyTitle: { per: 'char', preset: 'blur', delay: 0.1, speedReveal: 1, speedSegment: 1 },
    blankTitle: { per: 'char', preset: 'blur', delay: 0.08, speedReveal: 1, speedSegment: 1 },
  },
  animatedGroup: { suggestions: { preset: 'blur-slide', stagger: 0.1 } },
  shimmer: {
    duration: 1,
    spread: 1,
    zDistance: 10,
    xDistance: 2,
    yDistance: -2,
    scaleDistance: 1.1,
    rotateYDistance: 10,
  },
  scroll: {
    minMargin: 120,
    maxMarginRatio: 0.35,
    lead: 0.4,
    speed: 900,
    gain: 2.6,
    maxSpeed: 2600,
    speedTau: 0.35,
    holdMs: 3200,
    releaseTau: 0.45,
    instantAbove: 1600,
  },
  stream: { maxChars: 140, clipSpeed: 1000, clipMin: 0.12, clipMax: 0.95 },
  scramble: { duration: 0.8, speed: 0.04 },
  borderTrail: { size: 110, duration: 3.4 },
  progressiveBlur: { blurLayers: 6, blurIntensity: 0.32 },
}

const TEXT_PER: readonly TextEffectPer[] = ['word', 'char', 'line']
const TEXT_PRESETS: readonly TextEffectPresetName[] = ['blur', 'fade-in-blur', 'scale', 'fade', 'slide']
const GROUP_PRESETS: readonly AnimatedGroupPresetName[] = [
  'fade', 'slide', 'scale', 'blur', 'blur-slide', 'zoom', 'flip', 'bounce', 'rotate', 'swing',
]

export interface NumberRule { kind: 'number'; min: number; max: number; int?: boolean }
export interface EnumRule { kind: 'enum'; values: readonly string[] }
export interface EaseRule { kind: 'ease' }
export type MotionRule = NumberRule | EnumRule | EaseRule
type Rule = MotionRule

/** 叶子路径 → 校验规则。顺序即 IDE 里读到的顺序，测试会核对与 DEFAULT_MOTION 一致。 */
const RULES: Record<string, Rule> = {}

function num (path: string, min: number, max: number, int = false): void {
  RULES[path] = int === true ? { kind: 'number', min, max, int } : { kind: 'number', min, max }
}

function enm (path: string, values: readonly string[]): void {
  RULES[path] = { kind: 'enum', values }
}

// ---- tokens ----
num('tokens.springs.soft.stiffness', 1, 2000)
num('tokens.springs.soft.damping', 1, 400)
num('tokens.springs.soft.mass', 0.1, 10)
num('tokens.dur.xs', 0, 2)
num('tokens.dur.sm', 0, 2)
num('tokens.dur.md', 0, 2)
num('tokens.dur.lg', 0, 3)
num('tokens.dur.reduced', 0, 1)
RULES['tokens.ease.out'] = { kind: 'ease' }
RULES['tokens.ease.linear'] = { kind: 'ease' }
RULES['tokens.ease.inOut'] = { kind: 'ease' }
num('tokens.dist.sm', -80, 80)
num('tokens.dist.md', -120, 120)
num('tokens.stagger.tight', 0, 1)
num('tokens.stagger.loose', 0, 1)
num('tokens.blur.stream', 0, 40)
num('tokens.loop.spin', 0.1, 6)
num('tokens.loop.blink', 0.1, 6)
num('tokens.loop.pulse', 0.2, 10)
num('tokens.loop.orb', 1, 30)
num('tokens.loop.trail', 0.2, 30)

// ---- roles：从出厂值里遍历叶子，按键名决定规则，避免手写几十行 ----
const ROLE_TOKEN_VALUES: Record<string, readonly string[]> = {
  spring: Object.keys(DEFAULT_MOTION.tokens.springs),
  duration: Object.keys(DEFAULT_MOTION.tokens.dur),
  ease: Object.keys(DEFAULT_MOTION.tokens.ease),
  loop: Object.keys(DEFAULT_MOTION.tokens.loop),
}
const ROLE_NUMBER_RANGES: Record<string, readonly [number, number]> = {
  opacity: [0, 1],
  y: [-120, 120],
  scale: [0.5, 2],
  blur: [0, 40],
  stagger: [0, 1],
}

function collectLeafPaths (value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) return prefix === '' ? [] : [prefix]
  if (typeof value !== 'object' || value === null) return prefix === '' ? [] : [prefix]
  const paths: string[] = []
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    paths.push(...collectLeafPaths(child, prefix === '' ? key : prefix + '.' + key))
  }
  return paths
}

for (const leaf of collectLeafPaths(DEFAULT_MOTION.roles)) {
  const key = leaf.split('.').pop() ?? ''
  const path = 'roles.' + leaf
  const tokenValues = ROLE_TOKEN_VALUES[key]
  if (tokenValues !== undefined) {
    enm(path, tokenValues)
    continue
  }
  const range = ROLE_NUMBER_RANGES[key]
  if (range !== undefined) num(path, range[0], range[1])
}

// ---- 其余效果参数 ----
for (const key of ['emptyTitle', 'blankTitle'] as const) {
  enm('textEffect.' + key + '.per', TEXT_PER)
  enm('textEffect.' + key + '.preset', TEXT_PRESETS)
  num('textEffect.' + key + '.delay', 0, 2)
  num('textEffect.' + key + '.speedReveal', 0.1, 8)
  num('textEffect.' + key + '.speedSegment', 0.1, 8)
}
enm('animatedGroup.suggestions.preset', GROUP_PRESETS)
num('animatedGroup.suggestions.stagger', 0, 1)
num('shimmer.duration', 0.1, 6)
num('shimmer.spread', 0.1, 6)
num('shimmer.zDistance', -60, 60)
num('shimmer.xDistance', -30, 30)
num('shimmer.yDistance', -30, 30)
num('shimmer.scaleDistance', 0.2, 2)
num('shimmer.rotateYDistance', -90, 90)
num('scroll.minMargin', 0, 400)
num('scroll.maxMarginRatio', 0, 1)
num('scroll.lead', 0, 3)
num('scroll.speed', 100, 6000)
num('scroll.gain', 0, 20)
num('scroll.maxSpeed', 200, 12000)
num('scroll.speedTau', 0.05, 4)
num('scroll.holdMs', 0, 6000)
num('scroll.releaseTau', 0.05, 4)
num('scroll.instantAbove', 200, 20000)
num('stream.maxChars', 20, 600, true)
num('stream.clipSpeed', 100, 8000)
num('stream.clipMin', 0.02, 1)
num('stream.clipMax', 0.05, 3)
num('scramble.duration', 0, 5)
num('scramble.speed', 0.005, 0.5)
num('borderTrail.size', 8, 400)
num('borderTrail.duration', 0.2, 20)
num('progressiveBlur.blurLayers', 2, 24, true)
num('progressiveBlur.blurIntensity', 0, 2)

/** 全部可调叶子路径（测试按它核对覆盖）。 */
export const MOTION_PATHS: readonly string[] = Object.keys(RULES)

/**
 * 一次高度变化该用多久补间。
 *
 * 用「速度」而不是固定时长：30px 的变化 0.12s 就够（几乎即时），
 * 500px 的变化自然摊到 0.5s，两者观感一致；再大也不超过 clipMax，
 * 免得刚打开会话时整屏慢慢滑。
 * @param delta - 本次高度变化了多少像素。
 * @returns 秒。
 */
export function clipSeconds (delta: number): number {
  const { clipSpeed, clipMin, clipMax } = MOTION.stream
  const bounded = Math.abs(delta)
  if (!(bounded > 0)) return clipMin
  return Math.min(clipMax, Math.max(clipMin, bounded / clipSpeed))
}

/** 每条路径的区间 / 枚举，供测试与工具复用。 */
export const MOTION_RULES: Readonly<Record<string, Rule>> = RULES

/** 按点路径读值。 */
export function getMotionPath (source: unknown, path: string): unknown {
  let cursor: unknown = source
  for (const key of path.split('.')) {
    if (typeof cursor !== 'object' || cursor === null) return undefined
    cursor = (cursor as Record<string, unknown>)[key]
  }
  return cursor
}

/** 按点路径写值（只在已存在的容器上写；路径不存在则忽略）。 */
export function setMotionPath (target: unknown, path: string, value: unknown): void {
  const keys = path.split('.')
  const last = keys.pop()
  if (last === undefined) return
  let cursor: unknown = target
  for (const key of keys) {
    if (typeof cursor !== 'object' || cursor === null) return
    cursor = (cursor as Record<string, unknown>)[key]
  }
  if (typeof cursor !== 'object' || cursor === null) return
  ;(cursor as Record<string, unknown>)[last] = value
}

/** 深拷贝（草稿要用）。 */
export function cloneMotion (value: MotionConfig): MotionConfig {
  return JSON.parse(JSON.stringify(value)) as MotionConfig
}

export interface NormalizeResult {
  config: MotionConfig
  issues: string[]
}

function isEase (value: unknown): value is EaseSpec {
  if (!Array.isArray(value) || value.length !== 4) return false
  return value.every(item => typeof item === 'number' && Number.isFinite(item))
}

/**
 * 把任意外部 JSON 压成合法配置：逐叶子校验，不合格的退回默认值并记一条 issue。
 * 未知键只告警不写入——配置文件比代码宽松，但不会把垃圾带进运行时。
 */
export function normalizeMotionConfig (input: unknown): NormalizeResult {
  const config = cloneMotion(DEFAULT_MOTION)
  const issues: string[] = []

  for (const path of MOTION_PATHS) {
    const rule = RULES[path]
    if (rule === undefined) continue
    const value = getMotionPath(input, path)
    if (value === undefined) {
      issues.push(path + '：缺失，用默认值')
      continue
    }
    if (rule.kind === 'ease') {
      if (!isEase(value)) {
        issues.push(path + '：需要 [x1,y1,x2,y2]，用默认值')
        continue
      }
      setMotionPath(config, path, value)
      continue
    }
    if (rule.kind === 'number') {
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        issues.push(path + '：不是有限数字，用默认值')
        continue
      }
      if (value < rule.min || value > rule.max) {
        issues.push(path + '：' + value + ' 超出 ' + rule.min + '–' + rule.max + '，用默认值')
        continue
      }
      if (rule.int === true && !Number.isInteger(value)) {
        issues.push(path + '：需要整数，用默认值')
        continue
      }
      setMotionPath(config, path, value)
      continue
    }
    if (typeof value !== 'string' || !rule.values.includes(value)) {
      issues.push(path + '：取值 ' + JSON.stringify(value) + ' 不在可选范围，用默认值')
      continue
    }
    setMotionPath(config, path, value)
  }

  for (const path of collectLeafPaths(input)) {
    if (!(path in RULES)) issues.push(path + '：未知键，已忽略')
  }

  return { config, issues }
}

const normalized = normalizeMotionConfig(raw)

/** 生效中的配置（= 配置文件覆盖在出厂值上）。 */
export const MOTION: MotionConfig = normalized.config

/** 配置文件的问题清单；为空表示配置干净。 */
export const motionIssues: readonly string[] = normalized.issues

if (motionIssues.length > 0 && typeof window !== 'undefined') {
  const report = ['[chat-a2ui] motion.config.json 有问题，已按默认值兜底：']
  for (const issue of motionIssues) report.push('  ' + issue)
  console.warn(report.join(String.fromCharCode(10)))
}

/** 把 ease 数组转成 CSS 的 cubic-bezier()。 */
export function easeToCss (ease: EaseSpec): string {
  return 'cubic-bezier(' + ease.map(value => Number(value.toFixed(3))).join(', ') + ')'
}

/**
 * 把动效令牌写成 CSS 变量。
 * 三处根都要挂：聊天视图、主面板、左栏列表是三个独立子树。
 */
export function motionCssVars (config: MotionConfig = MOTION): string {
  const roots = '.caui-root, .caui-chat-page, .caui-chat-list'
  const { tokens } = config
  const lines = [
    '  --caui-dur-xs: ' + tokens.dur.xs + 's;',
    '  --caui-dur-sm: ' + tokens.dur.sm + 's;',
    '  --caui-dur-md: ' + tokens.dur.md + 's;',
    '  --caui-dur-lg: ' + tokens.dur.lg + 's;',
    '  --caui-dur-reduced: ' + tokens.dur.reduced + 's;',
    '  --caui-ease-out: ' + easeToCss(tokens.ease.out) + ';',
    '  --caui-ease-linear: ' + easeToCss(tokens.ease.linear) + ';',
    '  --caui-blur-stream: ' + tokens.blur.stream + 'px;',
    '  --caui-loop-spin: ' + tokens.loop.spin + 's;',
    '  --caui-loop-blink: ' + tokens.loop.blink + 's;',
    '  --caui-loop-pulse: ' + tokens.loop.pulse + 's;',
    '  --caui-loop-orb: ' + tokens.loop.orb + 's;',
    // 旧变量名保留：样式表里已有引用，等 B3 清理完再删。
    '  --caui-motion-caret: ' + tokens.loop.blink + 's;',
    '  --caui-motion-pulse: ' + tokens.loop.pulse + 's;',
    '  --caui-motion-spin: ' + tokens.loop.spin + 's;',
    '  --caui-motion-orb: ' + tokens.loop.orb + 's;',
  ]
  return roots + ' {\n' + lines.join('\n') + '\n}\n'
}
