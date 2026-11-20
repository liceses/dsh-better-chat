# dsh-chat-a2ui

DSH 的 Chat 模式：左栏一个 **Chat** 入口，打开一块独立的 Chat 工作区。它复用 DSH 的 Session、composer、轨迹、分支和上下文管理，只重做消息区与入口外壳。对话仍然是普通 Session，可多开、可切换、可从任意一轮分叉。

当前是 **P0.7**：自研 Chat 入口 + 消息区 + 左栏会话列表 + 轨迹抽屉，软玻璃视觉、可切换动效、暗色主题；左栏与原生侧栏共用一条沟槽，思考 / 工具调用收成内容宽的旁注行。A2UI 表面在 P1 接入，当前保留普通流式文字。

## 能力

| 能力 | P0.7 状态 |
| --- | --- |
| 入口 | 左栏 **Chat** 面板；主面板独立，不占用原生 conversation |
| 流式 Markdown | 支持，marked + DOMPurify，逐 token 增长 |
| 图片 | 会话附件、粘贴图片、灯箱；失败降级 |
| 思考过程 | 折叠旁注行，流式时带转圈；展开后左侧细线挂正文 |
| 工具调用 | 折叠旁注行：状态点 + 工具名 + 状态；参数 / 结果在展开区。Chat preset 自带 web_search / web_fetch |
| Markdown | marked + DOMPurify；紧贴中文的粗体、外链 target/rel 都已修正 |
| 视觉 | Soft glass 侧栏/header/composer；active 行共享 layoutId；左栏卡片与原生导航行同一条 14–266 沟槽，「新对话」左对齐、行尾「+」 |
| 动效开关 | 侧栏 ✦ 可切换 full / reduced，localStorage 持久化 |
| 暗色 | 跟随宿主 `body[data-ds-dark-theme]`，消息区、卡片、侧栏、composer 同步 |
| 新建对话 | Chat 头部「新对话」、左栏「新对话」；空白会话直接显示 Chat 空态 |
| 原生新建会话 | Chat 打开期间，左栏原生「新建会话」与宿主自己的快捷键（桌面端 Ctrl/⌘+N，Web 端 Ctrl/⌘+Alt+N）被接管为新建 Chat 对话；判据见 `chat-mode/host-affordance.ts`，宿主改版时挂载自检会告警 |
| 任意轮分支 | 每条 turn tail 的「从此分支」，子会话自动成为当前 Chat |
| 多开 / 独立上下文 | 每个 Chat 是独立 Session，左栏列表可切换，历史互不污染 |
| 自定义系统提示词 | 插件 host 配置 `systemPrompt` |
| 上下文管理 / 压缩 | 原生机制不替换 |
| 上下文注入 | 折叠成一条可展开的「已注入上下文」 |
| 轨迹 | Header「轨迹」打开右侧抽屉，内嵌原生 trajectory 视图 |
| 滚动归属 | Chat 主面板内滚动；原生 conversation 的 Chat UI tab 走外层滚动，两者不嵌套 |
| 退出 | Header 返回箭头回到原生 conversation，原生工作区恢复 |
| A2UI | P1；宿主**没有** A2UI 运行时（无包 / 无工具 / 无渲染器，见 `docs/research/a2ui-host.md`），规范在运行时内置的 `a2ui` 技能里（32 组件语法）；接入意味着插件自建协议解析 + 渲染器。当前保留普通流式文字，不显示假的 A2UI 入口 |
| 布局动效 | Framer Motion layout + AnimatePresence + spring；reduced 档只停常驻循环动画，保留颜色过渡 |
| 过程行密度 | 相邻思考 / 工具行收紧到 10px；只有正文行才占页脚 |
| 权限选择 | Chat 面板内隐藏原生 permission chip；preset 能力固定 |

## 安装

把本仓库 link 进 DSH profile。先备份 profile：

```powershell
$ErrorActionPreference = 'Stop'
$profileDir = 'C:\Users\ROG\.dsh\profiles\desktop'
Copy-Item -LiteralPath "$profileDir\package.json" -Destination "$profileDir\package.json.bak-$(Get-Date -Format yyyyMMdd-HHmmss)" -Force
```

在 `package.json` 的 `dependencies` 增加：

```json
"dsh-chat-a2ui": "link:D:/developing/DSH-plugin/dsh-A2UI"
```

并在 `dsh.profile.bundles` 末尾加入 `"dsh-chat-a2ui"`，然后安装依赖：

