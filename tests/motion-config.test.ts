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
    expect(DEFAULT_MOTION.tokens.loop).toEqual({ spin: 0.8, blink: 1.05, pulse: 1.6, orb: 5.4, trail: 5 })
    expect(DEFAULT_MOTION.tokens.ease.inOut).toEqual([0.42, 0, 0.58, 1])
    expect(DEFAULT_MOTION.roles.message.enter).toEqual({ spring: 'soft', opacity: 0, y: 6 })
    expect(DEFAULT_MOTION.roles.message.exit).toEqual({ duration: 'sm', ease: 'out', opacity: 0, y: -4 })
    expect(DEFAULT_MOTION.roles.text.stream).toEqual({ duration: 'lg', ease: 'out', blur: 9, stagger: 0.004 })
    expect(DEFAULT_MOTION.roles.affordance.hover).toEqual({ duration: 'xs', ease: 'out' })
    expect(DEFAULT_MOTION.textEffect.emptyTitle).toEqual({ per: 'char', preset: 'blur', delay: 0.1, speedReveal: 1, speedSegment: 1 })
    expect(DEFAULT_MOTION.animatedGroup.suggestions).toEqual({ preset: 'blur-slide', stagger: 0.1 })
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

  it('运行时从配置派生：spring / layoutSpring 跟着令牌走', async () => {
    const { spring, layoutSpring } = await import('../src/client/chat-a2ui/motion')
    const { MOTION } = await import('../src/client/chat-a2ui/motion-config')
    expect(spring).toEqual({ type: 'spring', ...MOTION.tokens.springs.soft })
    expect(layoutSpring).toEqual(spring)
    // 行进场 / 退场已完全走 useRole（角色语义在 motion-roles.ts），
    // motion.ts 不再保留 rowEnter* / rowExit* 这层死常量。
  })

  it('没有「写了不生效」的配置分组：每个顶层分组都被读过', async () => {
    const { readFileSync, readdirSync } = await import('node:fs')
    const { join } = await import('node:path')
    const raw = JSON.parse(readFileSync(join(ROOT, 'motion.config.json'), 'utf8')) as Record<string, unknown>
    const dir = join(ROOT, 'src')
    const files: string[] = []
    const walk = (path: string): void => {
      for (const entry of readdirSync(path, { withFileTypes: true })) {
        const full = join(path, entry.name)
        if (entry.isDirectory()) walk(full)
        // 只排除**定义**这份配置的 motion-config.ts；motion-hooks / motion-roles 等都是真实读取方。
        else if (/\.(ts|tsx)$/.test(entry.name) && entry.name !== 'motion-config.ts') files.push(full)
      }
    }
    walk(dir)
    const source = files.map(file => readFileSync(file, 'utf8')).join(String.fromCharCode(10))
    // tokens / roles 通过 hooks 间接读取，其余分组必须出现 MOTION.<分组> 的引用
    for (const section of Object.keys(raw)) {
      if (section === 'tokens' || section === 'roles') continue
      expect(source.includes('MOTION.' + section), section + ' 没有任何读取方').toBe(true)
    }
  })

  it('配置文件在仓库根，且没有被塞进发布清单', async () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')) as { files: string[] }
    expect(pkg.files).toEqual(['lib', 'cordis.patch.yml', 'README.md'])
    const raw = JSON.parse(readFileSync(join(ROOT, 'motion.config.json'), 'utf8')) as Record<string, unknown>
    expect(Object.keys(raw)).toContain('tokens')
    expect(Object.keys(raw)).toContain('roles')
  })
})
