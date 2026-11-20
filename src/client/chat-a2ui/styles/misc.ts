/**
 * 其余层：Chat 模式的页面外壳与页面级响应式。
 *
 * 页面 / 工作区 / 头部（标题、工具条、图标按钮）/ 正文 / 右侧轨迹抽屉 /
 * 状态页与主要、次要按钮，以及落在页面级断点上的规则（轨迹改覆盖层、
 * 窄屏收紧、减少动效把过渡压到 1ms）。
 *
 * 移动端断点（max-width: 640px）里同时改了消息流的留白和灯箱的内边距：
 * 它必须排在灯箱之后才能压住灯箱的默认值，因此整块留在这里，
 * 而不是拆到 flow.ts。
 *
 * B Soft glass（原 P0.6 视觉层）的增量已并回本块末尾：页面底纹与玻璃头部、
 * 工具条按钮、轨迹抽屉与状态页按钮。其中两个 @media（900 / 640）打包了
 * 横跨消息流 / 左栏 / 页面的收窄规则 —— 整块不能拆（拆开会多出规则边界），
 * 而且必须排在 list / flow 的同名规则之后才压得住，所以整块留在本块末尾。
 *
 * 最后 4 条是「跨表面覆盖」：.caui-user / .caui-user-bubble / .caui-assistant-text
 * 与 .caui-markdown / .caui-reasoning-summary 与 .caui-tool-header 属于消息流，
 * 但今天靠「P0.6 整层排在最后」压住本块 640 断点里的旧值。合并后若留在 flow 块，
 * 顺序会颠倒 —— 那是行为变化，因此显式钉在本文件结尾，由
 * tests/style-split.test.ts 的级联等价性看住。
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

  .caui-chat-list {
    padding: 6px 4px 10px;
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

@media (max-width: 900px) {
  /* 只收紧内边距：横向那两处 margin 是对齐宿主沟槽用的，与窗口宽度无关 */
  .caui-chat-list {
    padding: 6px 6px 6px;
  }

  .caui-chat-header {
    padding: 9px 12px;
  }

  .caui-chat-toolbar-button {
    padding: 0 9px;
  }
}

@media (max-width: 640px) {
  .caui-flow {
    gap: 16px;
    padding: 18px 14px 30px;
  }

  .caui-empty {
    min-height: 260px;
    padding: 36px 18px 32px;
  }

  .caui-empty-title {
    font-size: 21px;
  }

  .caui-empty-suggestion {
    padding: 6px 10px;
    font-size: 12px;
  }

  .caui-tool-status-text {
    display: none;
  }

  .caui-chat-header-main {
    gap: 6px;
  }

  .caui-chat-title {
    font-size: 14px;
  }

  .caui-chat-new {
    height: 38px;
  }

  .caui-chat-row {
    min-height: 44px;
  }
}

/* ---------------------------------------------------------------------------
   跨表面覆盖：下面 4 条属于消息流，但必须排在 misc 自己的 640 断点之后

   今天它们靠「P0.6 整层排在最后」压住 640 断点里的旧值：
   .caui-user 92% / .caui-user-bubble 9px 12px / .caui-assistant-text 与
   .caui-markdown 14.5px / .caui-tool-header 8px。合并后若留在 flow 块，
   顺序颠倒会让这些旧值反过来赢 —— 那是行为变化。因此显式钉在末尾，
   归属由 tests/style-split.test.ts 的级联等价性看住。
   --------------------------------------------------------------------------- */

.caui-assistant-text,
.caui-markdown {
  font-size: 15.5px;
  line-height: 1.75;
}

.caui-user {
  max-width: min(680px, 84%);
  gap: 7px;
}

.caui-user-bubble {
  padding: 11px 15px;
  border-radius: 18px 18px 6px 18px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--caui-accent) 86%, #ffffff), var(--caui-accent));
  box-shadow: 0 10px 24px color-mix(in srgb, var(--caui-accent) 22%, transparent);
}

.caui-reasoning-summary,
.caui-tool-header {
  width: auto;
  max-width: 100%;
  padding: 2px 14px 2px 0;
  gap: 6px;
  color: var(--caui-muted);
  font-size: 12px;
}`