```powershell
Set-Location 'C:\Users\ROG\.dsh\profiles\desktop'
pnpm install
```

重启 DSH 桌面端。重启后左栏出现 **Chat** 面板；原生新会话页的 preset 里也会出现 **Chat**。

## 使用

1. 点左栏 **Chat**。插件会选中最近更新的 Chat 会话；一个都没有时自动创建一个空白会话。
2. 直接在底部原生 composer 输入。首条消息发出后空态自动变成正常消息流。
3. 头部「新对话」或左栏「新对话」创建新会话；左栏列表切换会话。
4. Chat 打开时，点左栏原生 **新建会话** 或按宿主自己的新建快捷键（桌面端 **Ctrl/⌘+N**，Web 端 **Ctrl/⌘+Alt+N**），仍留在 Chat 里新建，而不是跳到原生 conversation。
5. 每条回答末尾的「从此分支」以该轮结束点 fork，子会话自动成为当前 Chat。
6. 头部「轨迹」打开右侧轨迹抽屉。
7. 头部返回箭头回到原生 conversation；原生左栏、主面板和当前会话都会恢复。

Chat 会话本身是普通 DSH Session，记录、分支、上下文快照与压缩都走宿主机制。会话会落进 DSH 的 session 存储，这是对话记录，不是文件或命令副作用。

## 配置系统提示词

插件的 host 配置支持覆盖默认 prompt：

```yaml
- id: chat-a2ui
  name: dsh-chat-a2ui
  config:
    systemPrompt: |
      你是一个简洁、友好的中文聊天助手。
      需要最新信息时使用 web_search / web_fetch。
    presetName: Chat
    presetDescription: 只聊天，可以联网搜索
    includeRuntimeContext: false
```

`includeRuntimeContext: false` 是默认值：Chat preset 的系统提示里不注入工作目录、git 状态等运行时快照，避免把主机细节带进闲聊。修改后需要重启应用；它影响之后由该 preset 创建的 Chat 会话。

## 安全边界

`chat` preset 自己组合 `@deepseek-ai/dsh-tool-web`（web_search / web_fetch），再通过 `ctx.tools.restrict({ allow: ['web_search', 'web_fetch'] })` 只保留这两个联网工具：

- 没有 filesystem、shell、terminal、editor 工具。
- 没有文件写入或命令执行路径。
- web-app 层把全局 `tool-web` 关掉了；如果 preset 不自己组合，Chat 会话会没有任何联网工具。本插件已修正，并用 `tests/host.test.ts` 锁住插件顺序。
- `run_code` 是 PTC 传输层，但 Chat preset 没有可调用的端能力。
- Chat 面板只重做 UI；没有新增网络端口，也没有自建会话存储。

## 已知限制

- **不是零落盘**：Chat 复用 DSH Session，对话记录、附件和分支会由宿主持久化。插件不额外写业务数据。
- **Chat 是主面板，不是原生 conversation 的 View**：点左栏 Chat 打开独立面板；原生 conversation 里的 **Chat UI** tab 仍然保留，需要手动选择。插件不再自动改任何会话的 View 偏好。
- **刷新后回到原生 conversation**：Chat 的当前选择只在内存里。重新点左栏 Chat 会选最近的 Chat 会话，不保证是刷新前精确选中的那一个。
- **A2UI 还未接入**：prompt 明确要求纯 Markdown；Header 不显示 A2UI 入口，避免把未完成的能力伪装成开关。
- **窄窗受限**：DSH 桌面壳在约 1000px 以下不会收起原生侧栏，Chat 面板会被原生侧栏挤压。390px 手机模拟不可用；这是宿主布局限制，不是 Chat 视图自身。
- **图片输入**：已实测“粘贴图片 + 文字”发送；文件选择器路径未在浏览器自动化里验证。
- **非 chat 会话**：Chat 面板只展示 `agentPreset=chat` 的 Session；原生会话不会出现在 Chat 左栏里。
- **旧会话没有 web 工具**：P0.6 之前创建的 Chat 会话沿用了旧 preset，不会追溯获得 `chat-web-tools`；需要新开一条 Chat 对话。
- **左栏会话列表隐藏滚动条**：为了让行、表头和「新对话」右边缘对齐，滚动条不再占位；列表很长时靠滚轮 / 触控板 / 键盘滚动。

## P0.7 验收

