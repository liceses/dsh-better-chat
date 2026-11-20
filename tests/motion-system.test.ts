/**
 * 动效体系的自检：角色、档位语义、CSS 变量、白名单不变量。
 *
 * 这些断言守的是「体系还在」——组件可以坏，但体系不能被悄悄绕过。
 */

import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
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

/** 递归收集 src 下的 .ts / .tsx；rel 是相对仓库根的 posix 路径（报告里能直接定位）。 */
function sourceFiles (): Array<{ rel: string; abs: string }> {
  const out: Array<{ rel: string; abs: string }> = []
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = join(dir, entry.name)
      if (entry.isDirectory()) walk(abs)
      else if (/\.(ts|tsx)$/.test(entry.name)) out.push({ rel: relative(ROOT, abs).replaceAll('\\', '/'), abs })
    }
  }
  walk(join(ROOT, 'src'))
  return out
}

/**
 * 一行源码里是否把 name 当成「值」用。
 * 排除注释行与对象键（`spring: 'soft'` 这种键名不是引用，否则门禁会被配置表骗过）。
 */
function usesName (line: string, name: string): boolean {
  const trimmed = line.trim()
  if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return false
  const pattern = new RegExp('(?<![\\w$.])' + name + '(?![\\w$])', 'g')
  let match: RegExpExecArray | null
  while ((match = pattern.exec(line)) !== null) {
    if (!/^\s*:/.test(line.slice(match.index + name.length))) return true
  }
  return false
}

describe('动效系统的死层门禁', () => {
  it('motion.ts 的每个导出都至少有一处真实引用（不许留死导出）', () => {
    const definitionRel = 'src/client/chat-a2ui/motion.ts'
    const definition = readFileSync(join(ROOT, definitionRel), 'utf8')
    const names = [...definition.matchAll(/^export (?:const|function) ([A-Za-z_$][\w$]*)/gm)]
      .map(match => match[1] as string)
    // 防呆：正则匹配不到就等于门禁在空转。
    expect(names.length).toBeGreaterThan(0)

    const others = sourceFiles().filter(file => file.rel !== definitionRel)
    const contents = others.map(file => readFileSync(file.abs, 'utf8').split(String.fromCharCode(10)))
    for (const name of names) {
      const referenced = contents.some(lines => lines.some(line => usesName(line, name)))
      expect(referenced, 'motion.ts 的导出 ' + name + ' 在 src 里零引用，应删掉').toBe(true)
    }
  })

  it('data-motion 只从 motion-scope.ts 输出，四个子树根都走 useMotionAttribute', () => {
    // style.ts / style-p06.ts 里的 data-motion 是 CSS 选择器（消费方），不是写入方。
    const cssFiles = new Set(['src/client/chat-a2ui/style.ts', 'src/client/chat-a2ui/style-p06.ts'])
    const writers = sourceFiles()
      .filter(file => !cssFiles.has(file.rel))
      .filter(file => readFileSync(file.abs, 'utf8').includes('data-motion'))
      .map(file => file.rel)
    expect(writers).toEqual(['src/client/chat-a2ui/motion-scope.ts'])

    // 四个子树根：CSS 选择器挂在根元素自身，漏写一处那个子树就静默失效。
    const shells = [
      'src/client/chat-a2ui/ChatA2UIView.tsx',
      'src/client/chat-mode/ChatPage.tsx',
      'src/client/chat-mode/ChatWorkspace.tsx',
      'src/client/chat-mode/ChatSessionList.tsx',
    ]
    for (const rel of shells) {
      const source = readFileSync(join(ROOT, rel), 'utf8')
      expect(source.includes('useMotionAttribute'), rel + ' 没有用 useMotionAttribute 挂档位').toBe(true)
    }
  })
})
