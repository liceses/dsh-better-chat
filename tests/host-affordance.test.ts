// @vitest-environment jsdom

/**
 * 宿主「新建会话」判据（host-affordance.ts）的测试。
 *
 * 这套判据是**静默失效**的典型：宿主改一处 aria，我们不再拦截却没有任何报错，
 * 症状只是「点侧栏新建会话后主列被切走」。所以这里逐条钉住：
 * - 认控件的三条路：aria-label 中文、aria-label 英文、aria-keyshortcuts 含 Alt+N；
 * - 事件目标落在按钮内部（span）也算，document / 文本节点 / null 都不算；
 * - 快捷键按核实过的宿主绑定走：桌面端 primary+N，Web 端 primary+Alt+N；
 *   且 macOS 的 Option+Command+N 在浏览器里可能只报 key='Dead'（code 仍为 KeyN）。
 *
 * 宿主侧证据（0.2.2-rc.3）：
 * - ui-workspace/src/client/shortcuts.ts 里 `session.new` 的默认值；
 * - dsh-client-shortcuts 的 presentBinding：Web:Windows -> Control+Alt+N、
 *   Web:macOS -> Alt+Meta+N、桌面端 -> Control+N / Meta+N。
 */

import { afterEach, describe, expect, it } from 'vitest'
import {
  NEW_SESSION_LABELS,
  describeAffordances,
  findNewSessionControls,
  isNewSessionControl,
  isNewSessionShortcut,
} from '../src/client/chat-mode/host-affordance'

/** 挂到页面上的按钮，用例结束后统一清空。 */
const mounted: HTMLElement[] = []

/**
 * 往 body 里放一个按钮。
 * @param attributes - 要设置的属性（aria-label / aria-keyshortcuts 等）。
 * @returns 按钮元素。
 */
function button (attributes: Record<string, string>): HTMLButtonElement {
  const element = document.createElement('button')
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value)
  document.body.append(element)
  mounted.push(element)
  return element
}

afterEach(() => {
  for (const element of mounted) element.remove()
  mounted.length = 0
})

/** 判据入参类型，直接从被测函数取，免得测试里再抄一份。 */
type ShortcutInput = Parameters<typeof isNewSessionShortcut>[0]

/**
 * 造一份只含判据用得到的字段的键盘事件。
 * @param init - 覆盖项；key 必填，其余修饰键默认未按下。
 * @returns 可直接喂给 isNewSessionShortcut 的对象。
 */
function shortcut (init: Partial<ShortcutInput> & { key: string }): ShortcutInput {
  return { ctrlKey: false, metaKey: false, altKey: false, shiftKey: false, ...init }
}

describe('isNewSessionControl：认控件', () => {
  it('命中 aria-label="新建会话"', () => {
    expect(isNewSessionControl(button({ 'aria-label': '新建会话' }))).toBe(true)
  })

  it('命中 aria-label="New session"', () => {
    expect(isNewSessionControl(button({ 'aria-label': 'New session' }))).toBe(true)
  })

  it('命中 aria-keyshortcuts="Alt+N"', () => {
    expect(isNewSessionControl(button({ 'aria-keyshortcuts': 'Alt+N' }))).toBe(true)
  })

  it('以「部分匹配」命中宿主在 Web 上真实拼出的两种 aria', () => {
    // 这两个值不是猜的：presentBinding(normalizeBinding({code:'KeyN',modifiers:['primary','alt']}), platform)
    // Windows/Linux 归一化成 control+alt（Alt 紧邻 N）；macOS 归一化成 alt+meta（Alt 在最前）。
    expect(isNewSessionControl(button({ 'aria-keyshortcuts': 'Control+Alt+N' }))).toBe(true)
    expect(isNewSessionControl(button({ 'aria-keyshortcuts': 'Alt+Meta+N' }))).toBe(true)
  })

  it('按钮内部的 span 作为事件目标也命中（closest 上溯）', () => {
    const host = button({ 'aria-label': '新建会话' })
    const span = document.createElement('span')
    host.append(span)
    expect(isNewSessionControl(span)).toBe(true)
  })

  it('其它按钮不命中', () => {
    expect(isNewSessionControl(button({ 'aria-label': '发送消息' }))).toBe(false)
    expect(isNewSessionControl(button({ 'aria-keyshortcuts': 'Control+K' }))).toBe(false)
    expect(isNewSessionControl(button({ 'aria-label': '新对话' }))).toBe(false)
  })

  it('宿主在桌面端的 Control+N 不靠快捷键片段命中（要靠 aria-label）', () => {
    const element = button({ 'aria-keyshortcuts': 'Control+N' })
    expect(isNewSessionControl(element)).toBe(false)
    element.setAttribute('aria-label', '新建会话')
    expect(isNewSessionControl(element)).toBe(true)
  })

  it('null / 非元素节点不命中', () => {
    expect(isNewSessionControl(null)).toBe(false)
    expect(isNewSessionControl(document)).toBe(false)
    expect(isNewSessionControl(document.createTextNode('新建会话'))).toBe(false)
    expect(isNewSessionControl(window)).toBe(false)
  })

  it('自检扫描：页面有宿主入口时找得到，没有时找不到', () => {
    expect(findNewSessionControls(document)).toHaveLength(0)
    const host = button({ 'aria-label': '新建会话' })
    button({ 'aria-label': '发送消息' })
    expect(findNewSessionControls(document)).toEqual([host])
    host.remove()
    expect(findNewSessionControls(document)).toHaveLength(0)
  })

  it('文案表就是宿主的两套无障碍名，且判据文本里带着它', () => {
    expect(NEW_SESSION_LABELS).toEqual(['新建会话', 'New session'])
    const described = describeAffordances()
    expect(described).toContain('新建会话')
    expect(described).toContain('Alt+N')
  })
})