P0.7 只动左栏几何与过程行样式，验收在 `chatweb` profile 的独立实例（`--profile chatweb --port 11778`）+ 真实 DeepSeek V4.1 Flash + 浏览器自动化下完成：

- 左栏对齐：卡片外缘 14–266 与原生导航行完全重合（改前 18–295.3，越过 280 侧栏）；表头 / 新对话 / 会话行三处框均为 22.7–257.3；行内文字 30.7 / 31.3 一条竖线。
- 行宽一致：列表滚动条不再占位（改前行右边缘 273.7 vs 按钮 284.7，差 11px）。
- 过程行：思考与工具调用宽度 62 / 173px（改前铺满 736px），相邻过程行 33–34px（改前 44–80px），无卡片底色与描边。
- 流式：真实 web_search + web_fetch 跑完一轮，过程行从「运行中」到「已完成」；正文流式带行尾光标，不再出现长条卡片。
- 暗色：`body[data-ds-dark-theme]` 下同一套旁注行无白底残留。
- 守卫：`tests/smoke.test.ts` 断言插件注册与面板/视图/header 入口；样式的守卫在 `tests/style-split.test.ts`——它拿 `tests/fixtures/style-before.txt`（拆分前的完整样式表）做**规则多重集**与**级联等价性**比对，任何一条声明被改动或丢失都会红。

## P0.6 验收

以下项目在 `chatweb` profile + 真实 DeepSeek 模型 + 浏览器自动化下实际跑过：

- 入口：左栏 Chat → 独立主面板，原生 conversation 不被替换。
- 空白态：新建 Chat 显示 orb +「开始聊天」+ 底部 composer；发首条消息后就地变成消息流。
- 工具：新 Chat 会话真实调用 web_search，卡片从「运行中」到「已完成」，模型返回带来源链接的中文总结。
- Markdown：模型输出 `**总结：**因…` 时不再露出星号；链接带 `target=_blank` 与 `rel=noopener noreferrer`。
- 暗色：给宿主 `body` 加 `data-ds-dark-theme` 后，消息区、卡片、侧栏、header、composer 全部切到暗色，无白底残留。
- 动效开关：点侧栏 ✦，页面 `data-motion` 从 full 切到 reduced，刷新后保持；再点恢复。
- Composer：权限 chip 在 Chat 面板内隐藏，原生 conversation 不受影响。
- 流式 Markdown：正文、行内代码、列表随 SSE 增长，无整页闪烁。
- 贴底滚动：Chat 主面板内滚动、原生 Chat UI tab 外层滚动，两条路径都实测；内容变高保持贴底，消息在 composer 上方结束。
- 图片：把 PNG 放进系统剪贴板后 Ctrl+V，composer 显示附件；发送后用户气泡显示图片，assistant 正常 Markdown 回复。
- 原生新建会话拦截：Chat 打开时点左栏「新建会话」仍留在 Chat。
- 会话切换：左栏不同 Chat 会话各自独立历史。
- 分支：从第 1 / 第 2 轮 turn tail 分叉，子会话包含该轮完整历史并自动切换。
- 轨迹：Header「轨迹」打开右栏抽屉，内嵌原生 trajectory。
- 退出：Header 返回箭头回到原生 conversation；原生左栏与主面板恢复。
- 真实会话记录：标题、分支标题递增（如 `Greeting (1)`）由宿主生成。

未覆盖：真实文件选择器上传、移动端 / 390px 布局、长时间运行的虚拟列表性能、BorderTrail 在真实运行中的逐帧观感。

## 结构

