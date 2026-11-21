# ADR 0003 · Chat 会话的归属、归档与右侧边栏

## 背景

Chat 会话目前是「宿主 Session + `agentPreset = chat`」，但它在三件事上没有明确模型：

1. **归属**：`createChatSession` 会从父会话反查 `workspaceId` 与 `cwd` 再传给 `sessions.create`，于是 Chat 会话落在项目工作区里，和工程会话混排。
2. **移除**：Chat 列表只增不减，没有任何管理动作。
3. **入口**：Chat 只有主面板一个表面。

本轮把这三件事定下来。依据是两份对宿主包的实读（`.dsh-test-cli/node_modules/@deepseek-ai`，版本 0.2.2-rc.3）：
宿主**没有**删除会话的能力，只有可撤销的 `archiveSession` / `unarchiveSession`；
`workspaceId` 与 `cwd` 都是可选的，省略后会落进左栏的「未分组」桶；
右侧边栏是完整的多 pane / 多 tab 停靠体系，tab 类型只能通过 `definition.guide[]` 出现在用户面前。

## 决策

### 1. 归属：Chat 会话住进专用工作区

- 新增 **Chat 工作区**：一个只承载 Chat 会话的 workspace，目录 `~/.dsh/chat`，左栏名「Chat」。
- 插件首次挂载时**幂等创建**：不存在就 `ctx.workspaces.create({ path })`，已存在就复用；用户删掉它则下次挂载重建。
- `createChatSession` **不再继承**父会话的 `cwd` 与 `workspaceId`，改为投进 Chat 工作区。
- 为什么不是「不归属」：省略归属只会让会话掉进宿主的「未分组」桶，仍然和项目会话同居一栏；专用工作区才是「有自己的家、项目工作区保持干净」。

**未决（实现前必须解决）**：浏览器侧拿不到 `~` 这类宿主路径。`workspaces.create` 要求 `path` 是**已存在**的目录。
候选解法：宿主半（`src/index.ts`，Node 运行时）`mkdir -p` 并把路径通过某种桥接暴露给客户端；若桥接不可行，退回「取第一个 Chat 会话的 cwd」或「一次性 `pickDirectory`」。

### 2. 移除：只做归档，不做删除

- 用户可见动作只有**归档**（宿主原生，带「撤销」toast）。`GLOSSARY.md` 里明确 `Avoid: 删除`。
- Chat 列表默认隐藏已归档，头部提供「显示已归档」开关（本地状态，不写宿主偏好）。
- 依据：宿主全栈没有会话删除入口；`session/*` 24 个远程方法无一删除；唯一内部 `_deleteSession` 是 SQLite 索引维护。

### 3. 管理动作：挂宿主已有的三个位置

- `sidebar.workspaces.session.row.action`（行尾 hover 按钮，桌面）
- `sidebar.workspaces.session.menu.item`（「…」菜单，触屏可达；宿主契约明确要求同时贡献）
- `ctx.contextMenus.register({ target: 'session' })`（右键）

动作集合：**归档 / 取消归档**（宿主能力）、**重命名**（复用 `session.rename` 命令，不自己调 `session/rename`）。
归属判定一律按运行时的 `agentPreset === 'chat'`，不按标题或来源猜。

### 4. Chat 是一个独立世界，左栏归它

**Chat 模式打开时，左栏就是 Chat 会话列表**；离开 Chat，左栏恢复成宿主的工作区树。

- 实现方式是占用 `sidebar.workspaces`（`kind: 'single'`，谁注册谁渲染），由 `controller.mount()` 安装、`unmount()` 撤回。
- 这在宿主契约里是**顶替**而不是追加——但这正是设计意图：Chat 界面里的内容由我们绘制，和原生界面没有耦合，所以左栏也应该换成 Chat 的列表。
- 宿主左栏没有任何「追加一组」的座位（只有单行装饰、面板入口、底部按钮条），所以「与原生工作区树并排显示 Chat 分组」在契约里不存在。**不要尝试在面板内部再造一条列表**（那是双层左栏，2026-11-22 试过并撤销）。
- Chat 会话仍然属于专用的 Chat 工作区（见第 1 条）：这样即使离开 Chat 模式，它们在宿主的树里也是一个干净的分组，而不是散进项目工作区。

### 5. 右侧边栏 tab

- 注册一个 page 类型：`kind: 'chat'`，`multiple: false`，`keepMounted: true`（切走不丢草稿）。
- **入口两条**（宿主惯例）：`definition.guide[]` 的卡片（点 pane 的「+」→ guide 页 → 「Chat」胶囊）+ `conversation.session.header.utilities` 里的会话头部按钮（开/关，打开前先查重）。
- **与主面板相互独立**：右栏 tab 持自己的 `ChatModeController` 实例（自己的 `activeSessionId` 与 retain），所以主面板聊 A、右栏聊 B 是正常用法。
- tab 正文顶部是一条紧凑会话下拉（当前标题 + ▾），用于在 tab 内切会话。
- 依据：宿主没有「tab 类型选择器」且明确不做；`guide[]` 是唯一被机制承认的自我推广位；guide 卡片不是历史记录。

## 后果

- `ChatModeController` 从「`apply()` 里建的单例」变成「可以被建多份」；主面板与右栏各持一份，共享的只有 `sessions` / `workspaces` 服务和 Chat 工作区。
- 归档动作会出现在宿主的会话菜单里，**对所有 chat 会话**生效（包括从主面板开的），这是有意的：同一份数据只该有一套动作。
- 右栏 tab 在「没有任何 session 挂载」时不能 `openTab`（宿主会抛 `no session surface is mounted`），入口按钮要按 `sidebarRight.mounted` 决定可用性。
- 宿主文档 `sidebar-right.md:41` 与 `:142-148` 对 shipped kinds 的数目自相矛盾（3 vs 5），以代码为准是 5 个；本项目不依赖这个数字。
