# dsh-chat-a2ui

DSH 的 Chat 模式插件：左栏一个 Chat 入口，打开一块独立的 Chat 工作区，复用宿主的 Session、分支与上下文机制，只重做入口外壳与消息区。

## 动效语言

**令牌（token）**:
动效的原子取值——时长、缓动曲线、位移距离、弹簧参数。
_Avoid_: 参数、数值、魔数

**角色（role）**:
动效的语义名。它描述"哪一类交互"（消息进入、面板折叠、抽屉展开），组件只说角色，不直接说令牌。
_Avoid_: 预设、动画类型、style

**原语（primitive）**:
组件直接消费的动效构件——一个 hook 或一个包装组件，内部把角色展开成令牌。
_Avoid_: 组件、封装、helper

**动效档位（level）**:
用户可切换的动效强度，只有 full 与 reduced 两档；显式选择优先于系统偏好。
_Avoid_: 模式、theme、设置

**体系（motion system）**:
令牌 → 角色 → 原语三层，加上"组件不得手写令牌"这条约束。
_Avoid_: 库、框架、动画库

## 滚动语言

**贴底跟随（follow）**:
内容增长时自动把视口带向新内容。用户可以随时接管；接管之后由用户决定何时回到跟随。
_Avoid_: 自动滚动、吸底、scroll to bottom

**余量（margin）**:
贴底时内容底部与视口下沿之间**故意**留出的空白，用来让新内容有落点，而不是顶着边缘出现。
_Avoid_: 间距、padding、spacer

**让位（stand down）**:
用户接管滚动后，跟随器停止写视口位置的状态。让位不是关闭功能，是暂停写入。
_Avoid_: 暂停、关闭、unstick

## 验收语言

**验收标准（acceptance criteria）**:
一组可判定通过或失败的判据，分三层：算法层（离线仿真可复现）、交互层（浏览器探针事后判定）、观感（人眼）。
_Avoid_: 测试、check、验收清单

**探针（probe）**:
在页面内记录跟随器每帧输入的观测器，用来事后判定交互层是否守住验收标准。
_Avoid_: 日志、埋点、debug
## 会话语言

**Chat 会话（chat session）**:
宿主 Session 里 `agentPreset = chat` 的那一类：一次对话，不是一个工程。它没有自己的代码目录，也不继承任何项目工作区。
_Avoid_: 聊天窗口、chat、会话（不加限定时会和项目会话混淆）

**项目会话（project session）**:
用户在一个工作区里开的 Session（写代码、跑命令）。与 Chat 会话的区别是**归属**，不是 UI：两者都是宿主 Session。
_Avoid_: 普通会话、原生会话

**Chat 工作区（chat workspace）**:
只承载 Chat 会话的专用 workspace，让它们在左栏是一个干净的分组，而不是散进项目工作区或「未分组」。
_Avoid_: 聊天文件夹、chat 目录

**归档（archive）**:
宿主全局的归档集：从所有分组视图隐藏，保留 workspace 记账，可在 toast 上撤销。**这是本项目唯一的「移除」语义。**
_Avoid_: 删除、移除、清空（宿主没有删除会话的能力，使用这些词会让用户以为数据没了）

**未分组（ungrouped）**:
不属于任何 workspace 的会话在宿主左栏的桶。它是宿主的行为，不是我们的设计选择。
_Avoid_: 其它、默认分组

**行动作（row action）**:
挂在宿主会话行上的插件按钮/菜单项（`sidebar.workspaces.session.row.action` / `.menu.item` / `ctx.contextMenus`）。按 `agentPreset` 判定是否属于 Chat，不按标题猜。
_Avoid_: 右键菜单（那只是一种入口）、操作项
**右栏 tab（rightbar tab）**:
宿主右侧边栏里的一个页面（`sidebar.right.pane.tab`）。类型先注册在 `sidebarRightTabs`，正文再按 `key` 注册；用户只能通过 guide 页的卡片或我们自己放的按钮到达它。
_Avoid_: 右侧面板、抽屉（宿主里没有这两个概念）

**guide 卡片（guide entry）**:
右栏 pane 的「+」打开的入门页上的一张卡片，只来自 `definition.guide[]`（按 `order` 排序、可 pin），**不是历史记录**。
_Avoid_: 最近打开、快捷入口列表
