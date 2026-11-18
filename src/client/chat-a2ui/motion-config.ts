/**
 * 动效配置：唯一真源是仓库根的 motion.config.json。
 *
 * 构建时由 esbuild 把 JSON 内联进 bundle（发布包不依赖这个文件存在），这里只负责：
 * 类型、兜底与校验。任何一项写坏都只退回该键的默认值 + 一条 issue，
 * 绝不抛错——配置文件不能成为聊天界面白屏的原因。
 */

import raw from '../../../motion.config.json'

export type EaseName = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut'
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

export interface TextEffectSpec {
  per: TextEffectPer
  preset: TextEffectPresetName
  delay: number
  speedReveal: number
  speedSegment: number
}

export interface MotionConfig {
  springs: { row: SpringSpec; layout: SpringSpec; collapse: SpringSpec }
  row: {
    enter: { opacity: number; y: number }
    exit: { opacity: number; y: number; duration: number; ease: EaseName }
  }
  css: { caretBlink: number; pulse: number; spin: number; orb: number }
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
  /** 贴底跟随：补间基准时长、最长时长、超过多少像素就直接落位（切会话那种跨度）。 */
  scroll: { duration: number; maxDuration: number; instantAbove: number }
  /** 流式尾巴的模糊渐入：模糊半径、单字时长、相邻字错开、每帧最多处理多少字。 */
  stream: { blur: number; duration: number; stagger: number; maxChars: number; clipDuration: number }
  scramble: { duration: number; speed: number }
  borderTrail: { size: number; duration: number }
  progressiveBlur: { blurLayers: number; blurIntensity: number }
}

/** 出厂值：配置文件缺键 / 写坏时的兜底。改这里等于改默认观感。 */
export const DEFAULT_MOTION: MotionConfig = {
  springs: {
    row: { stiffness: 420, damping: 34, mass: 0.8 },
    layout: { stiffness: 420, damping: 34, mass: 0.8 },
    collapse: { stiffness: 420, damping: 34, mass: 0.8 },
  },
  row: {
    enter: { opacity: 0, y: 6 },
    exit: { opacity: 0, y: -6, duration: 0.16, ease: 'easeOut' },
  },
  css: { caretBlink: 1.05, pulse: 1.6, spin: 0.8, orb: 5.4 },
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
  scroll: { duration: 0.34, maxDuration: 0.62, instantAbove: 1600 },
  stream: { blur: 9, duration: 0.42, stagger: 0.004, maxChars: 140, clipDuration: 0.24 },
  scramble: { duration: 0.8, speed: 0.04 },
  borderTrail: { size: 110, duration: 3.4 },
  progressiveBlur: { blurLayers: 6, blurIntensity: 0.32 },
}

const EASE_NAMES: readonly EaseName[] = ['linear', 'easeIn', 'easeOut', 'easeInOut']
const TEXT_PER: readonly TextEffectPer[] = ['word', 'char', 'line']
const TEXT_PRESETS: readonly TextEffectPresetName[] = ['blur', 'fade-in-blur', 'scale', 'fade', 'slide']
const GROUP_PRESETS: readonly AnimatedGroupPresetName[] = [
  'fade', 'slide', 'scale', 'blur', 'blur-slide', 'zoom', 'flip', 'bounce', 'rotate', 'swing',
]

export interface NumberRule { kind: 'number'; min: number; max: number; int?: boolean }
export interface EnumRule { kind: 'enum'; values: readonly string[] }
export type MotionRule = NumberRule | EnumRule
type Rule = MotionRule

/** 叶子路径 → 校验规则。顺序即 IDE 里读到的顺序，测试会核对与 DEFAULT_MOTION 一致。 */
const RULES: Record<string, Rule> = {}

function num (path: string, min: number, max: number, int = false): void {
  RULES[path] = int === true ? { kind: 'number', min, max, int } : { kind: 'number', min, max }
}

function enm (path: string, values: readonly string[]): void {
  RULES[path] = { kind: 'enum', values }
}

for (const key of ['row', 'layout', 'collapse'] as const) {
  num('springs.' + key + '.stiffness', 1, 2000)
  num('springs.' + key + '.damping', 1, 400)
  num('springs.' + key + '.mass', 0.1, 10)
}
num('row.enter.opacity', 0, 1)
num('row.enter.y', -80, 80)
num('row.exit.opacity', 0, 1)
num('row.exit.y', -80, 80)
num('row.exit.duration', 0, 2)
enm('row.exit.ease', EASE_NAMES)
num('css.caretBlink', 0.1, 4)
num('css.pulse', 0.2, 6)
num('css.spin', 0.1, 3)
num('css.orb', 1, 20)
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
num('scroll.duration', 0.05, 2)
num('scroll.maxDuration', 0.1, 4)
num('scroll.instantAbove', 200, 20000)
num('stream.blur', 0, 24)
num('stream.duration', 0.05, 2)
num('stream.stagger', 0, 0.2)
num('stream.maxChars', 1, 240, true)
num('stream.clipDuration', 0.05, 2)
num('scramble.duration', 0, 5)
num('scramble.speed', 0.005, 0.5)
num('borderTrail.size', 8, 400)
num('borderTrail.duration', 0.2, 20)
num('progressiveBlur.blurLayers', 2, 24, true)
num('progressiveBlur.blurIntensity', 0, 2)

/** 全部可调叶子路径（调试台按它生成控件，测试按它核对覆盖）。 */
export const MOTION_PATHS: readonly string[] = Object.keys(RULES)

/** 每条路径的区间 / 枚举，调试台直接复用，避免控件和校验两套口径。 */
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

/** 深拷贝（调试台的草稿要用）。 */
export function cloneMotion (value: MotionConfig): MotionConfig {
  return JSON.parse(JSON.stringify(value)) as MotionConfig
}

function collectLeafPaths (value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return prefix === '' ? [] : [prefix]
  const paths: string[] = []
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    paths.push(...collectLeafPaths(child, prefix === '' ? key : prefix + '.' + key))
  }
  return paths
}

export interface NormalizeResult {
  config: MotionConfig
  issues: string[]
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
  console.warn('[chat-a2ui] motion.config.json 有问题，已按默认值兜底：\n  ' + motionIssues.join('\n  '))
}

/**
 * 把 4 个 CSS 循环动画的时长写成变量。
 * 三处根都要挂：聊天视图、主面板、左栏列表是三个独立子树。
 */
export function motionCssVars (config: MotionConfig = MOTION): string {
  const roots = '.caui-root, .caui-chat-page, .caui-chat-list'
  return roots + ' {\n' +
    '  --caui-motion-caret: ' + config.css.caretBlink + 's;\n' +
    '  --caui-motion-pulse: ' + config.css.pulse + 's;\n' +
    '  --caui-motion-spin: ' + config.css.spin + 's;\n' +
    '  --caui-motion-orb: ' + config.css.orb + 's;\n' +
    '}\n'
}
