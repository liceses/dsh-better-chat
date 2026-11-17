/**
 * 会话视图的唯一样式来源。
 *
 * 没有 CSS import、没有 CSS-in-JS 依赖：整份样式是一个字符串，
 * 由 useChatStyles() 在需要时一次性注入 document.head。
 * 样式表常驻即可，插件卸载时不需要移除（宿主会整体刷新页面）。
 */

/** 注入的 <style> 元素使用的标记属性。 */
export const CHAT_STYLE_ATTR = 'data-dsh-chat-a2ui'

/**
 * 完整样式表。
 * 作用域：除灯箱外，所有选择器都限定在 .caui-root 之下。
 * 灯箱渲染到 document.body（避免被滚动容器裁剪），因此是顶层选择器。
 */
export const CHAT_CSS = `
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
  --caui-fg: var(--dsw-foreground, #1c1c22);
  --caui-bg: var(--dsw-background, #ffffff);
  --caui-card: var(--dsw-card, var(--dsw-surface, #ffffff));
  --caui-subtle: var(--dsw-subtle, rgba(28, 28, 34, 0.045));
  --caui-subtle-hover: var(--dsw-subtle-hover, rgba(28, 28, 34, 0.08));
  --caui-muted: var(--dsw-muted-foreground, #6a6a76);
  --caui-border: var(--dsw-border, rgba(28, 28, 34, 0.12));
  --caui-border-strong: var(--dsw-border-strong, rgba(28, 28, 34, 0.24));
  --caui-accent: var(--dsw-accent, #4c5bd4);
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

/* ---------------------------------------------------------------------------
   空态
   --------------------------------------------------------------------------- */
.caui-empty {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  max-width: 460px;
  min-height: 280px;
  margin: 0 auto;
  padding: 56px 24px;
  text-align: center;
}

.caui-empty-mark {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--caui-border);
  border-radius: 14px;
  background: var(--caui-subtle);
  color: var(--caui-accent);
  font-size: 20px;
  line-height: 1;
}

.caui-empty-title {
  color: var(--caui-fg);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.caui-empty-hint {
  max-width: 34em;
  color: var(--caui-muted);
  font-size: 13px;
  line-height: 1.65;
}

/* ---------------------------------------------------------------------------
   行容器
   --------------------------------------------------------------------------- */
.caui-row {
  display: flex;
  width: 100%;
  min-width: 0;
}

.caui-row > * {
  min-width: 0;
}

.caui-row-user {
  justify-content: flex-end;
}

.caui-row-assistant {
  justify-content: flex-start;
}

.caui-row-process {
  align-items: flex-start;
  justify-content: flex-start;
  color: var(--caui-muted);
  font-size: 12.5px;
}

.caui-row-tail {
  justify-content: center;
}

.caui-row-notice {
  justify-content: center;
}

/* ---------------------------------------------------------------------------
   用户消息
   --------------------------------------------------------------------------- */
.caui-user {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  max-width: min(680px, 86%);
}

.caui-user-bubble {
  max-width: 100%;
  padding: 10px 14px;
  border-radius: 16px 16px 4px 16px;
  background: var(--caui-accent);
  color: var(--caui-accent-fg);
  box-shadow: 0 1px 2px rgba(15, 18, 42, 0.08);
}

.caui-user-text {
  font-size: 14.5px;
  line-height: 1.65;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.caui-user-bubble .caui-markdown code,
.caui-user-bubble .caui-markdown pre {
  border-color: transparent;
  background: rgba(0, 0, 0, 0.18);
  color: inherit;
}

.caui-user-bubble .caui-markdown a,
.caui-user-bubble .caui-markdown-link {
  color: inherit;
  text-decoration: underline;
}

.caui-user-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 2px;
  color: var(--caui-muted);
  font-size: 11px;
}

.caui-user-images {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: flex-end;
  gap: 8px;
  max-width: 100%;
}

/* 用户侧的图片说明跟气泡一样靠右 */
.caui-user-images .caui-image-caption {
  text-align: right;
}

/* 附件徽标在气泡里要能读：气泡底色本身是强调色，这里换成半透明黑色底。 */
.caui-user-bubble .caui-tool-chip {
  border-color: transparent;
  background: rgba(0, 0, 0, 0.18);
  color: inherit;
}

/* ---------------------------------------------------------------------------
   Assistant 消息
   --------------------------------------------------------------------------- */
.caui-assistant {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  min-width: 0;
}

.caui-assistant-text {
  min-width: 0;
  font-size: 15px;
  line-height: 1.72;
  overflow-wrap: anywhere;
}

.caui-assistant-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 24px;
  color: var(--caui-muted);
  font-size: 11.5px;
  opacity: 0;
  transition: opacity 0.16s ease;
}

.caui-row:hover .caui-assistant-footer,
.caui-row:focus-within .caui-assistant-footer,
.caui-assistant-footer:focus-within {
  opacity: 1;
}

.caui-message-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.caui-action-button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 7px;
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  color: var(--caui-muted);
  font: inherit;
  font-size: 11.5px;
  line-height: 1.4;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  transition: background 0.14s ease, color 0.14s ease, border-color 0.14s ease;
}

.caui-action-button:hover {
  border-color: var(--caui-border);
  background: var(--caui-subtle-hover);
  color: var(--caui-fg);
}

.caui-action-button:active {
  transform: translateY(0.5px);
}

.caui-action-button:disabled {
  opacity: 0.45;
  cursor: default;
}

.caui-action-button svg {
  flex: none;
  width: 13px;
  height: 13px;
}

.caui-action-done,
.caui-action-button.caui-action-done {
  color: var(--caui-ok);
}

.caui-streaming-cursor {
  display: inline-block;
  width: 0.5em;
  height: 1.05em;
  margin-left: 2px;
  border-radius: 1px;
  background: currentColor;
  vertical-align: -0.16em;
  animation: caui-caret-blink 1.05s steps(2, start) infinite;
}

.caui-live-dot {
  display: inline-block;
  flex: none;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--caui-accent);
  animation: caui-pulse 1.6s ease-in-out infinite;
}

/* ---------------------------------------------------------------------------
   思考过程
   --------------------------------------------------------------------------- */
.caui-reasoning {
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--caui-border);
  border-radius: var(--caui-radius-sm);
  background: var(--caui-subtle);
}

.caui-reasoning-summary {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 8px 28px 8px 11px;
  border: 0;
  background: transparent;
  color: var(--caui-muted);
  font: inherit;
  font-size: 12.5px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background 0.14s ease, color 0.14s ease;
}

.caui-reasoning-summary:hover {
  background: var(--caui-subtle-hover);
  color: var(--caui-fg);
}

.caui-reasoning-summary::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 12px;
  width: 5px;
  height: 5px;
  margin-top: -3px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(45deg);
  transition: transform 0.16s ease;
}

.caui-reasoning-summary[data-open="true"]::after {
  margin-top: -1px;
  transform: rotate(-135deg);
}

.caui-reasoning-body {
  overflow: hidden;
}

.caui-reasoning-text {
  max-height: 260px;
  padding: 0 12px 10px;
  overflow-y: auto;
  color: var(--caui-muted);
  font-size: 12.5px;
  line-height: 1.65;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  scrollbar-width: thin;
  scrollbar-color: var(--caui-border-strong) transparent;
}

.caui-reasoning-spinner {
  display: inline-block;
  flex: none;
  width: 12px;
  height: 12px;
  border: 2px solid var(--caui-border-strong);
  border-top-color: var(--caui-accent);
  border-radius: 50%;
  animation: caui-spin 0.8s linear infinite;
}

/* ---------------------------------------------------------------------------
   工具调用卡片
   --------------------------------------------------------------------------- */
.caui-tool {
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--caui-border);
  border-radius: var(--caui-radius-sm);
  background: var(--caui-card);
}

.caui-tool[data-error="true"] {
  border-color: rgba(211, 59, 59, 0.42);
}

.caui-tool-header {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  border: 0;
  background: transparent;
  color: var(--caui-fg);
  font: inherit;
  text-align: left;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  transition: background 0.14s ease;
}

.caui-tool-header:hover {
  background: var(--caui-subtle);
}

.caui-tool-header:focus-visible {
  outline-offset: -2px;
}

.caui-tool-icon {
  flex: none;
  width: 15px;
  height: 15px;
  color: var(--caui-muted);
}

.caui-tool-status {
  display: inline-block;
  flex: none;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--caui-border-strong);
}

.caui-tool-status[data-state="running"] {
  width: 12px;
  height: 12px;
  border: 2px solid var(--caui-border-strong);
  border-top-color: var(--caui-accent);
  background: transparent;
  animation: caui-spin 0.8s linear infinite;
}

.caui-tool-status[data-state="error"] {
  background: var(--caui-danger);
}

.caui-tool-name {
  flex: none;
  max-width: 42%;
  overflow: hidden;
  color: var(--caui-fg);
  font-family: var(--caui-mono);
  font-size: 12.5px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.caui-tool-chip {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  max-width: 100%;
  flex: none;
  overflow: hidden;
  padding: 1px 6px;
  border: 1px solid var(--caui-border);
  border-radius: 999px;
  background: var(--caui-subtle);
  color: var(--caui-muted);
  font-size: 10.5px;
  line-height: 1.5;
  white-space: nowrap;
}

/* 头部一行参数预览（手机端隐藏，见文件末尾断点） */
.caui-tool-args {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  color: var(--caui-muted);
  font-family: var(--caui-mono);
  font-size: 11.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.caui-tool-chevron {
  display: inline-flex;
  flex: none;
  width: 12px;
  height: 12px;
  color: var(--caui-muted);
  transition: transform 0.16s ease;
}

.caui-tool-chevron[data-open="true"] {
  transform: rotate(90deg);
}

.caui-tool-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px 12px;
  overflow: hidden;
  border-top: 1px solid var(--caui-border);
  background: var(--caui-bg);
}

.caui-tool-body .caui-tool-args,
.caui-tool-body .caui-tool-result {
  display: block;
  max-height: 260px;
  margin: 0;
  padding: 8px 10px;
  overflow-x: auto;
  overflow-y: auto;
  border: 1px solid var(--caui-border);
  border-radius: var(--caui-radius-sm);
  background: var(--caui-subtle);
  color: var(--caui-fg);
  font-family: var(--caui-mono);
  font-size: 11.5px;
  line-height: 1.55;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  tab-size: 2;
}

.caui-tool-result {
  color: var(--caui-fg);
}

.caui-tool-body .caui-tool-result.caui-tool-error {
  border-color: rgba(211, 59, 59, 0.35);
  background: rgba(211, 59, 59, 0.07);
  color: var(--caui-danger);
}

/* ---------------------------------------------------------------------------
   本轮结束行（时间 / 分支 / token）
   --------------------------------------------------------------------------- */
.caui-turn-tail {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 22px;
  width: 100%;
  color: var(--caui-muted);
  font-size: 11px;
}

.caui-turn-tail-line {
  flex: 1 1 auto;
  min-width: 12px;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--caui-border) 12%,
    var(--caui-border) 88%,
    transparent
  );
}

.caui-branch-button {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: var(--caui-muted);
  font: inherit;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  transition: background 0.14s ease, color 0.14s ease, border-color 0.14s ease;
}

.caui-branch-button:hover:not(:disabled) {
  border-color: var(--caui-border);
  background: var(--caui-subtle-hover);
  color: var(--caui-accent);
}

.caui-branch-button:disabled {
  opacity: 0.4;
  cursor: default;
}

.caui-branch-icon {
  flex: none;
  width: 14px;
  height: 14px;
}

.caui-token-usage {
  flex: none;
  color: var(--caui-muted);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.01em;
}

.caui-time {
  flex: none;
  color: var(--caui-muted);
  font-variant-numeric: tabular-nums;
}

/* ---------------------------------------------------------------------------
   回到底部
   --------------------------------------------------------------------------- */
/* 按钮在滚动容器内部（.caui-flow 之后），所以用 sticky 而不是 absolute：
   absolute 的定位基准是滚动容器的 padding box，会跟着内容一起滚走；
   sticky 的定位基准是滚动视口，才能真正「贴在底部」。
   水平居中靠块级元素的 auto 外边距。 */
.caui-scroll-button {
  position: sticky;
  bottom: 20px;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  /* 负的上外边距把它从正常流里收回去，避免给滚动区凭空多出 32px 空白 */
  margin: -32px auto 0;
  padding: 0;
  border: 1px solid var(--caui-border);
  border-radius: 999px;
  background: var(--caui-card);
  color: var(--caui-muted);
  box-shadow: var(--caui-shadow);
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transform: translateY(4px);
  transition: opacity 0.16s ease, transform 0.16s ease, visibility 0.16s ease,
    color 0.14s ease;
  appearance: none;
  -webkit-appearance: none;
}

.caui-scroll-button:hover {
  color: var(--caui-fg);
}

.caui-scroll-button svg {
  width: 16px;
  height: 16px;
}

.caui-scroll-button-visible {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
  transform: translateY(0);
}

/* 原生会话壳用 [data-conversation-scroll] 拥有滚动时，本视图不能再套一层
   固定高度的内部滚动，否则消息会被裁在一个视口里、外层还多一条滚动条。
   此时让根节点按内容自然增高，回到底部按钮改为固定定位。 */
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
  /* 外层滚动时输入框是浮层（约 150px），留足底部空间，避免最后一段被压住 */
  padding-bottom: 176px;
}

.caui-root[data-scroll-owner="outer"] .caui-scroll-button {
  position: fixed;
  right: 24px;
  bottom: 184px;
  margin: 0;
}

/* ---------------------------------------------------------------------------
   图片与灯箱
   --------------------------------------------------------------------------- */
.caui-image {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  /* 图片按钮的 max-content 按原图宽度算（640px），只靠 img 的 max-width 收不回来，
     会把外层 figure 撑成灰色空条。这里把图容器也钉到 380，图片按实际宽度右对齐。 */
  max-width: min(100%, 380px);
  margin: 0;
}

.caui-image-button {
  display: block;
  max-width: 100%;
  padding: 0;
  border: 1px solid var(--caui-border);
  border-radius: var(--caui-radius-sm);
  background: var(--caui-subtle);
  line-height: 0;
  cursor: zoom-in;
  overflow: hidden;
  appearance: none;
  -webkit-appearance: none;
}

.caui-image-button:hover {
  border-color: var(--caui-border-strong);
}

.caui-image-button img {
  display: block;
  width: auto;
  height: auto;
  max-width: min(100%, 380px);
  max-height: 320px;
  object-fit: contain;
}

.caui-image.caui-image-loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: min(100%, 380px);
  min-height: 88px;
  padding: 12px;
  border: 1px dashed var(--caui-border);
  border-radius: var(--caui-radius-sm);
  background: var(--caui-subtle);
  color: var(--caui-muted);
  font-size: 11.5px;
  line-height: 1.5;
}

.caui-image-caption {
  max-width: 100%;
  overflow: hidden;
  color: inherit;
  font-size: 11px;
  line-height: 1.5;
  opacity: 0.72;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.caui-image.caui-image-failed {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border: 1px dashed var(--caui-border-strong);
  border-radius: var(--caui-radius-sm);
  background: var(--caui-subtle);
  color: var(--caui-muted);
  font-size: 11.5px;
  line-height: 1.5;
}

.caui-image-failed svg {
  flex: none;
  width: 14px;
  height: 14px;
}

/* 灯箱（portal 到 document.body，所以不套 .caui-root，也不读 --caui-* 变量） */
.caui-lightbox {
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(9, 9, 12, 0.82);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
}

.caui-lightbox-image {
  display: block;
  width: auto;
  height: auto;
  max-width: min(96vw, 1400px);
  max-height: 90vh;
  border-radius: 10px;
  background: #0b0b10;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
  object-fit: contain;
}

.caui-lightbox-close {
  position: absolute;
  top: max(16px, env(safe-area-inset-top));
  right: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  transition: background 0.14s ease, border-color 0.14s ease;
}

.caui-lightbox-close:hover {
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.2);
}

.caui-lightbox-close:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.85);
  outline-offset: 2px;
}

/* ---------------------------------------------------------------------------
   提示条
   --------------------------------------------------------------------------- */
.caui-notice {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  max-width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--caui-border);
  border-radius: var(--caui-radius-sm);
  background: var(--caui-subtle);
  color: var(--caui-muted);
  font-size: 12px;
  line-height: 1.55;
}

.caui-notice-icon {
  flex: none;
  width: 14px;
  height: 14px;
  margin-top: 1px;
  color: var(--caui-warn);
}

.caui-notice-text {
  min-width: 0;
  overflow-wrap: anywhere;
}

/* ---------------------------------------------------------------------------
   上下文注入：系统旁白，折叠显示，不占用户气泡
   --------------------------------------------------------------------------- */
.caui-context {
  width: min(100%, 680px);
  border: 1px solid var(--caui-border);
  border-radius: var(--caui-radius-sm);
  background: var(--caui-subtle);
  color: var(--caui-muted);
  font-size: 12px;
  line-height: 1.55;
}

.caui-context-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  list-style: none;
  cursor: pointer;
  color: var(--caui-muted);
}

.caui-context-summary::-webkit-details-marker {
  display: none;
}

.caui-context-summary::before {
  content: '⌁';
  flex: none;
  width: 14px;
  text-align: center;
  color: var(--caui-border-strong);
}

.caui-context-label {
  font-weight: 500;
}

.caui-context-summary .caui-time {
  margin-left: auto;
}

.caui-context-text {
  margin: 0;
  padding: 0 10px 8px 32px;
  max-height: 240px;
  overflow: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  color: var(--caui-muted);
  font-family: var(--caui-sans);
  font-size: 12px;
}

/* ---------------------------------------------------------------------------
   命令 / 压缩 / 未知节点
   --------------------------------------------------------------------------- */
.caui-command {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  max-width: 100%;
  padding: 6px 10px;
  border: 1px solid var(--caui-border);
  border-radius: var(--caui-radius-sm);
  background: var(--caui-subtle);
  color: var(--caui-fg);
  font-family: var(--caui-mono);
  font-size: 12px;
  line-height: 1.5;
}

.caui-command-name {
  flex: none;
  color: var(--caui-accent);
  font-weight: 600;
}

.caui-command-args {
  min-width: 0;
  overflow: hidden;
  color: var(--caui-muted);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.caui-command-outcome {
  flex: none;
  color: var(--caui-muted);
  font-size: 11px;
}

.caui-command-outcome[data-outcome="success"] {
  color: var(--caui-ok);
}

.caui-command-outcome[data-outcome="error"] {
  color: var(--caui-danger);
}

.caui-compaction {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 100%;
  padding: 8px 12px;
  border: 1px dashed var(--caui-border-strong);
  border-radius: var(--caui-radius-sm);
  background: var(--caui-subtle);
  color: var(--caui-muted);
  font-size: 12px;
  line-height: 1.55;
}

.caui-compaction-summary {
  max-height: 220px;
  overflow-y: auto;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
  scrollbar-width: thin;
  scrollbar-color: var(--caui-border-strong) transparent;
}

.caui-unknown {
  max-width: 100%;
  padding: 6px 10px;
  border: 1px dashed var(--caui-border);
  border-radius: var(--caui-radius-sm);
  color: var(--caui-muted);
  font-size: 11.5px;
}

.caui-unknown-type {
  font-family: var(--caui-mono);
}

.caui-unknown-body {
  max-height: 160px;
  margin: 4px 0 0;
  overflow: auto;
  font-family: var(--caui-mono);
  font-size: 11px;
  white-space: pre-wrap;
}

/* ---------------------------------------------------------------------------
   新建会话
   --------------------------------------------------------------------------- */
.caui-new-chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
}

.caui-new-chat-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border: 1px solid var(--caui-border);
  border-radius: var(--caui-radius);
  background: var(--caui-card);
  color: var(--caui-fg);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: var(--caui-shadow);
  appearance: none;
  -webkit-appearance: none;
  transition: background 0.14s ease, border-color 0.14s ease, transform 0.14s ease;
}

.caui-new-chat-button:hover:not(:disabled) {
  border-color: var(--caui-border-strong);
  background: var(--caui-subtle);
}

.caui-new-chat-button:active:not(:disabled) {
  transform: translateY(0.5px);
}

.caui-new-chat-button:disabled {
  opacity: 0.55;
  cursor: default;
}

.caui-new-chat-icon {
  flex: none;
  width: 14px;
  height: 14px;
}

.caui-new-chat-error {
  color: var(--caui-danger);
  font-size: 11.5px;
  line-height: 1.5;
}

/* ---------------------------------------------------------------------------
   Markdown
   --------------------------------------------------------------------------- */
.caui-markdown {
  font-size: 15px;
  line-height: 1.72;
  overflow-wrap: anywhere;
}

.caui-markdown > :first-child {
  margin-top: 0;
}

.caui-markdown > :last-child {
  margin-bottom: 0;
}

.caui-markdown p {
  margin: 0 0 10px;
}

.caui-markdown h1,
.caui-markdown h2,
.caui-markdown h3,
.caui-markdown h4,
.caui-markdown h5,
.caui-markdown h6 {
  margin: 18px 0 8px;
  font-weight: 600;
  line-height: 1.35;
}

.caui-markdown h1 {
  font-size: 1.35em;
}

.caui-markdown h2 {
  font-size: 1.2em;
}

.caui-markdown h3 {
  font-size: 1.08em;
}

.caui-markdown h4,
.caui-markdown h5,
.caui-markdown h6 {
  font-size: 1em;
}

.caui-markdown strong {
  font-weight: 600;
}

.caui-markdown em {
  font-style: italic;
}

.caui-markdown ul,
.caui-markdown ol {
  margin: 0 0 10px;
  padding-left: 1.45em;
}

.caui-markdown li {
  margin: 3px 0;
}

.caui-markdown li > ul,
.caui-markdown li > ol {
  margin: 3px 0;
}

.caui-markdown blockquote {
  margin: 10px 0;
  padding: 2px 0 2px 12px;
  border-left: 3px solid var(--caui-border-strong);
  color: var(--caui-muted);
}

.caui-markdown blockquote > :first-child {
  margin-top: 0;
}

.caui-markdown blockquote > :last-child {
  margin-bottom: 0;
}

.caui-markdown code {
  padding: 1px 5px;
  border-radius: 5px;
  background: var(--caui-subtle);
  font-family: var(--caui-mono);
  font-size: 0.9em;
}

.caui-markdown pre {
  margin: 10px 0;
  padding: 10px 12px;
  overflow-x: auto;
  border: 1px solid var(--caui-border);
  border-radius: var(--caui-radius-sm);
  background: var(--caui-subtle);
  font-family: var(--caui-mono);
  font-size: 12.5px;
  line-height: 1.6;
  tab-size: 2;
}

.caui-markdown pre code {
  padding: 0;
  border: 0;
  background: transparent;
  font-size: inherit;
  white-space: pre;
  overflow-wrap: normal;
}

.caui-markdown table {
  width: 100%;
  margin: 10px 0;
  border-collapse: collapse;
  font-size: 13.5px;
}

.caui-markdown th,
.caui-markdown td {
  padding: 6px 10px;
  border: 1px solid var(--caui-border);
  text-align: left;
  vertical-align: top;
}

.caui-markdown th {
  background: var(--caui-subtle);
  font-weight: 600;
}

.caui-markdown a,
.caui-markdown-link {
  color: var(--caui-accent);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
}

.caui-markdown a:hover,
.caui-markdown-link:hover {
  text-decoration-thickness: 2px;
}

.caui-markdown img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.caui-markdown hr {
  margin: 14px 0;
  border: 0;
  border-top: 1px solid var(--caui-border);
}

.caui-markdown kbd {
  padding: 1px 5px;
  border: 1px solid var(--caui-border);
  border-bottom-width: 2px;
  border-radius: 5px;
  background: var(--caui-subtle);
  font-family: var(--caui-mono);
  font-size: 0.85em;
}

/* ---------------------------------------------------------------------------
   动画
   --------------------------------------------------------------------------- */
@keyframes caui-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes caui-caret-blink {
  0%,
  45% {
    opacity: 1;
  }

  55%,
  100% {
    opacity: 0;
  }
}

@keyframes caui-pulse {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(0.85);
  }

  50% {
    opacity: 1;
    transform: scale(1);
  }
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

/* 宿主明确要求亮色时，压过系统暗色偏好 */
[data-theme="light"] .caui-root,
.caui-root[data-theme="light"] {
  --caui-fg: var(--dsw-foreground, #1c1c22);
  --caui-bg: var(--dsw-background, #ffffff);
  --caui-card: var(--dsw-card, var(--dsw-surface, #ffffff));
  --caui-subtle: var(--dsw-subtle, rgba(28, 28, 34, 0.045));
  --caui-subtle-hover: var(--dsw-subtle-hover, rgba(28, 28, 34, 0.08));
  --caui-muted: var(--dsw-muted-foreground, #6a6a76);
  --caui-border: var(--dsw-border, rgba(28, 28, 34, 0.12));
  --caui-border-strong: var(--dsw-border-strong, rgba(28, 28, 34, 0.24));
  --caui-accent: var(--dsw-accent, #4c5bd4);
  --caui-accent-fg: var(--dsw-accent-foreground, #ffffff);
  --caui-danger: var(--dsw-danger, #d33b3b);
  --caui-ok: var(--dsw-success, #2f9e6b);
  --caui-warn: var(--dsw-warning, #b7791f);
  --caui-shadow: var(--dsw-shadow-popover, 0 10px 30px rgba(15, 18, 42, 0.12));
}

/* ---------------------------------------------------------------------------
   移动端：收紧留白、隐藏次要信息
   --------------------------------------------------------------------------- */
@media (max-width: 640px) {
  .caui-flow {
    gap: 14px;
    padding: 14px 12px 24px;
  }

  .caui-empty {
    padding: 40px 16px;
  }

  .caui-user {
    max-width: 92%;
  }

  .caui-user-bubble {
    padding: 9px 12px;
    border-radius: 14px 14px 4px 14px;
  }

  .caui-user-text,
  .caui-assistant-text,
  .caui-markdown {
    font-size: 14.5px;
  }

  .caui-tool-header {
    gap: 6px;
    padding: 8px;
  }

  .caui-tool-name {
    max-width: 56%;
  }

  .caui-tool-args {
    display: none;
  }

  .caui-tool-body .caui-tool-args {
    display: block;
  }

  .caui-scroll-button {
    bottom: 14px;
    width: 34px;
    height: 34px;
  }

  .caui-lightbox {
    padding: 12px;
  }

  .caui-lightbox-close {
    top: max(10px, env(safe-area-inset-top));
    right: 10px;
  }

  .caui-token-usage {
    display: none;
  }

  .caui-markdown pre {
    font-size: 12px;
    padding: 8px 10px;
  }
}

/* ---------------------------------------------------------------------------
   减少动态效果：只保留必要的一帧，避免前庭不适
   --------------------------------------------------------------------------- */
@media (prefers-reduced-motion: reduce) {
  .caui-root *,
  .caui-root *::before,
  .caui-root *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
    transition-delay: 0ms !important;
  }

  .caui-reasoning-spinner,
  .caui-tool-status[data-state="running"] {
    animation: none !important;
  }

  .caui-streaming-cursor {
    animation: none !important;
    opacity: 0.8;
  }

  .caui-live-dot {
    animation: none !important;
    opacity: 1;
    transform: none;
  }
}

@media (hover: none) {
  .caui-assistant-footer {
    opacity: 1;
  }
}
`

/** 已经注入过样式的文档（同一实例可能被嵌进多个文档）。 */
const injectedDocs = new WeakSet<Document>()

/**
 * 确保样式表已注入当前文档；重复调用不会重复插入。
 * 在 SSR / 没有 document 的环境里安全地什么都不做。
 */
export function useChatStyles (): void {
  if (typeof document === 'undefined') return
  const doc = document
  if (injectedDocs.has(doc)) return
  const head = doc.head
  if (head === null || head === undefined) return
  if (head.querySelector('style[' + CHAT_STYLE_ATTR + ']') === null) {
    const element = doc.createElement('style')
    element.setAttribute(CHAT_STYLE_ATTR, '')
    element.textContent = CHAT_CSS
    head.appendChild(element)
  }
  injectedDocs.add(doc)
}