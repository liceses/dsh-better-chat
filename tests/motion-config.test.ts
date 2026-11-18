import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')

describe('motion.config.json 与加载器', () => {
  it('仓库里的配置能干净地 normalize（零 issue）', async () => {
    const { motionIssues, MOTION } = await import('../src/client/chat-a2ui/motion-config')
    expect(motionIssues).toEqual([])
    expect(MOTION.springs.row).toEqual({ stiffness: 420, damping: 34, mass: 0.8 })
  })

  it('出厂值就是迁移前的现值：改它等于改默认观感', async () => {
    const { DEFAULT_MOTION } = await import('../src/client/chat-a2ui/motion-config')
    expect(DEFAULT_MOTION.springs.row).toEqual({ stiffness: 420, damping: 34, mass: 0.8 })
    expect(DEFAULT_MOTION.springs.layout).toEqual({ stiffness: 420, damping: 34, mass: 0.8 })
    expect(DEFAULT_MOTION.springs.collapse).toEqual({ stiffness: 420, damping: 34, mass: 0.8 })
    expect(DEFAULT_MOTION.row.enter).toEqual({ opacity: 0, y: 6 })
    expect(DEFAULT_MOTION.row.exit).toEqual({ opacity: 0, y: -6, duration: 0.16, ease: 'easeOut' })
    expect(DEFAULT_MOTION.css).toEqual({ caretBlink: 1.05, pulse: 1.6, spin: 0.8, orb: 5.4 })
    expect(DEFAULT_MOTION.textEffect.emptyTitle).toEqual({ per: 'char', preset: 'blur', delay: 0.1, speedReveal: 1, speedSegment: 1 })
    expect(DEFAULT_MOTION.textEffect.blankTitle.delay).toBe(0.08)
    expect(DEFAULT_MOTION.animatedGroup.suggestions).toEqual({ preset: 'blur-slide', stagger: 0.1 })
    expect(DEFAULT_MOTION.shimmer).toEqual({
      duration: 1, spread: 1, zDistance: 10, xDistance: 2,
      yDistance: -2, scaleDistance: 1.1, rotateYDistance: 10,
    })
    expect(DEFAULT_MOTION.scramble).toEqual({ duration: 0.8, speed: 0.04 })
    expect(DEFAULT_MOTION.borderTrail).toEqual({ size: 110, duration: 3.4 })
    expect(DEFAULT_MOTION.progressiveBlur).toEqual({ blurLayers: 6, blurIntensity: 0.32 })
  })

  it('校验规则与出厂值一一对应：既不漏键，也没有无处可校验的键', async () => {
    const { DEFAULT_MOTION, MOTION_PATHS, getMotionPath } = await import('../src/client/chat-a2ui/motion-config')
    for (const path of MOTION_PATHS) {
      expect(getMotionPath(DEFAULT_MOTION, path), path).not.toBeUndefined()
    }
    // 反向：出厂值的每个叶子都有规则
    const leaves: string[] = []
    const walk = (value: unknown, prefix: string): void => {
      if (typeof value !== 'object' || value === null) { leaves.push(prefix); return }
      for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
        walk(child, prefix === '' ? key : prefix + '.' + key)
      }
    }
    walk(DEFAULT_MOTION, '')
    expect([...leaves].sort()).toEqual([...MOTION_PATHS].sort())
  })

  it('坏配置只影响出问题的那一个键', async () => {
    const { normalizeMotionConfig, DEFAULT_MOTION } = await import('../src/client/chat-a2ui/motion-config')
    const { config, issues } = normalizeMotionConfig({
      springs: { row: { stiffness: 900, damping: 34, mass: 0.8 }, layout: { stiffness: 420, damping: 34, mass: 0.8 }, collapse: { stiffness: 420, damping: 34, mass: 0.8 } },
      css: { caretBlink: 99, pulse: 1.6, spin: 0.8, orb: 5.4 },
      row: { enter: { opacity: 0, y: '6' }, exit: { opacity: 0, y: -6, duration: 0.16, ease: 'easeOut' } },
      textEffect: DEFAULT_MOTION.textEffect,
      animatedGroup: DEFAULT_MOTION.animatedGroup,
      shimmer: DEFAULT_MOTION.shimmer,
      scramble: DEFAULT_MOTION.scramble,
      borderTrail: DEFAULT_MOTION.borderTrail,
      progressiveBlur: DEFAULT_MOTION.progressiveBlur,
      extra: { nope: 1 },
    })
    expect(config.springs.row.stiffness).toBe(900)
    expect(config.css.caretBlink).toBe(DEFAULT_MOTION.css.caretBlink)
    expect(config.row.enter.y).toBe(DEFAULT_MOTION.row.enter.y)
    expect(issues.join('\n')).toContain('css.caretBlink')
    expect(issues.join('\n')).toContain('row.enter.y')
    expect(issues.join('\n')).toContain('extra.nope')
  })

  it('CSS 变量块由配置生成', async () => {
    const { MOTION, motionCssVars } = await import('../src/client/chat-a2ui/motion-config')
    const css = motionCssVars()
    expect(css).toContain('--caui-motion-caret: ' + MOTION.css.caretBlink + 's')
    expect(css).toContain('--caui-motion-pulse: ' + MOTION.css.pulse + 's')
    expect(css).toContain('--caui-motion-spin: ' + MOTION.css.spin + 's')
    expect(css).toContain('--caui-motion-orb: ' + MOTION.css.orb + 's')
    expect(css).toContain('.caui-chat-list')
  })

  it('运行时从配置派生：spring / rowEnter / rowExit 跟着 MOTION 走', async () => {
    const { spring, layoutSpring, collapseSpring, rowEnter, rowExit } = await import('../src/client/chat-a2ui/motion')
    const { MOTION } = await import('../src/client/chat-a2ui/motion-config')
    expect(spring).toEqual({ type: 'spring', ...MOTION.springs.row })
    expect(layoutSpring).toEqual({ type: 'spring', ...MOTION.springs.layout })
    expect(collapseSpring).toEqual({ type: 'spring', ...MOTION.springs.collapse })
    expect(rowEnter.initial).toEqual({ opacity: MOTION.row.enter.opacity, y: MOTION.row.enter.y })
    expect(rowExit.y).toBe(MOTION.row.exit.y)
    expect(rowExit.opacity).toBe(MOTION.row.exit.opacity)
  })

  it('配置文件在仓库根，且没有被塞进发布清单', async () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as { files: string[] }
    expect(pkg.files).toEqual(['lib', 'cordis.patch.yml', 'README.md'])
    const raw = JSON.parse(readFileSync(join(ROOT, 'motion.config.json'), 'utf8')) as Record<string, unknown>
    expect(Object.keys(raw)).toContain('springs')
  })
})
