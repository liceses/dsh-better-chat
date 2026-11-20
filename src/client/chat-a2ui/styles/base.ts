/**
 * 基础层：重置、根设计变量、滚动骨架。
 *
 * 这是最先拼上的一块，后面五块都建立在它的变量与重置之上：
 * 1. 重置：box-sizing、:focus-visible、字体与颜色初始化；
 * 2. 设计变量：--caui-* 桥接宿主的 --dsw-*，全部带亮色回退值；
 * 3. 骨架：.caui-viewport（滚动容器）与 .caui-flow（消息流列宽）；
 * 4. 外层滚动：原生 conversation 自己拥有滚动时的根 / viewport / flow 变体；
 * 5. 主题：暗色 / 亮色变量（含 Chat 模式页面与左栏列表的变量桥）。
 *
 * 跨块的通用规则（变量、字体、重置）一律留在这里，不跟着用它的规则走。
 */
export const BASE_CSS = `
/* =============================================================================
   dsh-chat-a2ui · 会话视图样式表
   1. 结构：root（flex 列）> viewport（滚动）> flow（消息流）
   2. 颜色：优先读 DSH 设计变量 --dsw-*，全部带亮色回退值
   3. 主题：prefers-color-scheme + 宿主 [data-theme="dark"|"light"]
   4. 断点：640px 以下收紧留白、隐藏次要信息
   ============================================================================= */

/* ---------------------------------------------------------------------------
   作用域与设计变量桥接
   --------------------------------------------------------------------------- */
.caui-root {
  --caui-fg: var(--dsw-alias-label-primary, #1c1c22);
  --caui-bg: var(--dsw-alias-bg-base, #ffffff);
  --caui-card: var(--dsw-alias-bg-layer-1, #ffffff);
  --caui-subtle: var(--dsw-subtle, rgba(28, 28, 34, 0.045));
  --caui-subtle-hover: var(--dsw-subtle-hover, rgba(28, 28, 34, 0.08));
  --caui-muted: var(--dsw-alias-label-secondary, #6a6a76);
  --caui-border: var(--dsw-alias-border-l2, rgba(28, 28, 34, 0.12));
  --caui-border-strong: var(--dsw-alias-border-l4, rgba(28, 28, 34, 0.24));
  --caui-accent: var(--dsw-alias-state-business-primary, #4c5bd4);
  --caui-accent-fg: var(--dsw-accent-foreground, #ffffff);
  --caui-danger: var(--dsw-danger, #d33b3b);
  --caui-ok: var(--dsw-success, #2f9e6b);
  --caui-warn: var(--dsw-warning, #b7791f);
  --caui-radius: var(--dsw-radius, 12px);
  --caui-radius-sm: var(--dsw-radius-sm, 8px);
  --caui-mono: var(--dsw-font-mono, ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas,
      "Liberation Mono", "Courier New", monospace);
  --caui-sans: var(--dsw-font-sans, ui-sans-serif, system-ui, -apple-system, "Segoe UI",
      "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif);
  --caui-shadow: var(--dsw-shadow-popover, 0 10px 30px rgba(15, 18, 42, 0.12));

  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  background: var(--caui-bg);
  color: var(--caui-fg);
  font-family: var(--caui-sans);
  font-size: 15px;
  line-height: 1.6;
  text-align: left;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.caui-root *,
.caui-root *::before,
.caui-root *::after {
  box-sizing: border-box;
}

.caui-root :focus-visible {
  outline: 2px solid var(--caui-accent);
  outline-offset: 2px;
}

/* ---------------------------------------------------------------------------
   骨架：滚动容器与消息流
   --------------------------------------------------------------------------- */
.caui-viewport {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior-y: contain;
  /* 不要在这里写 scroll-behavior: smooth：程序化贴底需要瞬时赋值 */
  scrollbar-width: thin;
  scrollbar-color: var(--caui-border-strong) transparent;
}

.caui-viewport::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.caui-viewport::-webkit-scrollbar-track {
  background: transparent;
}

.caui-viewport::-webkit-scrollbar-thumb {
  background: var(--caui-border-strong);
  background-clip: content-box;
  border: 3px solid transparent;
  border-radius: 999px;
}

.caui-viewport::-webkit-scrollbar-thumb:hover {
  background: var(--caui-muted);
  background-clip: content-box;
}

.caui-flow {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  /* 让空态能垂直居中：flow 至少铺满一屏，空态面板再用 flex: 1 撑开 */
  min-height: 100%;
  max-width: 820px;
  margin: 0 auto;
  padding: 22px 20px 32px;
}

/* 原生 conversation 的 Chat UI tab 由 [data-conversation-scroll] 拥有滚动。
   此时让根节点按内容自然增高，末尾留出 composer 的高度，
   回到底部按钮改为固定定位，避免和内层滚动容器叠在一起。 */
.caui-root[data-scroll-owner="outer"] {
  flex: 0 0 auto;
  height: auto;
  overflow: visible;
}

.caui-root[data-scroll-owner="outer"] .caui-viewport {
  flex: 0 0 auto;
  overflow: visible;
}

.caui-root[data-scroll-owner="outer"] .caui-flow {
  /* 外层滚动时输入框是浮层，给消息流末尾留出默认 composer 高度。 */
  padding-bottom: var(--caui-composer-clearance, 270px);
}

.caui-root[data-scroll-owner="outer"] .caui-scroll-button {
  position: fixed;
  right: 24px;
  bottom: 184px;
  margin: 0;
}


/* ---------------------------------------------------------------------------
   Chat 模式：独立主面板 + 侧栏会话列表
   --------------------------------------------------------------------------- */
.caui-chat-page,
.caui-chat-list {
  --caui-fg: var(--dsw-alias-label-primary, #1c1c22);
  --caui-bg: var(--dsw-alias-bg-base, #ffffff);
  --caui-card: var(--dsw-alias-bg-layer-1, #ffffff);
  --caui-subtle: var(--dsw-subtle, rgba(28, 28, 34, 0.045));
  --caui-subtle-hover: var(--dsw-subtle-hover, rgba(28, 28, 34, 0.08));
  --caui-muted: var(--dsw-alias-label-secondary, #6a6a76);
  --caui-border: var(--dsw-alias-border-l2, rgba(28, 28, 34, 0.12));
  --caui-border-strong: var(--dsw-alias-border-l4, rgba(28, 28, 34, 0.24));
  --caui-accent: var(--dsw-alias-state-business-primary, #4c5bd4);
  --caui-accent-fg: var(--dsw-accent-foreground, #ffffff);
  --caui-danger: var(--dsw-danger, #d33b3b);
  --caui-radius: var(--dsw-radius, 12px);
  --caui-radius-sm: var(--dsw-radius-sm, 8px);
  --caui-shadow: var(--dsw-shadow-popover, 0 10px 30px rgba(15, 18, 42, 0.12));
  --caui-sans: var(--dsw-font-sans, ui-sans-serif, system-ui, -apple-system, "Segoe UI",
      "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif);

  color: var(--caui-fg);
  font-family: var(--caui-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.caui-chat-page *,
.caui-chat-page *::before,
.caui-chat-page *::after,
.caui-chat-list *,
.caui-chat-list *::before,
.caui-chat-list *::after {
  box-sizing: border-box;
}

.caui-chat-page :focus-visible,
.caui-chat-list :focus-visible {
  outline: 2px solid var(--caui-accent);
  outline-offset: 2px;
}

/* ---------------------------------------------------------------------------
   暗色主题：系统偏好 + 宿主显式主题
   --------------------------------------------------------------------------- */
@media (prefers-color-scheme: dark) {
  .caui-root {
    --caui-fg: var(--dsw-foreground, #e9e9ef);
    --caui-bg: var(--dsw-background, #141419);
    --caui-card: var(--dsw-card, var(--dsw-surface, #1b1b22));
    --caui-subtle: var(--dsw-subtle, rgba(255, 255, 255, 0.055));
    --caui-subtle-hover: var(--dsw-subtle-hover, rgba(255, 255, 255, 0.095));
    --caui-muted: var(--dsw-muted-foreground, #9a9aa8);
    --caui-border: var(--dsw-border, rgba(255, 255, 255, 0.12));
    --caui-border-strong: var(--dsw-border-strong, rgba(255, 255, 255, 0.22));
    --caui-accent: var(--dsw-accent, #8b93ff);
    --caui-accent-fg: var(--dsw-accent-foreground, #101018);
    --caui-danger: var(--dsw-danger, #ff7b7b);
    --caui-ok: var(--dsw-success, #57c99a);
    --caui-warn: var(--dsw-warning, #e0b05a);
    --caui-shadow: var(--dsw-shadow-popover, 0 10px 30px rgba(0, 0, 0, 0.5));
  }
}

[data-theme="dark"] .caui-root,
.caui-root[data-theme="dark"] {
  --caui-fg: var(--dsw-foreground, #e9e9ef);
  --caui-bg: var(--dsw-background, #141419);
  --caui-card: var(--dsw-card, var(--dsw-surface, #1b1b22));
  --caui-subtle: var(--dsw-subtle, rgba(255, 255, 255, 0.055));
  --caui-subtle-hover: var(--dsw-subtle-hover, rgba(255, 255, 255, 0.095));
  --caui-muted: var(--dsw-muted-foreground, #9a9aa8);
  --caui-border: var(--dsw-border, rgba(255, 255, 255, 0.12));
  --caui-border-strong: var(--dsw-border-strong, rgba(255, 255, 255, 0.22));
  --caui-accent: var(--dsw-accent, #8b93ff);
  --caui-accent-fg: var(--dsw-accent-foreground, #101018);
  --caui-danger: var(--dsw-danger, #ff7b7b);
  --caui-ok: var(--dsw-success, #57c99a);
  --caui-warn: var(--dsw-warning, #e0b05a);
  --caui-shadow: var(--dsw-shadow-popover, 0 10px 30px rgba(0, 0, 0, 0.5));
}

@media (prefers-color-scheme: dark) {
  .caui-chat-page,
  .caui-chat-list {
    --caui-fg: var(--dsw-foreground, #e9e9ef);
    --caui-bg: var(--dsw-background, #141419);
    --caui-card: var(--dsw-card, var(--dsw-surface, #1b1b22));
    --caui-subtle: var(--dsw-subtle, rgba(255, 255, 255, 0.055));
    --caui-subtle-hover: var(--dsw-subtle-hover, rgba(255, 255, 255, 0.095));
    --caui-muted: var(--dsw-muted-foreground, #9a9aa8);
    --caui-border: var(--dsw-border, rgba(255, 255, 255, 0.12));
    --caui-border-strong: var(--dsw-border-strong, rgba(255, 255, 255, 0.22));
    --caui-accent: var(--dsw-accent, #8b93ff);
    --caui-accent-fg: var(--dsw-accent-foreground, #101018);
    --caui-danger: var(--dsw-danger, #ff7b7b);
    --caui-shadow: var(--dsw-shadow-popover, 0 10px 30px rgba(0, 0, 0, 0.5));
  }
}

[data-theme="dark"] .caui-chat-page,
[data-theme="dark"] .caui-chat-list,
.caui-chat-page[data-theme="dark"],
.caui-chat-list[data-theme="dark"] {
  --caui-fg: var(--dsw-foreground, #e9e9ef);
  --caui-bg: var(--dsw-background, #141419);
  --caui-card: var(--dsw-card, var(--dsw-surface, #1b1b22));
  --caui-subtle: var(--dsw-subtle, rgba(255, 255, 255, 0.055));
  --caui-subtle-hover: var(--dsw-subtle-hover, rgba(255, 255, 255, 0.095));
  --caui-muted: var(--dsw-muted-foreground, #9a9aa8);
  --caui-border: var(--dsw-border, rgba(255, 255, 255, 0.12));
  --caui-border-strong: var(--dsw-border-strong, rgba(255, 255, 255, 0.22));
  --caui-accent: var(--dsw-accent, #8b93ff);
  --caui-accent-fg: var(--dsw-accent-foreground, #101018);
  --caui-danger: var(--dsw-danger, #ff7b7b);
  --caui-shadow: var(--dsw-shadow-popover, 0 10px 30px rgba(0, 0, 0, 0.5));
}

/* 宿主明确要求亮色时，压过系统暗色偏好 */
[data-theme="light"] .caui-root,
.caui-root[data-theme="light"] {
  --caui-fg: var(--dsw-alias-label-primary, #1c1c22);
  --caui-bg: var(--dsw-alias-bg-base, #ffffff);
  --caui-card: var(--dsw-alias-bg-layer-1, #ffffff);
  --caui-subtle: var(--dsw-subtle, rgba(28, 28, 34, 0.045));
  --caui-subtle-hover: var(--dsw-subtle-hover, rgba(28, 28, 34, 0.08));
  --caui-muted: var(--dsw-alias-label-secondary, #6a6a76);
  --caui-border: var(--dsw-alias-border-l2, rgba(28, 28, 34, 0.12));
  --caui-border-strong: var(--dsw-alias-border-l4, rgba(28, 28, 34, 0.24));
  --caui-accent: var(--dsw-alias-state-business-primary, #4c5bd4);
  --caui-accent-fg: var(--dsw-accent-foreground, #ffffff);
  --caui-danger: var(--dsw-danger, #d33b3b);
  --caui-ok: var(--dsw-success, #2f9e6b);
  --caui-warn: var(--dsw-warning, #b7791f);
  --caui-shadow: var(--dsw-shadow-popover, 0 10px 30px rgba(15, 18, 42, 0.12));
}`