describe('isNewSessionShortcut：认快捷键', () => {
  it('Ctrl+N 命中', () => {
    expect(isNewSessionShortcut(shortcut({ key: 'n', ctrlKey: true, code: 'KeyN' }))).toBe(true)
  })

  it('Meta+N 命中', () => {
    expect(isNewSessionShortcut(shortcut({ key: 'n', metaKey: true, code: 'KeyN' }))).toBe(true)
  })

  it('Alt+N 命中', () => {
    // 宿主默认里没有单独 Alt+N；但桌面端的自定义绑定可以落到这里，
    // 而 Web 端广告出来的就是含 Alt 的组合，所以判据接受它。
    expect(isNewSessionShortcut(shortcut({ key: 'n', altKey: true, code: 'KeyN' }))).toBe(true)
  })

  it('宿主 Web 端的真实绑定 primary+Alt+N 命中', () => {
    expect(isNewSessionShortcut(shortcut({ key: 'n', ctrlKey: true, altKey: true, code: 'KeyN' }))).toBe(true)
    expect(isNewSessionShortcut(shortcut({ key: 'n', metaKey: true, altKey: true, code: 'KeyN' }))).toBe(true)
  })

  it('macOS 的 Option+Command+N 报成 key="Dead" 时仍命中（只看 key 会漏）', () => {
    expect(isNewSessionShortcut(shortcut({ key: 'Dead', metaKey: true, altKey: true, code: 'KeyN' }))).toBe(true)
  })

  it('大写 N 也命中（key 不区分大小写）', () => {
    expect(isNewSessionShortcut(shortcut({ key: 'N', ctrlKey: true }))).toBe(true)
  })

  it('Ctrl+Shift+N 不命中', () => {
    expect(isNewSessionShortcut(shortcut({ key: 'n', ctrlKey: true, shiftKey: true, code: 'KeyN' }))).toBe(false)
  })

  it('单独 N 不命中', () => {
    expect(isNewSessionShortcut(shortcut({ key: 'n', code: 'KeyN' }))).toBe(false)
  })

  it('无修饰键的其它键不命中', () => {
    expect(isNewSessionShortcut(shortcut({ key: 'm' }))).toBe(false)
    expect(isNewSessionShortcut(shortcut({ key: 'n', ctrlKey: true }))).toBe(true)
    expect(isNewSessionShortcut(shortcut({ key: 'm', ctrlKey: true }))).toBe(false)
  })

  it('长按产生的重复事件不拦截（否则按住不放会连建会话）', () => {
    expect(isNewSessionShortcut({ key: 'n', code: 'KeyN', ctrlKey: true, metaKey: false, altKey: false, shiftKey: false, repeat: true })).toBe(false)
  })

  it('AltGr（Windows 的 Ctrl+Alt）不拦截，那是打字符', () => {
    const altGraph = { key: 'n', code: 'KeyN', ctrlKey: true, metaKey: false, altKey: true, shiftKey: false, getModifierState: (name: string) => name === 'AltGraph' }
    expect(isNewSessionShortcut(altGraph)).toBe(false)
  })
})