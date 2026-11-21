/**
 * 左栏列表层：两处「左栏」的表面。
 *
 * 1. Chat 模式的会话列表：容器、表头与计数、新建按钮、会话行、空态、错误与重试；
 * 2. 侧栏 Chat 行的图标与状态点。
 *
 * 列表行是按钮（.caui-chat-row），不复用消息流的 .caui-row 卡片；
 * 页面外壳与轨迹抽屉在 misc.ts。
 *
 * B Soft glass（原 P0.6 视觉层）的增量已并回本块末尾：卡片收回到原生侧栏沟槽的
 * margin、去掉表头与行之间的滚动条占位、行与新建按钮的玻璃底与 hover 态，
 * 以及「+」放在行尾的 ::after。列表独占这两处左栏表面。
 * 动效开关（.caui-chat-motion-toggle / -icon）也在这里 —— 它挂在列表表头。
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
}

/* ---------------------------------------------------------------------------
   B Soft glass（原 P0.6 视觉层）已并回本块
   --------------------------------------------------------------------------- */

/* 左栏 Chat 列表卡片。
   宿主给插槽区域的是 padding-left:4px / margin-right:-12px 的不对称出血区，
   直接把卡片铺上去会比原生导航行更宽、更靠右。这里用 margin 把它收回到
   原生侧栏项的沟槽上（侧栏 280 → 项 14..266），四边 6px 垂直、对齐留白。 */
.caui-chat-list {
  width: auto;
  min-width: 0;
  height: auto;
  margin: 6px 14px 6px 2px;
  padding: 6px 8px 8px;
  overflow: hidden;
  border: 1px solid var(--caui-glass-border);
  border-radius: var(--caui-radius-panel);
  background: var(--caui-glass-bg);
  box-shadow: var(--caui-glass-shadow-soft);
  backdrop-filter: blur(var(--caui-glass-blur)) saturate(140%);
  -webkit-backdrop-filter: blur(var(--caui-glass-blur)) saturate(140%);
}

.caui-chat-list-head {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px 8px;
}

.caui-chat-list-title {
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.075em;
}

.caui-chat-list-count {
  margin-left: auto;
  min-width: 20px;
  padding: 0 6px;
  border: 1px solid var(--caui-glass-border);
  background: var(--caui-glass-bg-strong);
  font-size: 10.5px;
  line-height: 18px;
  font-variant-numeric: tabular-nums;
}

.caui-chat-motion-toggle {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--caui-muted);
  cursor: pointer;
  transition: background var(--caui-dur-xs) var(--caui-ease-out), color var(--caui-dur-xs) var(--caui-ease-out), border-color var(--caui-dur-xs) var(--caui-ease-out);
}

.caui-chat-motion-toggle:hover {
  border-color: var(--caui-glass-border);
  background: var(--caui-glass-bg-strong);
  color: var(--caui-fg);
}

.caui-chat-motion-icon {
  display: grid;
  place-items: center;
  width: 16px;
  height: 16px;
  font-size: 12px;
  line-height: 1;
}

.caui-chat-new {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  width: 100%;
  height: 40px;
  margin: 0 0 8px;
  padding: 0 8px;
  border: 1px solid var(--caui-glass-border);
  border-radius: 12px;
  background: var(--caui-glass-bg-strong);
  box-shadow: var(--caui-glass-shadow-soft);
  color: var(--caui-fg);
  font-size: 13px;
  font-weight: 550;
  transition: background var(--caui-dur-sm) var(--caui-ease-out), border-color var(--caui-dur-sm) var(--caui-ease-out), box-shadow var(--caui-dur-sm) var(--caui-ease-out);
}

.caui-chat-new:hover {
  border-color: var(--caui-accent);
  background: var(--caui-accent-soft);
  color: var(--caui-accent);
  box-shadow: 0 10px 26px rgba(20, 23, 40, 0.12);
}

/* 「+」放在行尾而不是行首：行首留给文字，才能和会话标题对齐 */
.caui-chat-new::after {
  content: "+";
  margin-left: auto;
  color: var(--caui-accent);
  font-size: 15px;
  line-height: 1;
  opacity: 0.75;
}