```text
src/index.ts                     host：注册 chat preset、系统提示词、web-only 工具限制
src/preset/tool-filter.mjs       preset scope 的工具白名单
src/client/index.tsx             注册 Chat 主面板、sidebar Chat 行、原生 Chat UI view、header 新对话
src/client/chat-mode/
  controller.ts                  选择 / 新建 / 分支 / 返回 / 左栏挂载
  ChatPage.tsx                   主面板根，retain 独立 Session 引用
  ChatWorkspace.tsx              Chat header、原生 conversation.content、轨迹抽屉、新会话拦截
  ChatSessionList.tsx            左栏 Chat 会话列表
  ChatPanelIcon.tsx              左栏面板图标
  select.ts                      按 agentPreset=chat 过滤与排序
  host-affordance.ts             宿主「新建会话」入口的判据（含挂载自检）
  useChatMode.ts                 useSyncExternalStore 绑定
src/client/chat-a2ui/
  ChatA2UIView.tsx               消息流容器、内滚动、空态
  ChatRow.tsx                    行渲染：按 RowView 查表，含兜底未知行
  row-model.ts                   节点数据 → RowView 的收窄与分派（不依赖 React）
  Markdown.tsx                   流式 Markdown、残留粗体提升、链接加固
  AssistantBlocks.tsx            text / reasoning / tool / image 组合
  ToolCard.tsx                   工具调用折叠卡
  ChatImage.tsx                  图片与灯箱
  Reasoning.tsx                  思考过程
  BranchButton.tsx               从此分支
  ScrollToBottom.tsx             贴底滚动的适配层：容器解析、rAF 循环、事件接线
  style.ts                       样式组合层：六块按固定顺序拼好 + 动效变量块
  styles/base.ts                 重置与根变量、滚动骨架、外层滚动、主题变量、P0.6 玻璃变量
  styles/flow.ts                 消息流：空态、行、气泡、附件、思考、工具卡、Markdown、提示
  styles/composer.ts             输入区：空白会话把常驻输入框压底、抽屉里隐藏自带输入框
  styles/list.ts                 左栏会话列表与侧栏行图标
  styles/lightbox.ts             灯箱（顶层选择器，不套 .caui-root）
  styles/misc.ts                 Chat 模式页面外壳、轨迹抽屉、状态页、页面级断点
  motion-config.ts               读 motion.config.json：类型 / 兜底 / 校验
  motion-roles.ts                角色 → 展开（reduced 档把位移/缩放/模糊归零）
  motion-hooks.ts                useRole / useEnter / useStream（跟随档位重渲染）
  motion-scope.ts                useMotionAttribute：data-motion 的唯一出口
  motion-preference.ts           档位状态（full / reduced）与切换
  motion.ts                      存量兼容层：只剩 spring / layoutSpring / reducedMotion
  follow-controller.ts           跟随状态机：贴不贴底、写多少、什么时候让位（五个入口都问它）
  scroll-follow.ts               跟随物理：位置独立、单帧位移 ≤ maxSpeed×dt
  scroll-ownership.ts            谁是滚动体、这次位移是谁写的
  scroll-frame.ts                每帧观测的形状（FollowFrame）
  scroll-probe.ts                探针与 checkEntries（验收判据的唯一实现）
src/client/session/
  actions.ts                     create / fork
  NewChatButton.tsx              原生 header 的新对话入口
```

## 动效配置

界面里所有动效数值都在仓库根的 **`motion.config.json`**，没有写死在组件里。

> 这个文件里还有 `scroll` 一节：它不是动效令牌，而是**滚动跟随的行为参数**（速度上限、余量、归属容差、三个时间窗）。放在同一份配置里是因为它们也要「改一个数，全仓生效」，但改它之前请先看下一节的验收标准。

- `springs.*`：行入场 / 容器尺寸 / 折叠体的 spring（stiffness / damping / mass）。
- `row.enter` / `row.exit`：行进场位移与透明度、退场时长与缓动。
- `css.*`：流式光标、状态点脉冲、思考转圈、空态 orb 的循环周期，写成 `--caui-motion-*` 变量。
- `textEffect` / `animatedGroup` / `shimmer` / `scramble` / `borderTrail` / `progressiveBlur`：各处 motion-primitives 的预置与参数。

读法是**构建期内联**：esbuild 把 JSON 打进 `lib/client.js`，所以发布包不依赖这个文件存在（`package.json` 的 `files` 不变）。改完配置要 `npm run build`，应用里刷新窗口生效。

配置写错不会白屏：缺键 / 类型不对 / 枚举越界的那个叶子退回 `DEFAULT_MOTION`（见 `motion-config.ts`）并 `console.warn` 一次，其余照常。

## 滚动探针（排查「莫名其妙跳一下」）

滚动跟随分三层：**跟多少**在 `scroll-follow.ts`（纯函数）、**谁在滚 / 这次位移是谁写的**在 `scroll-ownership.ts`、**怎么接 DOM 与 rAF** 在 `ScrollToBottom.tsx`。三层都不靠肉眼，所以内置了一个探针：

**打开**（二选一）：

- 地址栏加 hash：`http://127.0.0.1:11778/#caui-probe`，刷新；
- 或控制台 `localStorage.setItem('caui:probe','1')` 后刷新；关掉是 `localStorage.removeItem('caui:probe')`。

