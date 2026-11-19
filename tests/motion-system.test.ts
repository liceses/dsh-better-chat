/**
 * 动效体系的自检：角色、档位语义、CSS 变量、白名单不变量。
 *
 * 这些断言守的是「体系还在」——组件可以坏，但体系不能被悄悄绕过。
 */

import { execFileSync } from 'node:child_process'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { DEFAULT_MOTION, MOTION, ROLE_IDS, motionCssVars } from '../src/client/chat-a2ui/motion-config'
import { expandRole, roleSpec } from '../src/client/chat-a2ui/motion-roles'

const ROOT = join(import.meta.dirname, '..')
const TOKEN_GROUPS = new Set(['spring', 'duration', 'ease', 'loop'])

describe('动效体系', () => {
  it('每个角色都能展开成有限数字，且引用的令牌都存在', () => {
    for (const id of ROLE_IDS) {
      const spec = roleSpec(id)
      for (const [key, value] of Object.entries(spec)) {
        if (TOKEN_GROUPS.has(key)) {
          const group = key === 'spring' ? MOTION.tokens.springs
            : key === 'duration' ? MOTION.tokens.dur
              : key === 'ease' ? MOTION.tokens.ease
                : MOTION.tokens.loop
          expect(Object.keys(group), id + '.' + key).toContain(value)
        } else {
          expect(Number.isFinite(value), id + '.' + key).toBe(true)
        }
      }
      const expanded = expandRole(id)
      for (const value of [...Object.values(expanded.initial), ...Object.values(expanded.animate), ...Object.values(expanded.exit)]) {
        expect(Number.isFinite(value), id).toBe(true)
      }
      expect(expanded.duration).toBeGreaterThan(0)
    }
  })

  it('角色表覆盖全部 11 个角色，且没有多余的角色', () => {
    expect(ROLE_IDS).toHaveLength(11)
    const leaves: string[] = []
    const walk = (value: unknown, prefix: string): void => {
      if (typeof value !== 'object' || value === null) { leaves.push(prefix); return }
      for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
        walk(child, prefix === '' ? key : prefix + '.' + key)
      }
    }
    walk(DEFAULT_MOTION.roles, '')
    // 叶子是 sprig/duration/... 之类，收成角色名（去掉最后一段）
    const roles = new Set(leaves.map(leaf => leaf.split('.').slice(0, -1).join('.')))
    expect([...roles].sort()).toEqual([...ROLE_IDS].sort())
  })

  it('reduced 档：位移 / 缩放 / 模糊归零，时长压到 tokens.dur.reduced，循环保留', () => {
    for (const id of ROLE_IDS) {
      const expanded = expandRole(id, 'reduced')
      expect(expanded.initial.y ?? 0, id).toBe(0)
      expect(expanded.initial.scale ?? 1, id).toBe(1)
      expect(expanded.exit.scale ?? 1, id).toBe(1)
      expect(expanded.blur, id).toBe(0)
      expect(expanded.stagger, id).toBe(0)
      expect(expanded.duration).toBe(MOTION.tokens.dur.reduced)
    }
    // 循环类仍保留：它们是状态指示
    expect(expandRole('system.spin', 'reduced').loop).toBe(MOTION.tokens.loop.spin)
  })

  it('full 档下 opacity 仍然过渡（reduced 不是无动效）', () => {
    const expanded = expandRole('message.enter', 'reduced')
    expect(expanded.animate.opacity).toBe(1)
    expect(expanded.initial.opacity).toBe(DEFAULT_MOTION.roles.message.enter.opacity)
  })

  it('affordance.hover 不许带位移或缩放（hover 上抬会造成布局抖动）', () => {
    const spec = roleSpec('affordance.hover')
    expect(spec.y).toBeUndefined()
    expect(spec.scale).toBeUndefined()
    const expanded = expandRole('affordance.hover')
    expect(expanded.initial.y).toBeUndefined()
    expect(expanded.initial.scale).toBeUndefined()
  })

  it('CSS 变量块覆盖全部时长 / 缓动 / 循环令牌', () => {
    const css = motionCssVars()
    for (const key of ['xs', 'sm', 'md', 'lg', 'reduced']) {
      expect(css).toContain('--caui-dur-' + key + ': ' + MOTION.tokens.dur[key as keyof typeof MOTION.tokens.dur] + 's')
    }
    expect(css).toContain('--caui-ease-out: cubic-bezier(')
    expect(css).toContain('--caui-loop-spin: ')
    expect(css).toContain('--caui-blur-stream: ')
  })

  it('lint:motion 通过：组件里没有体系外的手写动效数值', () => {
    const out = execFileSync(process.execPath, [join(ROOT, 'scripts', 'lint-motion.mjs')], { encoding: 'utf8' })
    expect(out).toContain('[lint:motion]')
    expect(out).toContain('违规 0 处')
  })

  it('白名单只许减：条目数不超过 cap，且每条都还能命中', () => {
    const out = execFileSync(process.execPath, [join(ROOT, 'scripts', 'lint-motion.mjs')], { encoding: 'utf8' })
    expect(out).not.toContain('白名单失效')
    expect(out).not.toContain('超上限')
  })
})