/* 滚动条会从行宽里吃掉 10px，导致行与「新对话」/表头右边缘差一截。
   这里把它收掉，滚动仍走滚轮 / 触控板 / 键盘。 */
.caui-chat-list-body {
  gap: 3px;
  padding: 0;
  scrollbar-width: none;
}

.caui-chat-list-body::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.caui-chat-row {
  position: relative;
  isolation: isolate;
  display: flex;
  width: 100%;
  min-height: 46px;
  flex-direction: column;
  justify-content: center;
  gap: 1px;
  padding: 7px 8px;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: 12px;
  background: transparent;
  transition: background var(--caui-dur-sm) var(--caui-ease-out), border-color var(--caui-dur-sm) var(--caui-ease-out);
}

/* 行尾的归档按钮：只在 hover / 键盘聚焦时出现，别让列表常态显得嘈杂。
   行本身是 button，所以这里用 span[role=button]，点击要 stopPropagation。 */
.caui-chat-row-action {
  position: absolute;
  top: 50%;
  right: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-top: -11px;
  border-radius: 6px;
  color: var(--caui-muted);
  opacity: 0;
  cursor: pointer;
  transition: opacity var(--caui-dur-sm) var(--caui-ease-out), background var(--caui-dur-sm) var(--caui-ease-out);
}

.caui-chat-row:hover .caui-chat-row-action,
.caui-chat-row:focus-within .caui-chat-row-action {
  opacity: 1;
}

.caui-chat-row-action:hover,
.caui-chat-row-action:focus-visible {
  background: var(--caui-glass-bg);
  color: var(--caui-fg);
}

/* 有归档按钮时右侧留出位置，标题不会顶到按钮下面。 */
.caui-chat-row:has(.caui-chat-row-action) .caui-chat-row-title {
  padding-right: 24px;
}

.caui-chat-row:hover:not(.caui-chat-row-active) {
  border-color: var(--caui-glass-border);
  background: var(--caui-glass-bg);
}

.caui-chat-row-active {
  border-color: transparent;
  background: transparent;
}

.caui-chat-row-active-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  border: 1px solid var(--caui-glass-border);
  border-radius: inherit;
  background:
    linear-gradient(135deg, var(--caui-accent-soft), transparent 46%),
    var(--caui-glass-bg-strong);
  box-shadow: inset 2px 0 0 var(--caui-accent), var(--caui-glass-shadow-soft);
}

.caui-chat-row-top,
.caui-chat-row-meta {
  position: relative;
  z-index: 1;
}

.caui-chat-row-title {
  font-size: 13px;
  font-weight: 520;
}

.caui-chat-row-active .caui-chat-row-title {
  font-weight: 650;
}

.caui-chat-row-meta {
  padding-left: 0;
  font-size: 11px;
}

.caui-chat-list-body::-webkit-scrollbar {
  width: 8px;
}

.caui-chat-list-body::-webkit-scrollbar-thumb {
  border: 3px solid transparent;
  border-radius: 999px;
  background: var(--caui-border-strong);
  background-clip: content-box;
}
/* ---------------------------------------------------------------------------
   响应式：左栏自己的窄屏规则（与基础规则同文件）

   顺序是照搬合并前的：640 那条原本在前、900 那条在后，而 640 的内容也命中
   900 的条件，所以 900 的值在窄屏下反而赢。这里保持同一顺序，级联结果不变；
   tests/style-split.test.ts 的级联等价性会盯住。
   --------------------------------------------------------------------------- */

@media (max-width: 640px) {
  .caui-chat-list {
    padding: 6px 4px 10px;
  }

  .caui-chat-new {
    height: 38px;
  }

  .caui-chat-row {
    min-height: 44px;
  }
}

@media (max-width: 900px) {
  /* 只收紧内边距：横向那两处 margin 是对齐宿主沟槽用的，与窗口宽度无关 */
  .caui-chat-list {
    padding: 6px 6px 6px;
  }
}

`