右下角会出现一个 HUD（`top / content / margin`、`rate / target`、`Δ`，末尾是 fps 与条数），记录是**环形缓冲**（6000 条），关掉探针即停止。

**取数据**（控制台）：

```js
__cauiProbe.tail(60)    // 最近 60 条，JSON
__cauiProbe.dump()      // 全量
__cauiProbe.save()      // 下载 caui-probe.json
__cauiProbe.clear()     // 清空（复现前先清一次）
__cauiProbe.scrollUp(200)  // 不用真的滚，直接模拟上滚 200px
__cauiProbe.off()       // 停止记录
```

**记录的事件**：

| `kind` | 含义 |
| --- | --- |
| `tick` | 跟随循环每帧（节流 50ms），字段就是 `FollowFrame`：`top / content / margin / target / rate / moved / dt / stick` |
| `scroll` | 每个 scroll 事件：`top / delta / ours`（是否我们写的）`/ w`（我们的基准）`/ stick / h` |
| `external` | 每帧自查发现「位置被别人动过」：`top / delta`（相对基准）`/ stick`（不依赖 scroll 事件，事件被推迟时也能抓到） |
| `mut` | 消息流 DOM 变更：`n / h / top / rows / lastH` |
| `unstick` | 停止跟随的原因：`by: wheel｜touch｜scroll` |
| `session` | 会话切换标记（`ChatWorkspace` 每次换会话自动打一条）；B4 只有打了标记才判 |
| `error` | 运行期 JS 错误（`error` / `unhandledrejection`），B5 的测量来源 |

**复现一次跳动的流程**：`__cauiProbe.clear()` → 正常用（滚轮、拖选、切会话）→ 跳动发生时立刻 `__cauiProbe.save()`，把 JSON 发我；或者直接贴 `__cauiProbe.tail(60)`。

探针状态挂在 `window.__cauiProbeState` 而不是模块作用域——插件 bundle 被宿主求值不止一次时，模块级变量会分裂成两份（HUD 有数、`tail()` 读出 0）。

## 动效体系

组件**不许**自己写时长/曲线/弹簧参数。三层结构：

| 层 | 文件 | 谁改 |
| --- | --- | --- |
| **令牌 tokens** | `motion.config.json` → `tokens` | 想整体调快/调慢、换缓动曲线时改这里 |
| **角色 roles** | `motion.config.json` → `roles` | 想改「消息进场是弹簧还是淡入」时改这里 |
| **原语 primitives** | `motion-hooks.ts` | 很少改；新交互类型才加 hook |

组件这样消费：

```tsx
const enter = useEnter('message.enter')      // { initial, animate, transition }
const exit = useRole('message.exit').exit    // 单字段投影直接用 useRole
const transition = useRole('panel.collapse').transition
const stream = useStream('text.stream')      // 流式逐字的 时长 / 模糊 / 错峰
const attrs = useMotionAttribute()           // { 'data-motion': level }，档位唯一出口
```

**动效档位 full / reduced**：语义在 `motion-roles.ts` 统一实现——位移、缩放、模糊归零（前庭刺激），不透明度与颜色保留但压到 `tokens.dur.reduced`；`system.spin` / `system.blink` 保留，它们是状态指示。

**改观感的正确姿势**：改 `motion.config.json` → `npm run build` → 刷新。改完 `npm test` 会核对「每个角色引用的令牌都存在」「reduced 语义没破」。

**新增一个角色**：在 `roles` 加条目（只引用令牌名）→ 在 `ROLE_IDS` 补名字 → `npm test` 会告诉你还有哪没对齐。

### 门禁

```powershell
npm run lint:motion    # 组件里出现手写 duration / ease / stiffness 就失败
```

存量写在 `motion-allowlist.json`：**只许减**（条目数有上限，且每条必须仍能命中；失效条目也报错）。B3 之后已清零（`0/0`），新代码没有任何豁免空间。

CSS 侧同样走令牌：`styles/*.ts` 里的过渡时长与缓动全部是 `var(--caui-dur-*)` / `var(--caui-ease-*)`，所以「改一个数，framer 与 CSS 一起变」。

## 滚动跟随的验收标准

改这个模块之前先确认「改完算不算好」。A 组自动守（`sim:scroll` + `npm test`），B 组在浏览器里一行判定：`__cauiProbe.check()` **只读同一份日志、只用一处阈值**（`scroll-probe.ts` 的 `LIMITS`）。

