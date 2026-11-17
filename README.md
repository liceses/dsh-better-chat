# dsh-chat-a2ui

DSH 的 Chat 模式：在原生 Session 壳里换掉消息区，保留流式 Markdown、图片、思考过程、工具卡、新建对话和任意轮分支。对话记录、侧栏、composer、轨迹、上下文管理都复用 DSH 自己的实现。

当前是 **P0**：自研 Chat 视图 + `chat` agent preset。A2UI 表面渲染在 P1 接入。

## 能力

| 能力 | P0 状态 |
| --- | --- |
| 流式 Markdown | 支持，marked + DOMPurify，逐 token 增长 |
| 图片 | 支持会话附件，带灯箱；失败降级 |
| 思考过程 | 折叠面板，流式时显示进度 |
| 工具调用 | 通用折叠卡，参数/结果/错误 |
| 新建对话 | header「新对话」按钮，创建 `chat` preset 的 Session；空白会话先走原生落地页，发出第一条消息后自动进入 Chat UI |
| 任意轮分支 | 每条 turn tail 的「从此分支」，fork 后自动进入 Chat UI |
| 多开 / 独立上下文 | 复用原生 Session，每个 Session 独立 composer 与上下文 |
| 自定义系统提示词 | 插件配置 `systemPrompt` |
| 上下文管理 / 轨迹 / 压缩 | 原生机制不替换 |
| 上下文注入 | 折叠成一条可展开的「已注入上下文」，不占用户气泡 |
| A2UI | P1；P0 保留普通流式文字 |
| 布局动效 | Framer Motion layout + AnimatePresence + spring |

## 安装

把本仓库作为本地插件 link 进 DSH profile。先备份 profile：

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

重启 DSH 桌面端。重启后：

1. 新会话页的 preset 里会出现 **Chat**。
2. 任意 Session 头部出现「新对话」按钮，点击创建 chat 会话；空白会话先显示原生落地页，发出第一条消息后自动进入 Chat UI。
3. 已有 chat 会话会自动补写 `chat-a2ui` 视图偏好；原生 preset 新建的会话也会在 tab 行首次出现时自动切到 Chat UI。若仍停在「对话」，点一次 **Chat UI** 标签即可。

开发时也可以直接把本目录 link 到 profile 的 `node_modules`，再在 profile `package.json` 注册 bundle。

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

`includeRuntimeContext: false` 是默认值：chat preset 的系统提示里不注入工作目录、git 状态等运行时快照，避免把主机细节带进闲聊。

## 安全边界

`chat` preset 通过 `ctx.tools.restrict({ allow: ['web_search', 'web_fetch'] })` 只保留两个联网工具：

- 没有 filesystem、shell、terminal、editor 工具。
- 没有文件写入或命令执行路径。
- 对话本身仍写入 DSH Session（这是记录，不是主机副作用）。
- 如果部署没有注册 web 工具，会退化为 deny 其它所有可限制工具；`run_code` 是 PTC 传输层，此时也没有可调用的端能力。

## 已知限制

- **默认视图选择是宿主的硬约束**：`resolveActiveView` 只认持久化的 `view`，否则回退原生 `chat`，不会自动选第一个 tab。本插件在创建/分支时先写偏好再打开，并对历史 chat 会话做补写；store 已经初始化且仍停在「对话」时，由 `ChatViewSync` 在 tab 行首次出现时点一次 Chat UI，每个 Session 只尝试一次，之后用户手动切回「对话」不会被覆盖。
- 原生新会话页直接选 **Chat** preset 时，View store 可能在选 preset 之前就用旧偏好初始化；`ChatViewSync` 负责在首条消息后把 tab 拨到 Chat UI，不再需要手点。
- P0 只接管消息区；composer、侧栏、header 主体、轨迹都保留原生实现，仅额外加了一个 header「新对话」按钮。
- 新建的空白会话会被宿主强制显示落地页（ConversationMainPanel 的 hero 分支），此时没有 view tabs；发出第一条消息后才出现「对话 / Chat UI / 轨迹」，Chat UI 会按写入的偏好自动选中。
- 分支按钮只在 turn tail 可用；单条 assistant 消息内部不做分叉。
- 图片灯箱、工具卡是通用实现，不包含原生 Chat 的专用 inspector。
- P0 没有 A2UI 表面；prompt 里明确要求纯 Markdown。

## P0 验收（隔离实例）

以下项目在临时 `DSH_HOME` + 本地假模型上实际跑过，不是仅代码审查：

- 流式 Markdown：10 片 SSE 增量增长，标题/列表/引用/代码块/链接正常，过程无整页闪烁。
- 贴底滚动：流式内容变高时不会被浏览器的滚动锚定误判成“用户上滚”；向上滚后出现「回到底部」，点击可重新贴底。
- 图片：会话附件按 `sha256:<64hex>` 引用，异步 `imageUrl` 换成 blob 后渲染；加载中、失败降级、灯箱（Esc / 点遮罩 / 关闭按钮）可用。
- 分支：从第 1 轮和第 2 轮的 turn tail 分叉，子会话标题递增、内容截止到该轮、Chat UI 自动选中。
- 新建会话：落在父会话的 workspace，`agentPreset=chat`；原生 Hero 发出首条消息后自动选中 Chat UI。
- 会话切换：侧栏切换不同 Session 时各自保持独立的历史与滚动。
- 上下文注入：`source.kind=runtime-context` 的节点折叠成「已注入上下文」，展开后显示工作目录，不再渲染成蓝色用户气泡。
- 真实模型：chatweb profile + DeepSeek V4.1 Flash，普通 Markdown 回复在 Chat UI 正常渲染。

未在真机验证的部分：composer 里“图片 + 文字”一起发送（浏览器在注入附件后曾无响应，未复现根因）；深色主题的逐项目测；移动端只做过 390px 宽度检查。

## 结构

```text
src/index.ts                     host：注册 chat preset、系统提示词、web-only 工具限制
src/preset/tool-filter.mjs       preset scope 的工具白名单
src/client/index.tsx             注册 conversation.view + header 新对话 + 偏好补写 + 自动切 tab
src/client/chat-a2ui/
  ChatA2UIView.tsx               消息流容器、滚动、空态
  ChatRow.tsx                    按节点 kind 分发
  Markdown.tsx                   流式 Markdown
  AssistantBlocks.tsx            text / reasoning / tool / image 组合
  ToolCard.tsx                   工具调用折叠卡
  ChatImage.tsx                  图片与灯箱
  Reasoning.tsx                  思考过程
  BranchButton.tsx               从此分支
  ScrollToBottom.tsx             贴底滚动
  style.ts                       CSS（注入一次）
  motion.ts                      spring 常量
src/client/session/
  preferences.ts                 dsh.conversation.<id> 的 view 读写
  actions.ts                     create / fork / seed
  NewChatButton.tsx              header 按钮
  ChatViewSync.tsx               静默把已存偏好的会话切到 Chat UI
```

## 开发

```powershell
npm run typecheck
npm test
npm run build
```

`npm run build` 产出：

- `lib/index.js`：host ESM。
- `lib/client.js`：静态 client bundle，包成 `window.__ModuleLoader__.load({...})`。
- `lib/preset/tool-filter.mjs`。

## P1：A2UI

- `chat_surface` 工具，A2UI JSON 流式输出。
- CopilotKit 渲染器 + 可替换 renderer registry。
- 一键开关 A2UI / 原生文字。
- A2UI 模式完全接管 AI 交互，token 级增量渲染。
- 保留 P0 的 fallback：表面解析失败时退回 Markdown。
