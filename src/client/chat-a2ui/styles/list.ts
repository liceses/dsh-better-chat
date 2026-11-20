/**
 * 左栏列表层：两处「左栏」的表面。
 *
 * 1. Chat 模式的会话列表：容器、表头与计数、新建按钮、会话行、空态、错误与重试；
 * 2. 侧栏 Chat 行的图标与状态点。
 *
 * 列表行是按钮（.caui-chat-row），不复用消息流的 .caui-row 卡片；
 * 页面外壳与轨迹抽屉在 misc.ts。
 */
export const LIST_CSS = `

.caui-chat-a2ui-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--caui-muted);
}

/* 左栏 Chat 会话列表 ---------------------------------------------------- */
.caui-chat-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 10px 8px 12px;
  font-size: 13px;
}

.caui-chat-list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 6px 8px;
}

.caui-chat-list-title {
  color: var(--caui-muted);
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.caui-chat-list-count {
  min-width: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--caui-subtle);
  color: var(--caui-muted);
  font-size: 10.5px;
  line-height: 17px;
  text-align: center;
}

.caui-chat-new {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 7px;
  width: 100%;
  height: 34px;
  margin-bottom: 8px;
  padding: 0 10px;
  border: 1px dashed var(--caui-border-strong);
  border-radius: var(--caui-radius-sm);
  background: transparent;
  color: var(--caui-fg);
  font: inherit;
  font-size: 12.5px;
  text-align: left;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease;
}

.caui-chat-new:hover {
  border-color: var(--caui-accent);
  background: var(--caui-subtle);
}

.caui-chat-list-body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 2px;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
}

.caui-chat-row {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  padding: 7px 8px;
  border: 1px solid transparent;
  border-radius: var(--caui-radius-sm);
  background: transparent;
  color: var(--caui-fg);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease;
}

.caui-chat-row:hover {
  background: var(--caui-subtle);
}

.caui-chat-row-active {
  border-color: var(--caui-border);
  background: var(--caui-subtle);
}

.caui-chat-row-top {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.caui-chat-row-title {
  overflow: hidden;
  flex: 1 1 auto;
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.caui-chat-row-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-left: 13px;
  color: var(--caui-muted);
  font-size: 10.5px;
  line-height: 1.35;
}

.caui-chat-empty {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 28px 10px;
  text-align: center;
}

.caui-chat-empty-title {
  font-size: 12.5px;
  font-weight: 500;
}

.caui-chat-empty-hint {
  color: var(--caui-muted);
  font-size: 11.5px;
  line-height: 1.55;
}

.caui-chat-error {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
  padding: 7px 8px;
  border: 1px solid color-mix(in srgb, var(--caui-danger) 35%, transparent);
  border-radius: var(--caui-radius-sm);
  color: var(--caui-danger);
  font-size: 11.5px;
  line-height: 1.45;
}

.caui-chat-retry {
  flex: 0 0 auto;
  padding: 2px 6px;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: inherit;
  font: inherit;
  text-decoration: underline;
  cursor: pointer;
}

.caui-chat-panel-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: currentColor;
}`