`check()` 的返回里有两个布尔量，别只看 `pass`：

- `complete`：九条判据**都测到了**。B1/B2 需要有用户上滚（滚轮/拖选都算），B4 需要有会话切换（切会话时自动打标记），A3 需要最后停在底部。
- `unverified`：没测到的判据编号。**缺测量不等于通过**——`unverified` 非空时 `pass` 一定为 `false`，并会点名缺哪条。

一次完整的验证：`__cauiProbe.clear()` → 发一条长回答，中途滚上去再滚回底部 → 切一次会话 → `__cauiProbe.check()`。

### A · 算法（离线，`npm run sim:scroll` + `npm test`）

| # | 判据 | 阈值 |
| --- | --- | --- |
| A1 | 可见位移**速度** | ≤ `maxSpeed`（与帧率无关；60fps 下 44px/帧、30fps 下 78px/帧都合法），7 种投喂模式全过 |
| A2 | 方向反转 | ≤ 8 次 / 场景 |
| A3 | 停止后落点 | 距真底部 ≤ 1px |
| A4 | 生成期余量 | ≥ `minMargin × 0.6` |
| A5 | 内容短于视口 | position 恒为 0 |
| A6 | 超长帧（后台回来） | 只按 64ms 推进 |

### B · 交互（浏览器，探针）

| # | 判据 | 阈值 |
| --- | --- | --- |
| B1 | 用户上滚后 500ms 内跟随器写入 | 0 次（`tick.moved` 全 0） |
| B2 | 用户上滚后位置漂移 | ≤ 2px / 1s |
| B3 | 重新吸附的触发条件 | 只发生在 `delta > 2` 的滚动之后 |
| B4 | 切会话 / 打开会话 | 单次落位，之后连续 10 帧 moved ≤ 1 |
| B5 | 运行期 JS 错误 | 0 |

### C · 观感（人判断，但有对应数字）

| # | 判据 |
| --- | --- |
| C1 | 250px 批量到达时没有「整块顶上来」；对应 `check().move.maxVelocity ≤ 2600` |
| C2 | 生成期间底部始终有余量；对应探针里的 `margin ≥ 120` |

复现完跑一句 `__cauiProbe.check()`，`pass: true` 才算过。

## 跟随核心算法（先验证，再接界面）

滚动跟随的纯函数在 `src/client/chat-a2ui/scroll-follow.ts`，它的三条性质是**设计出来的**，不是调出来的：

1. **位置是独立状态**（不是 `scrollTop = 内容高度 - 视口`），所以内容一次到多少都不会直接把位置拽走；
2. **单帧位移 ≤ `maxSpeed × dt`**：900px 的整段到达也只是一段约 0.35s 的滑行；
3. **余量（margin）** 让目标停在内容底部之上，并按生成速度预开——所以最后一行不会顶着视口下沿出现。

改这三个数之前先跑离线验证，它会按 60fps 在 7 种「宿主投喂模式」（token 级 → 900px 整段 / 停顿后爆发）下模拟，并检查单帧位移、方向反转、结束落点；任何一条不满足就以非零码退出：

```powershell
npm run sim:scroll
```

```
模式 | maxMove | p95 | marginMin | marginMax | finalGap | 方向反转
token 级（每帧 20px） | 21 | 20 | 177 | 177 | 0 | 2
900px / 3s（整段）     | 43 | 43 | 177 | 177 | 0 | 0
上限 maxSpeed×dt = 44.3px；全部通过
```

同一套场景也在 `tests/scroll-follow.test.ts` 里做了断言，所以 `npm test` 会一起守住。

## 开发

```powershell
npm run typecheck
npm test
npm run build
node scripts/verify-bundle.mjs
npm run sim:scroll     # 跟随核心的离线仿真（也进 tests）
```

`npm run build` 产出：

- `lib/index.js`：host ESM。
- `lib/client.js`：静态 client bundle，包成 `window.__ModuleLoader__.load({...})`。
- `lib/preset/tool-filter.mjs`。

## P1：A2UI

- `chat_surface` 工具，A2UI JSON 流式输出。
- CopilotKit 渲染器 + 可替换 renderer registry。
- 一键开关 A2UI / 原生文字；A2UI 模式完全接管 AI 交互。
- Framer Motion layout + AnimatePresence + spring，让组件随 JSON 流生长并推挤排版。
- 表面解析失败时退回 P0 的 Markdown。
