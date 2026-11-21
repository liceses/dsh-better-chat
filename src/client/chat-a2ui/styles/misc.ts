/**
 * 其余层：Chat 模式的页面外壳与页面级响应式。
 *
 * 页面 / 工作区 / 头部（标题、工具条、图标按钮）/ 正文 / 右侧轨迹抽屉 /
 * 状态页与主要、次要按钮，以及落在页面级断点上的规则（轨迹改覆盖层、
 * 窄屏收紧、减少动效把过渡压到 1ms）。
 *
 * 这里的 @media 只管**页面外壳自己**的收窄规则（轨迹抽屉改覆盖层、头部收紧、
 * 工具栏按钮），减少动效那一块也在本文件。
 *
 * 消息流、左栏、灯箱各自的移动端断点已经搬回它们自己的文件：以前它们挤在
 * 本文件的 900 / 640 块里，胜负靠「谁排在后面」，改一处要跨三个文件推演。
 * 现在每个表面一个文件，媒体查询紧跟着基础规则，覆盖写在媒体查询之后；
 * tests/style-split.test.ts 的级联等价性（448 个状态）逐条证明行为没变。
 *
 * 轨迹抽屉的宽度由 ChatWorkspace 的 framer（animate={{ width: 360 }}）独占：
 * 这里只留 max-width 兜底窄屏，不再用 !important 抢 width 的所有权。
 */
