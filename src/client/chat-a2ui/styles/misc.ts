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

  .caui-chat-dock {
    position: absolute;
    z-index: 20;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(88vw, 360px) !important;
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
}`
