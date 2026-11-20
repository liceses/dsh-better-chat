# DSH 宿主 A2UI 支持现状扫描

扫描时间 2026-11-20。宿主 = 桌面版 DSH（Electron 壳 + `~/.dsh/profiles/node_modules` 里安装的运行包）。
方法：自带 asar 解析器读 `app.asar`（207 MB，21 717 条目）；对 `@deepseek-ai` 包做 `rg -L`（跟随 junction）全量内容检索，含反例对照。

> 版本锚点（不一致，实测为准）：运行中的 `@deepseek-ai/dsh` = **0.2.1-rc.5**（`C:\Users\ROG\.dsh\profiles\node_modules\@deepseek-ai\dsh\package.json`），而桌面包清单写 **0.2.2-rc.3**。

## 1. 有没有名为 a2ui 的包／模块

**未找到。**

- 桌面运行时清单 `D:\applications\dshDesktop\resources\app.asar\dsh\package.json`：`"name": "@deepseek-ai/dsh-desktop-runtime"`、`"version": "0.2.2-rc.3"`，336 个 `@deepseek-ai` 依赖，`a2ui` 命中 0。
- 已安装的 240 个包 `C:\Users\ROG\.dsh\profiles\node_modules\@deepseek-ai\`：目录名 `*a2ui*` 命中 0。
- `dsh` 包自带的 305 个嵌套包 `...\@deepseek-ai\dsh\node_modules\@deepseek-ai\`：命中 0。
- 全盘唯一的 "a2ui" 包是我们自己的插件：`C:\Users\ROG\.dsh\profiles\chatweb\node_modules\dsh-chat-a2ui` = SymbolicLink → `D:\developing\DSH-plugin\dsh-A2UI`，其 `package.json` 为 `"name": "dsh-chat-a2ui"`、`"version": "0.1.0"`、`exports: {".": "./lib/index.js", "./client": "./lib/client.js", "./preset/tool-filter": "./lib/preset/tool-filter.mjs", "./cordis.patch.yml": ..., "./package.json": ...}`。**它不是宿主包。**

## 2. 有没有注册 a2ui_render / a2ui_ask 这类工具

**未找到。**

- `a2ui_` / `a2ui-` 在 305 个运行包内命中 **0 个文件**；`a2ui`（忽略大小写）命中 3 个文件，全部是 base64 噪声（`dsh-client-ui-sidebar-documentpreview\lib\client.pdf.js`、`dsh-experimental-inspector\lib\devtools\entrypoints\lighthouse_worker\lighthouse_worker.js` 内嵌的二进制串），无 A2UI 语义。
- 宿主确实有工具定义机制，需要时照此注册：

```ts
// ...\dsh-tools\lib\types\index.d.ts:24
export { defineTool, valueSchemaSpecToJsonSchema, parameterSchemaSpecToJsonSchema,
         validateArgs, ToolArgsError, type DefineToolOptions, ... } from './schema.ts';
```

入参形状是宿主自有的 **ValueSchemaSpec → JSON Schema**（`ParameterSchemaSpec` / `ObjectValueSchemaSpec` 等），**不是 zod**。目前没有任何 `a2ui_render`/`a2ui_ask` 使用它。

## 3. A2UI 消息／组件的协议定义在哪

**未找到。没有 TS 类型、JSON Schema 或枚举。**

- 协议特征串在 305 个包内各命中 0 个文件：`beginRendering`、`surfaceUpdate`、`dataModelUpdate`。
- 题面给的参考路径 `C:\Users\ROG\.dsh\skills\a2ui\` **不存在**（`Test-Path` = False）；`C:\Users\ROG\.dsh\skills\` 下 60+ 个技能目录无 a2ui；`rg 'A2UI'` 于该目录命中 0；按短语 `A2UI 1.0 Express`、`32-component` 检索 `.agent-presets`、`_skill-build`、`plugin-artifacts`、`skills` 全部命中 0。
- 备注（不推测）：本次会话的技能目录里确实列出 `a2ui`，但上述位置找不到它的实体文件，来源未定位。

组件清单／关键字段无从摘录 —— 宿主侧不存在该定义。

## 4. 插件要渲染 A2UI，宿主有没有公开渲染入口

**没有 A2UI 渲染器（无组件、无注册函数、无 CSS 变量）。** 宿主只提供**通用座位（slot）**，渲染实现必须插件自带。

```ts
// ...\dsh-client-ui-model-selection\lib\types\client\slots.d.ts（示例即契约）
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface SlotMap {
    'conversation.input.model.label': { kind: 'single'; scope: 'session'; inline: true; owner: ModelLabelOwner };
  }
}
// 用法：
//   ctx.slots.inject('...', () => ctx.slots.register({ name: '...' }, Component))
```

可用的关键座位（均实测存在）：

- `...\dsh-client-ui-tool\README.zh.md:39-43`：`ctx.slots.register({ name: 'tool.call.toolview', key: '<wire tool name>' }, BusinessToolRow)` —— **按工具名挂自定义结果视图**，这是最贴近 a2ui_render 的入口。
- `...\dsh-client-ui-chat\lib\types\client\contract\slots.d.ts:338-348`：`'conversation.chat.node': { kind: 'keyed'; scope: 'session'; keyProps: { [Kind in ChatNodeKind]: ... } }` —— 按宿主枚举 `ChatNodeKind` 分行渲染，**不能挂任意 A2UI 载荷**。
- `'shell.overlay'`：全屏覆盖层（多处 `PropsRuntime<'shell.overlay'>`）。
- 静态资源靠 `ctx.webServer.register` 自己开路由。

## 5. 有没有现成范例

**宿主侧 A2UI 范例：未找到**（无测试夹具、无 demo、无示例插件）。

最接近的可复用范例是**非 A2UI** 的 `show_html` 插件：

```
D:\developing\DSH-plugin\showmeWithHTML\docs\0.1.7-native-preview-compat-plan.md:31
| 宿主 | show_html 工具（手写定义，非 defineTool）+ 一条 ctx.webServer.register 路由，带工作区围栏 |
| 客户端 | 三个座位：tool.call.toolview（keyed by show_html）、shell.overlay（画面内全屏）、conversation.input.left（输入框捕获） |
```

即：**连宿主自带的"在对话里渲染 HTML"都是插件实现的**，宿主只给座位和路由。

## 6. 对插件的含义

1. **协议我们定**：宿主没有 A2UI 包、类型、schema，32 个组件的消息/字段/校验全由插件自己定义并自校验，别指望宿主兜底。
2. **工具我们注册**：`a2ui_render`/`a2ui_ask` 要用 `defineTool` 自建，参数走 ValueSchemaSpec→JSON Schema（不是 zod）。
3. **渲染我们实现**：宿主只给 `tool.call.toolview`（按工具名 key）等座位，React 组件、样式、主题变量、交互状态都是插件自己的活。
4. **通道我们搭**：静态资源/预览页需 `ctx.webServer.register` 自开路由，并自己做路径围栏（照 showme 的越界 403 / 不存在 404 / 类型 415）。
5. **版本要防漂**：运行包 0.2.1-rc.5 与桌面清单 0.2.2-rc.3 已不一致，slot 契约以实际安装的 `.d.ts` 为准。