export const MISC_CSS = `

.caui-chat-page {
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
  font-size: 15px;
  line-height: 1.6;
  text-align: left;
}

.caui-chat-workspace {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}

/* 头部：返回、标题、原生动作、轨迹开关 -------------------------------- */
.caui-chat-header {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 56px;
  padding: 8px 14px;
  border-bottom: 1px solid var(--caui-border);
  background: var(--caui-bg);
}

.caui-chat-header-main {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.caui-chat-title-block {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.caui-chat-title {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  font-size: 14.5px;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

.caui-chat-title > span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.caui-chat-subtitle {
  color: var(--caui-muted);
  font-size: 11.5px;
  line-height: 1.4;
}

.caui-chat-header-actions {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.caui-chat-icon-button {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: var(--caui-radius-sm);
  background: transparent;
  color: var(--caui-muted);
  cursor: pointer;
  transition: background-color 120ms ease, color 120ms ease;
}

.caui-chat-icon-button:hover {
  background: var(--caui-subtle-hover);
  color: var(--caui-fg);
}

.caui-chat-toolbar-button {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 9px;
  border: 1px solid transparent;
  border-radius: var(--caui-radius-sm);
  background: transparent;
  color: var(--caui-muted);
  font: inherit;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;
}

.caui-chat-new-glyph {
  font-size: 15px;
  line-height: 1;
}

.caui-chat-toolbar-button:hover:not(:disabled) {
  background: var(--caui-subtle);
  color: var(--caui-fg);
}

.caui-chat-toolbar-active {
  border-color: var(--caui-border);
  background: var(--caui-subtle);
  color: var(--caui-fg);
}

.caui-chat-toolbar-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.caui-chat-body {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  align-items: stretch;
  min-width: 0;
  min-height: 0;
}

.caui-chat-main {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

/* 右侧轨迹栏：默认折叠，展开时由 Framer Motion 驱动宽度 --------------- */
.caui-chat-dock {
  position: relative;
  flex: 0 0 auto;
  min-width: 0;
  overflow: hidden;
  border-left: 1px solid var(--caui-border);
  background: var(--caui-bg);
}

.caui-chat-dock-inner {
  display: flex;
  flex-direction: column;
  width: 360px;
  height: 100%;
  min-height: 0;
}

.caui-chat-dock-head {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 8px 0 14px;
  border-bottom: 1px solid var(--caui-border);
}

.caui-chat-dock-title {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--caui-muted);
}

.caui-chat-dock-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
}

.caui-chat-dock-conversation {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

/* 状态页 ---------------------------------------------------------------- */
.caui-chat-status {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 48px 24px;
  text-align: center;
}

.caui-chat-status-mark {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  margin-bottom: 4px;
  border: 1px solid var(--caui-border);
  border-radius: 999px;
  background: var(--caui-subtle);
  color: var(--caui-accent);
  font-size: 17px;
}

.caui-chat-status-title {
  font-size: 15px;
  font-weight: 600;
}

.caui-chat-status-detail {
  max-width: 420px;
  color: var(--caui-muted);
  font-size: 13px;
}

.caui-chat-status-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.caui-chat-primary,
.caui-chat-secondary {
  height: 32px;
  padding: 0 14px;
  border-radius: var(--caui-radius-sm);
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}

.caui-chat-primary {
  border: 1px solid var(--caui-accent);
  background: var(--caui-accent);
  color: var(--caui-accent-fg);
}

.caui-chat-secondary {
  border: 1px solid var(--caui-border);
  background: transparent;
  color: var(--caui-fg);
}

/* 响应式：窄屏把轨迹改成覆盖层 ------------------------------------------ */
@media (max-width: 900px) {
  .caui-chat-toolbar-label {
    display: none;
  }

  .caui-chat-toolbar-button {
    padding: 0 7px;
  }

  /* 宽度由 ChatWorkspace 的 framer（animate={{ width: 360 }}）独占写出：
     这里不写 width，也不加 !important，只用 max-width 兜住窄屏。 */
  .caui-chat-dock {
    position: absolute;
    z-index: 20;
    top: 0;
    right: 0;
    bottom: 0;
    max-width: min(88vw, 360px);
    box-shadow: var(--caui-shadow);
  }

  .caui-chat-dock-inner {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .caui-chat-header {
    min-height: 50px;
    padding: 6px 8px;
  }

  .caui-chat-subtitle {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .caui-chat-page:not([data-motion="full"]) *,
  .caui-chat-list:not([data-motion="full"]) * {
    transition-duration: 1ms !important;
  }
}

/* ---------------------------------------------------------------------------
   移动端：收紧留白、隐藏次要信息
   --------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------
   B Soft glass（原 P0.6 视觉层）已并回本块
   --------------------------------------------------------------------------- */

.caui-chat-page {
  background:
    radial-gradient(1100px 520px at 12% -8%, rgba(110, 123, 255, 0.14), transparent 62%),
    radial-gradient(900px 480px at 100% 0%, rgba(90, 200, 190, 0.10), transparent 58%),
    var(--caui-bg);
}

.caui-chat-workspace {
  background: transparent;
}

.caui-chat-header {
  position: relative;
  z-index: 3;
  min-height: 60px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--caui-glass-border);
  background: var(--caui-glass-bg);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.42), var(--caui-glass-shadow-soft);
  backdrop-filter: blur(var(--caui-glass-blur)) saturate(150%);
  -webkit-backdrop-filter: blur(var(--caui-glass-blur)) saturate(150%);
}

.caui-chat-header-main {
  gap: 9px;
}

.caui-chat-title {
  font-size: 15px;
  font-weight: 650;
  letter-spacing: -0.015em;
}

.caui-chat-subtitle {
  color: var(--caui-muted);
  font-size: 11.5px;
  min-height: 15px;
}

.caui-chat-shimmer {
  display: inline-block;
  perspective: 500px;
  font-size: inherit;
  line-height: inherit;
}

.caui-shimmer-char {
  display: inline-block;
  white-space: pre;
  transform-style: preserve-3d;
}

.caui-chat-header-actions {
  gap: 6px;
}

.caui-chat-icon-button {
  width: 32px;
  height: 32px;
  border: 1px solid transparent;
  border-radius: 10px;
}

.caui-chat-toolbar-button {
  height: 34px;
  padding: 0 11px;
  border-radius: 10px;
  font-size: 12.5px;
}

.caui-chat-toolbar-primary {
  border-color: var(--caui-glass-border);
  background: var(--caui-glass-bg-strong);
  color: var(--caui-fg);
  box-shadow: var(--caui-glass-shadow-soft);
}

.caui-chat-toolbar-primary:hover:not(:disabled) {
  border-color: var(--caui-accent);
  background: var(--caui-accent-soft);
  color: var(--caui-accent);
}

.caui-chat-toolbar-active {
  border-color: var(--caui-glass-border);
  background: var(--caui-glass-bg-strong);
  color: var(--caui-fg);
  box-shadow: var(--caui-glass-shadow-soft);
}

.caui-chat-dock {
  border-left: 1px solid var(--caui-glass-border);
  background: var(--caui-glass-bg);
  box-shadow: var(--caui-glass-shadow);
  backdrop-filter: blur(var(--caui-glass-blur)) saturate(140%);
  -webkit-backdrop-filter: blur(var(--caui-glass-blur)) saturate(140%);
}

.caui-chat-dock-head {
  height: 52px;
  border-bottom-color: var(--caui-glass-border);
}

.caui-chat-main :is(
  button[aria-label^="访问模式"],
  button[aria-label^="权限模式"],
  button[aria-label^="Access mode"],
  button[aria-label^="Permission"],
  [data-slot="conversation.input.permission"]
) {
  display: none !important;
}

.caui-chat-status-mark {
  border-color: var(--caui-glass-border);
  background: var(--caui-glass-bg-strong);
  box-shadow: var(--caui-glass-shadow-soft);
}

.caui-chat-primary {
  border-color: var(--caui-accent);
  background: var(--caui-accent);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--caui-accent) 24%, transparent);
}

.caui-chat-secondary {
  border-color: var(--caui-glass-border);
  background: var(--caui-glass-bg);
}

/* 右栏 Chat tab：顶部一行会话下拉 + 会话正文 ------------------------------- */
/* 作用域说明：这个 tab 在宿主的右侧边栏里，外层没有 .caui-root，所以这里
   直接桥接宿主的 --dsw-* 设计变量，并都带一个亮色回退值。 */
.caui-chat-rightbar {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}

.caui-chat-rightbar-bar {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-bottom: 1px solid var(--dsw-alias-border-l2, rgba(28, 28, 34, 0.12));
}

/* 紧凑到 24px 高：右栏本来就窄，下拉只占一行，标题过长由浏览器自己省略。 */
.caui-chat-rightbar-select {
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
  height: 24px;
  padding: 0 6px;
  border: 1px solid var(--dsw-alias-border-l2, rgba(28, 28, 34, 0.18));
  border-radius: 6px;
  background: var(--dsw-subtle, rgba(28, 28, 34, 0.045));
  color: inherit;
  font-family: inherit;
  font-size: 11.5px;
  line-height: 1;
}

.caui-chat-rightbar-body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.caui-chat-rightbar-notice {
  flex: 0 0 auto;
  padding: 4px 10px;
  color: var(--dsw-danger, #d33b3b);
  font-size: 11px;
  line-height: 1.5;
}

/* retain 还没落地的那一帧的占位：不先画旧会话，免得下拉和正文说的是两个人。 */
.caui-chat-rightbar-switching {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  min-height: 0;
  color: var(--dsw-muted-foreground, #6a6a76);
  font-size: 12px;
}

@media (max-width: 900px) {
  .caui-chat-header {
    padding: 9px 12px;
  }

  .caui-chat-toolbar-button {
    padding: 0 9px;
  }
}

@media (max-width: 640px) {
  .caui-chat-header-main {
    gap: 6px;
  }

  .caui-chat-title {
    font-size: 14px;
  }
}

}`