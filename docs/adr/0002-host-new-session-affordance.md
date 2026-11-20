# 宿主没给「新建会话」动作槽，所以在捕获阶段拦截，并把自检告警算作方案的一部分

Chat 面板激活时，宿主自己的「新建会话」入口必须创建 Chat 会话而不是原生会话——否则一次点击就创建原生 Session、把主列切走。但这一版宿主没有为这个动作提供插件可用的槽。ui-sidebar 声明的槽只有 `sidebar.toggle.badge` / `sidebar.brand.mark` / `sidebar.brand.name` / `sidebar.panellist` / `sidebar.panellist.actions` / `sidebar.workspaces` / `sidebar.settings` / `sidebar.footer.action` / `sidebar.session.action`，其中唯一与新建会话相关的是 `sidebar.session.action`，而它是 **HOC 装饰层**：外壳把「Tooltip + 自己的 button」作为 `children` 传进来，占位者只能包一层再原样返回，新建动作始终由外壳的 `openNewSession() → startSession()` 发起（`@deepseek-ai/dsh-client-ui-sidebar/src/client/SidebarRoot.tsx:382-404`）。另外两处入口同样不在任何插件槽里：窗口标题栏那颗按钮属于 `shell.leading`（同包 `HeaderLeadingControls.tsx:46-61`），展开态的品牌行本身就是一颗新建会话按钮（`SidebarRoot.tsx:361-376`）。键盘那条路更彻底：`session.new` 命令由 ui-workspace 通过 `ctx.shortcuts` 注册（`@deepseek-ai/dsh-client-ui-workspace/src/client/shortcuts.ts:71-84`），插件再注册同名命令会被 `ShortcutRegistry.register` 以重复 id 直接抛错，也没有接管别人 `resolve` 的 API。本插件实际占用的四个槽（`main` / `sidebar.panellist` / `conversation.view` / `conversation.session.header.actions`）都不在这条链路上。

所以我们在 Chat 工作区挂载期间，用**捕获阶段**的 `click` 与 `keydown` 抢在宿主的处理器之前吃掉事件，改调 `controller.enterNew()`。判据集中在 `src/client/chat-mode/host-affordance.ts`，因为它读的是宿主的 DOM 约定（aria-label 文案、aria-keyshortcuts 片段），而不是某个稳定的 API 契约。快捷键判据按核实过的宿主绑定写：桌面端 primary+N，**Web 端 primary+Alt+N**（`presentBinding` 展开后 Web:Windows 是 `Control+Alt+N`、Web:macOS 是 `Alt+Meta+N`，Web:Linux 未绑定），因此修饰键接受 Ctrl/⌘/Alt 的任意非空组合、只排除 Shift，并额外用物理键 `code === 'KeyN'` 兜住 macOS 上 Option+Command+N 只报 `key === 'Dead'` 的那条真实路径（宿主 `dsh-client-shortcuts/src/client/dom.ts` 的 `commandDeadKey` 就是为此放行的）。

**自检告警是这套方案的必备部分，不是锦上添花。** 捕获拦截的失效模式完全静默：宿主换一句 aria-label、改一种快捷键拼法，我们不再命中，页面不报错、不抛异常，只是点「新建会话」又开始把主列切走。所以 ChatWorkspace 挂载 800ms 后用同一份判据扫一遍页面，一个受认可的控件都找不到就 `console.warn` 一次，把当前判据文本和「请更新 host-affordance.ts」一起打出来（模块级去重，面板反复开关不刷屏）。这条告警同时也是「判据过期」的唯一探测器。

## Considered Options

- **等宿主开放真正的动作槽**：正解，但当前版本没有；等宿主提供 `onNewSession` 之类钩子后应拆掉这层捕获。
- **占 `sidebar.session.action`**：只覆盖侧栏那一行，标题栏按钮、展开态品牌行、`session.new` 快捷键都不经过它，仍要另写捕获；而且它只是装饰层，接管不了外壳的 `startSession()`。
- **改用 `ctx.shortcuts` 注册自己的命令**：id 冲突会被 `register` 直接抛错，同键位也会被默认值冲突检查拒绝，还要给插件新增 `shortcuts` 依赖。
- **改 `uiWorkspace.startSession` 的语义**：那是全应用行为，插件无权也不该改。

## Consequences

- 判据靠 DOM 约定，宿主改版即静默失效；唯一探测手段是那条 800ms 自检告警，而它只在 Chat 面板挂载时报一次，不构成长期健康检查。
- `NEW_SESSION_LABELS` 只覆盖中文与英文：其余语言（ja / es / fr / de / ru / pt）在**桌面端**只剩 aria-keyshortcuts 可认，而桌面端的 aria 是 `Control+N` / `Meta+N`（不含 Alt），因此那些语言 + 桌面端下侧栏行拦截不成立——已知残留，自检会告警，修法是补文案表。
- 判据接受 Alt 单独作为修饰键：宿主默认里没有裸 Alt+N（Web 端明确拒绝 alt-only 绑定，桌面端允许用户自定义），这样做是为了与「按钮广告的快捷键含 Alt」保持一致，多拦不会误伤宿主路径。
- 拦下的是宿主事件本身（`preventDefault` + `stopPropagation`），因此宿主 `session.new` 的 `resolve`（`navigation.startSession()`）不会执行；这只会改变「谁响应」，宿主命令目录与快捷键设置面板读的是 `ctx.shortcuts` 的快照，不受影响。
- 自检在挂载 800ms 时只看一眼首屏：侧栏被收起、或访问快照不含 `session/create` 时本来就没有这颗按钮，会误报一次（告警文案里已写明这两种情况属正常）。宁可误报一次，也不要静默失效。
