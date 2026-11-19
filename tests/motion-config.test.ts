import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')

describe('motion.config.json 与加载器', () => {
  it('仓库里的配置能干净地 normalize（零 issue）', async () => {
    const { motionIssues, MOTION } = await import('../src/client/chat-a2ui/motion-config')
    expect(motionIssues).toEqual([])
    expect(MOTION.tokens.springs.soft).toEqual({ stiffness: 420, damping: 34, mass: 0.8 })
    expect(MOTION.tokens.dur.lg).toBe(0.42)
    expect(MOTION.tokens.ease.out).toEqual([0.22, 1, 0.36, 1])
  })

  it('出厂值就是迁移前的现值：改它等于改默认观感', async () => {
    const { DEFAULT_MOTION } = await import('../src/client/chat-a2ui/motion-config')
    expect(DEFAULT_MOTION.tokens.springs.soft).toEqual({ stiffness: 420, damping: 34, mass: 0.8 })
    expect(DEFAULT_MOTION.tokens.dur).toEqual({ xs: 0.12, sm: 0.16, md: 0.24, lg: 0.42, reduced: 0.14 })
    expect(DEFAULT_MOTION.tokens.loop).toEqual({ spin: 0.8, blink: 1.05, pulse: 1.6, orb: 5.4 })
    expect(DEFAULT_MOTION.roles.message.enter).toEqual({ spring: 'soft', opacity: 0, y: 6 })
    expect(DEFAULT_MOTION.roles.message.exit).toEqual({ duration: 'sm', ease: 'out', opacity: 0, y: -4 })
    expect(DEFAULT_MOTION.roles.text.stream).toEqual({ duration: 'lg', ease: 'out', blur: 9, stagger: 0.004 })
    expect(DEFAULT_MOTION.roles.affordance.hover).toEqual({ duration: 'xs', ease: 'out' })
    expect(DEFAULT_MOTION.textEffect.emptyTitle).toEqual({ per: 'char', preset: 'blur', delay: 0.1, speedReveal: 1, speedSegment: 1 })
    expect(DEFAULT_MOTION.animatedGroup.suggestions).toEqual({ preset: 'blur-slide', stagger: 0.1 })
    expect(DEFAULT_MOTION.scramble).toEqual({ duration: 0.8, speed: 0.04 })
    expect(DEFAULT_MOTION.progressiveBlur).toEqual({ blurLayers: 6, blurIntensity: 0.32 })
  })

  it('校验规则与出厂值一一对应：既不漏键，也没有无处可校验的键', async () => {
    const { DEFAULT_MOTION, MOTION_PATHS, getMotionPath } = await import('../src/client/chat-a2ui/motion-config')
    for (const path of MOTION_PATHS) {
      expect(getMotionPath(DEFAULT_MOTION, path), path).not.toBeUndefined()
    }
    // 反向：出厂值的每个叶子都有规则（数组算一个叶子）
    const leaves: string[] = []
    const walk = (value: unknown, prefix: string): void => {
      if (Array.isArray(value)) { leaves.push(prefix); return }
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
    const broken = JSON.parse(JSON.stringify(DEFAULT_MOTION)) as Record<string, unknown>
    ;(broken.tokens as { dur: Record<string, unknown> }).dur.sm = 99
    ;(broken.roles as { message: { enter: Record<string, unknown> } }).message.enter.y = '6'
    ;(broken.roles as { message: { enter: Record<string, unknown> } }).message.enter.opacity = 0.5
    ;(broken as Record<string, unknown>).extra = { nope: 1 }
    const { config, issues } = normalizeMotionConfig(broken)
    expect(config.tokens.dur.sm).toBe(DEFAULT_MOTION.tokens.dur.sm)
    expect(config.roles.message.enter.y).toBe(DEFAULT_MOTION.roles.message.enter.y)
    expect(config.roles.message.enter.opacity).toBe(0.5)
    const joined = issues.join(String.fromCharCode(10))
    expect(joined).toContain('tokens.dur.sm')
    expect(joined).toContain('roles.message.enter.y')
    expect(joined).toContain('extra.nope')
  })

  it('CSS 变量块由配置生成', async () => {
    const { MOTION, motionCssVars } = await import('../src/client/chat-a2ui/motion-config')
    const css = motionCssVars()
    expect(css).toContain('--caui-dur-sm: ' + MOTION.tokens.dur.sm + 's')
    expect(css).toContain('--caui-dur-reduced: ' + MOTION.tokens.dur.reduced + 's')
    expect(css).toContain('--caui-ease-out: cubic-bezier(0.22, 1, 0.36, 1)')
    expect(css).toContain('--caui-loop-spin: ' + MOTION.tokens.loop.spin + 's')
    // 旧变量名在 B3 之前保留
    expect(css).toContain('--caui-motion-caret: ' + MOTION.tokens.loop.blink + 's')
    expect(css).toContain('.caui-chat-list')
  })

  it('运行时从配置派生：spring / rowEnter / rowExit 跟着令牌与角色走', async () => {
    const { spring, layoutSpring, collapseSpring, rowEnter, rowExit } = await import('../src/client/chat-a2ui/motion')
    const { MOTION } = await import('../src/client/chat-a2ui/motion-config')
    expect(spring).toEqual({ type: 'spring', ...MOTION.tokens.springs.soft })
    expect(layoutSpring).toEqual(spring)
    expect(collapseSpring).toEqual(spring)
    expect(rowEnter.initial).toEqual({ opacity: MOTION.roles.message.enter.opacity, y: MOTION.roles.message.enter.y })
    expect(rowExit.y).toBe(MOTION.roles.message.exit.y)
    expect(rowExit.opacity).toBe(MOTION.roles.message.exit.opacity)
  })

  it('配置文件在仓库根，且没有被塞进发布清单', async () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as { files: string[] }
    expect(pkg.files).toEqual(['lib', 'cordis.patch.yml', 'README.md'])
    const raw = JSON.parse(readFileSync(join(ROOT, 'motion.config.json'), 'utf8')) as Record<string, unknown>
    expect(Object.keys(raw)).toContain('tokens')
    expect(Object.keys(raw)).toContain('roles')
  })
})
