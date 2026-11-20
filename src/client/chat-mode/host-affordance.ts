/**
 * 宿主（DSH 外壳）「新建会话」入口的判据。
 *
 * 为什么要单独成模块：这些判据认的是宿主 DOM 的约定（aria-label 文案、
 * aria-keyshortcuts 片段），宿主一改版就会**静默失效**——拦截不再生效，
 * 但页面不报错，症状是点侧栏的「新建会话」后主列被切走。集中在一处，
 * 才能让 ChatWorkspace 的捕获监听与挂载自检用同一份判据，也才能在告警里
 * 直接引用 describeAffordances() 的文本。
 *
 * 纯函数：不依赖 React，也不读写任何跨调用保持的状态。
 *
 * 宿主侧的对照事实（0.2.2-rc.3 实测）：
 * - 按钮来自 @deepseek-ai/dsh-client-ui-sidebar 的 SidebarRoot / HeaderLeadingControls，
 *   无障碍名取 `sidebar` 语言包的 `session.new.label`，快捷键取 `session.new` 命令的
 *   `aria-keyshortcuts`；
 * - `session.new` 的默认绑定登记在 @deepseek-ai/dsh-client-ui-workspace 的 shortcuts.ts：
 *   桌面端 primary+N，Web 端 primary+Alt+N（Web:Linux 未绑定）；
 * - 经 @deepseek-ai/dsh-client-shortcuts 的 presentBinding 展开后：
 *   Web:Windows 为 `Control+Alt+N`、Web:macOS 为 `Alt+Meta+N`，
 *   桌面端为 `Control+N` / `Meta+N`（不含 Alt，只能靠 aria-label 命中）。
 */

/**
 * 宿主新建会话按钮的无障碍名称。
 *
 * 文案随宿主语言变化，这里只覆盖当前发布的两种；其余语言
 * （ja / es / fr / de / ru / pt）只能靠 aria-keyshortcuts 片段命中，
 * 而桌面端的 aria 里没有 Alt，因此在那些语言 + 桌面端下拦截不成立
 * （是已知残留，见 ADR 0002，自检告警会把它暴露出来）。
 */
export const NEW_SESSION_LABELS: readonly string[] = ['新建会话', 'New session']

/**
 * 宿主新建会话控件的选择器。
 *
 * aria-keyshortcuts 用「包含」而不是等值匹配：宿主那句快捷键不是固定的 `Alt+N`，
 * 而是按运行时/平台拼出来的。修饰键顺序由宿主归一化（control, alt, shift, meta），
 * 于是 Windows/Linux 的 Web 端拼成 `Control+Alt+N`（Alt 紧邻 N），macOS 的 Web 端
 * 拼成 `Alt+Meta+N`（Alt 在最前），需要两个片段才都盖住；桌面端是 `Control+N` /
 * `Meta+N`，走 aria-label 命中。
 */
const NEW_SESSION_CONTROL_SELECTOR = [
  ...NEW_SESSION_LABELS.map(label => `button[aria-label="${label}"]`),
  'button[aria-keyshortcuts*="Alt+N"]',
  'button[aria-keyshortcuts*="Alt+Meta+N"]',
].join(', ')

/**
 * 判断一个事件目标是否落在宿主的「新建会话」控件里。
 *
 * 用 duck-typing 而不是 `instanceof Element`：事件目标可能来自别的 realm
 * （桌面端 iframe），跨 realm 的 instanceof 会误判；而 document、文本节点、
 * window、null 都没有 closest 方法，天然被排除。
 * @param target - 事件目标；可为空，可为非元素节点。
 * @returns 命中宿主新建会话入口时为 true。
 */
export function isNewSessionControl (target: EventTarget | null): boolean {
  if (target === null || typeof target !== 'object') return false
  const element = target as Element
  if (typeof element.closest !== 'function') return false
  return element.closest(NEW_SESSION_CONTROL_SELECTOR) !== null
}

/**
 * 在给定树里找宿主认得出的新建会话控件。
 *
 * 与 isNewSessionControl() 共用同一份选择器，所以「拦截认什么」和「自检查什么」
 * 不会各写一套再漂移。自检只用它回答一个问题：页面上还有没有这个入口。
 * @param root - 查找范围，通常是 document。
 * @returns 命中判据的元素；空数组表示宿主入口没有被认出来，可能已经改版。
 */
export function findNewSessionControls (root: ParentNode): Element[] {
  const found: Element[] = []
  for (const element of root.querySelectorAll('button')) {
    if (isNewSessionControl(element)) found.push(element)
  }
  return found
}

/**
 * 判断一次按键是否是要拦的「新建会话」快捷键。
 *
 * 修饰键接受 Ctrl / ⌘(Meta) / Alt 的任意非空组合，只排除 Shift：宿主在桌面端绑
 * primary+N，在 Web 端绑 primary+Alt+N，所以 Ctrl+Alt+N、⌘+Alt+N 都是真实存在的
 * 宿主路径，而不只是 Ctrl+N。
 *
 * 物理键优先：macOS 上 Option+Command+N 在浏览器里可能只报 `key === 'Dead'`
 * （`code` 仍是 `KeyN`）。宿主自己的键盘适配器专门为这一点放了行
 * （dsh-client-shortcuts/src/client/dom.ts 的 commandDeadKey），只看 `key` 会漏掉
 * 这条真实路径，于是宿主照常新建原生会话、把主列切走。
 * @param event - 键盘事件；只用到键位与修饰键字段。
 * @returns 需要拦截时为 true。
 */
export function isNewSessionShortcut (
  event: Pick<KeyboardEvent, 'key' | 'ctrlKey' | 'metaKey' | 'altKey' | 'shiftKey'>
    & Partial<Pick<KeyboardEvent, 'code'>>,
): boolean {
  if (event.shiftKey) return false
  if (!event.ctrlKey && !event.metaKey && !event.altKey) return false
  if (event.code === 'KeyN') return true
  return event.key.toLowerCase() === 'n'
}

/**
 * 把当前判据拼成一句可读文本，供自检告警与排查时直接引用。
 * @returns 一行中文描述，包含点击判据与快捷键判据。
 */
export function describeAffordances (): string {
  return '点击判据 ' + NEW_SESSION_CONTROL_SELECTOR
    + '；快捷键判据 Ctrl/⌘/Alt 任一修饰键 + N（不含 Shift，物理键 KeyN 或键值 n）'
}
