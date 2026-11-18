/**
 * P0.6 · B Soft glass 表面与动效样式。
 *
 * 单独成文件，由 style.ts 的 CHAT_CSS 末尾拼接；这样基础排版与这一轮
 * 的视觉层可以分开审阅，也避免改动两千行基础样式时误伤旧规则。
 * 所有动效仍由 data-motion 控制：full 保留，reduced 只留一帧。
 */
export const P06_CSS = `
/* =============================================================================
   P0.6 · B Soft glass
   ============================================================================= */

.caui-root,
.caui-chat-page,
.caui-chat-list {
  --caui-glass-bg: rgba(255, 255, 255, 0.72);
  --caui-glass-bg-strong: rgba(255, 255, 255, 0.88);
  --caui-glass-border: rgba(255, 255, 255, 0.58);
  --caui-glass-line: rgba(20, 23, 40, 0.10);
  --caui-glass-shadow: 0 18px 48px rgba(20, 23, 40, 0.12);
  --caui-glass-shadow-soft: 0 8px 24px rgba(20, 23, 40, 0.08);
  --caui-glass-blur: 18px;
  --caui-radius-card: 14px;
  --caui-radius-panel: 16px;
  --caui-shimmer-base: var(--caui-muted);
  --caui-shimmer-highlight: var(--caui-fg);
  --caui-accent-soft: color-mix(in srgb, var(--caui-accent) 13%, transparent);
  /* 4 个循环动画的时长：默认值在这里，运行时由 motion.config.json 覆盖
     （useChatStyles 注入 data-caui-motion-vars）。首帧 / 无 JS 也仍有动画。 */
  --caui-motion-caret: 1.05s;
  --caui-motion-pulse: 1.6s;
  --caui-motion-spin: 0.8s;
  --caui-motion-orb: 5.4s;
}

@supports not (backdrop-filter: blur(1px)) {
  .caui-root,
  .caui-chat-page,
  .caui-chat-list {
    --caui-glass-bg: var(--caui-card);
    --caui-glass-bg-strong: var(--caui-card);
    --caui-glass-blur: 0px;
  }
}

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
  transition: background 0.14s ease, color 0.14s ease, border-color 0.14s ease;
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
  transition: background 0.16s ease, border-color 0.16s ease, box-shadow 0.16s ease;
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
  transition: background 0.16s ease, border-color 0.16s ease;
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

.caui-flow {
  max-width: 780px;
  gap: 20px;
  padding: 26px 22px 38px;
}

.caui-assistant {
  gap: 13px;
}

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

.caui-user-text {
  font-size: 14.5px;
  line-height: 1.68;
}

.caui-reasoning,
.caui-tool,
.caui-context,
.caui-notice,
.caui-command,
.caui-compaction {
  border-color: var(--caui-glass-border);
  border-radius: var(--caui-radius-card);
  background: var(--caui-glass-bg);
  box-shadow: var(--caui-glass-shadow-soft);
  backdrop-filter: blur(12px) saturate(140%);
  -webkit-backdrop-filter: blur(12px) saturate(140%);
}

.caui-reasoning-summary {
  padding: 10px 32px 10px 12px;
  font-size: 12.5px;
}

.caui-reasoning-body,
.caui-reasoning-text {
  min-width: 0;
}

.caui-reasoning-text {
  padding: 0 13px 12px;
}

.caui-tool {
  position: relative;
}

.caui-tool-header {
  gap: 8px;
  padding: 10px 12px;
}

.caui-tool-name {
  font-size: 12.5px;
}

.caui-tool-status-text {
  flex: none;
  overflow: hidden;
  color: var(--caui-muted);
  font-size: 10.5px;
  line-height: 1.4;
  white-space: nowrap;
}

.caui-tool-status-text[data-state="error"] {
  color: var(--caui-danger);
}

.caui-tool-status-text[data-state="running"] {
  color: var(--caui-accent);
}

.caui-tool-body {
  gap: 9px;
  padding: 12px 13px 13px;
  border-top-color: var(--caui-glass-line);
  background: color-mix(in srgb, var(--caui-card) 78%, transparent);
}

.caui-tool-body .caui-tool-args,
.caui-tool-body .caui-tool-result {
  border-color: var(--caui-glass-line);
  border-radius: 10px;
}

.caui-border-trail {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: inherit;
  pointer-events: none;
  mask-clip: padding-box, border-box;
  mask-composite: intersect;
  -webkit-mask-clip: padding-box, border-box;
  -webkit-mask-composite: source-in;
  mask-image: linear-gradient(transparent, transparent), linear-gradient(#000, #000);
  -webkit-mask-image: linear-gradient(transparent, transparent), linear-gradient(#000, #000);
}

.caui-border-trail-dot {
  position: absolute;
  aspect-ratio: 1;
  border-radius: 999px;
}

.caui-tool-header,
.caui-tool-body {
  position: relative;
  z-index: 2;
}

/* ---------------------------------------------------------------------------
   过程行（思考 / 工具调用）
   之前每个过程块都是一张铺满整列的长条卡片，流式时一屏能叠出七八条，
   把正文挤成碎片。这里改成内容宽的旁注行：没有卡片底、没有描边，
   只在展开时用一条左侧细线把细节挂上去。
   --------------------------------------------------------------------------- */
.caui-reasoning,
.caui-tool {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: flex-start;
  width: auto;
  max-width: 100%;
  overflow: visible;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.caui-reasoning-summary,
.caui-tool-header {
  width: auto;
  max-width: 100%;
  padding: 2px 14px 2px 0;
  gap: 6px;
  color: var(--caui-muted);
  font-size: 12px;
}

.caui-reasoning-summary:hover,
.caui-tool-header:hover {
  background: transparent;
  color: var(--caui-fg);
}

.caui-reasoning-summary::after {
  right: 2px;
}

/* 内容宽的行不该再把工具名截成 web_sear…，省略号留给正文里的长参数。
   基础样式里的 max-width: 42% 是按整行宽度算的，对内容宽的表头没有意义，这里放开。 */
.caui-tool-header .caui-tool-name {
  flex: 0 0 auto;
  max-width: none;
  overflow: visible;
  text-overflow: clip;
}

/* kind 徽标是卡片时代的装饰，旁注行里只留名字和状态 */
.caui-tool-header .caui-tool-chip {
  display: none;
}

.caui-tool-body,
.caui-reasoning-body {
  width: 100%;
  margin-top: 4px;
  padding: 6px 0 4px 10px;
  border-top: 0;
  border-left: 1px solid var(--caui-glass-line);
  background: transparent;
}

.caui-reasoning-text {
  padding: 0;
}

/* 连续的过程行彼此靠近，正文前后仍保留呼吸：相邻过程行 20 → 10px */
.caui-row-process {
  margin-block: -5px;
}

.caui-row:has(> .caui-assistant > .caui-reasoning):not(:has(.caui-assistant-text)) {
  margin-block: -5px;
}

/* 只有思考、没有正文的 assistant 行不需要页脚，它原本还占着 24px */
.caui-assistant:not(:has(.caui-assistant-text)) > .caui-assistant-footer {
  display: none;
}

/* 提示行同理：旁注不是卡片 */
.caui-row-notice {
  justify-content: flex-start;
}

.caui-notice {
  padding: 0;
  border: 0;
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  font-size: 12px;
}

.caui-context {
  width: min(100%, 680px);
  overflow: hidden;
}

.caui-context-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 9px 12px;
  border: 0;
  background: transparent;
  color: var(--caui-muted);
  font: inherit;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
}

.caui-context-summary:hover {
  color: var(--caui-fg);
}

.caui-context-summary .caui-time {
  margin-left: auto;
}

.caui-context-chevron {
  flex: none;
  width: 6px;
  height: 6px;
  margin-right: 2px;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: rotate(45deg);
  transition: transform 0.16s ease;
}

.caui-context-summary[aria-expanded="true"] .caui-context-chevron {
  transform: rotate(225deg);
}

.caui-context-body {
  min-width: 0;
}

.caui-context-text {
  padding: 0 12px 10px 34px;
}

.caui-empty {
  position: relative;
  gap: 12px;
  min-height: 320px;
  padding: 48px 24px 44px;
}

.caui-empty::before {
  content: "";
  position: absolute;
  top: 18%;
  left: 50%;
  width: 260px;
  height: 260px;
  border-radius: 999px;
  background: radial-gradient(circle, color-mix(in srgb, var(--caui-accent) 18%, transparent), transparent 68%);
  transform: translateX(-50%);
  pointer-events: none;
}

.caui-empty-mark {
  position: relative;
  z-index: 1;
  width: 58px;
  height: 58px;
  border: 1px solid var(--caui-glass-border);
  border-radius: 20px;
  background:
    radial-gradient(circle at 32% 24%, rgba(255, 255, 255, 0.92), transparent 34%),
    linear-gradient(145deg, color-mix(in srgb, var(--caui-accent) 30%, var(--caui-card)), var(--caui-card));
  box-shadow: 0 18px 44px color-mix(in srgb, var(--caui-accent) 22%, transparent), inset 0 1px 0 rgba(255, 255, 255, 0.6);
  color: var(--caui-accent);
  font-size: 23px;
  animation-name: caui-orb-breathe;
  animation-duration: var(--caui-motion-orb, 5.4s);
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.caui-empty-title {
  position: relative;
  z-index: 1;
  color: var(--caui-fg);
  font-size: 24px;
  font-weight: 650;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.caui-empty-title .caui-text-effect {
  margin: 0;
}

.caui-empty-hint {
  position: relative;
  z-index: 1;
  max-width: 35em;
  font-size: 13px;
  line-height: 1.65;
}

.caui-empty-suggestions {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  max-width: 580px;
  margin-top: 6px;
}

.caui-empty-suggestion {
  padding: 7px 12px;
  border: 1px solid var(--caui-glass-border);
  border-radius: 999px;
  background: var(--caui-glass-bg);
  box-shadow: var(--caui-glass-shadow-soft);
  color: var(--caui-muted);
  font-size: 12.5px;
  line-height: 1.45;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.caui-text-effect {
  margin: 0;
}

.caui-text-effect-line {
  display: block;
}

.caui-text-effect-segment,
.caui-text-effect-char {
  display: inline-block;
  white-space: pre;
}

.caui-text-scramble {
  display: inline-block;
}

.caui-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.caui-progressive-blur {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.caui-flow-blur {
  top: 0;
  bottom: auto;
  left: 0;
  right: 0;
  height: 46px;
}

.caui-flow-blur-bottom {
  top: auto;
  bottom: 0;
}

.caui-progressive-blur-layer {
  position: absolute;
  inset: 0;
  border-radius: inherit;
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .caui-flow-blur {
    display: none;
  }
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

.caui-chat-blank-state {
  gap: 10px;
  inset: 0 0 190px;
}

.caui-chat-blank-orb {
  width: 46px;
  height: 46px;
  margin-bottom: 2px;
  border: 1px solid var(--caui-glass-border);
  border-radius: 16px;
  background:
    radial-gradient(circle at 32% 24%, rgba(255, 255, 255, 0.9), transparent 34%),
    linear-gradient(145deg, color-mix(in srgb, var(--caui-accent) 26%, var(--caui-card)), var(--caui-card));
  box-shadow: 0 14px 36px color-mix(in srgb, var(--caui-accent) 18%, transparent);
  animation-name: caui-orb-breathe;
  animation-duration: var(--caui-motion-orb, 5.4s);
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.caui-chat-blank-title {
  font-size: 26px;
  font-weight: 650;
  letter-spacing: -0.025em;
}

.caui-chat-blank-title .caui-text-effect {
  margin: 0;
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

.caui-scroll-button {
  border-color: var(--caui-glass-border);
  background: var(--caui-glass-bg-strong);
  box-shadow: var(--caui-glass-shadow);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* 减少动态：只停掉「一直转」和「位移/缩放」的那几处，
   颜色与背景过渡保留 —— 全局把 transition-duration 压到 1ms 会让 hover
   变成硬切，比有过渡更生硬，也会连带抹掉焦点态反馈。 */
.caui-root[data-motion="reduced"] .caui-empty-mark,
.caui-root[data-motion="reduced"] .caui-chat-blank-orb,
.caui-root[data-motion="reduced"] .caui-live-dot,
.caui-root[data-motion="reduced"] .caui-reasoning-spinner,
.caui-root[data-motion="reduced"] .caui-tool-status[data-state="running"],
.caui-chat-page[data-motion="reduced"] .caui-empty-mark,
.caui-chat-page[data-motion="reduced"] .caui-chat-blank-orb,
.caui-chat-page[data-motion="reduced"] .caui-live-dot,
.caui-chat-page[data-motion="reduced"] .caui-reasoning-spinner,
.caui-chat-page[data-motion="reduced"] .caui-tool-status[data-state="running"] {
  animation: none;
}

.caui-root[data-motion="reduced"] .caui-streaming-cursor,
.caui-chat-page[data-motion="reduced"] .caui-streaming-cursor {
  animation: none;
  opacity: 0.8;
}

/* 流式尾巴的模糊渐入在 reduced 档直接不播（文字照常出现） */
.caui-root[data-motion="reduced"] .caui-md-stream-char,
.caui-chat-page[data-motion="reduced"] .caui-md-stream-char {
  animation: none;
}

@media (prefers-color-scheme: dark) {
  .caui-root:not([data-theme="light"]),
  .caui-chat-page:not([data-theme="light"]),
  .caui-chat-list:not([data-theme="light"]) {
    --caui-glass-bg: rgba(24, 24, 30, 0.72);
    --caui-glass-bg-strong: rgba(24, 24, 30, 0.88);
    --caui-glass-border: rgba(255, 255, 255, 0.09);
    --caui-glass-line: rgba(255, 255, 255, 0.10);
    --caui-glass-shadow: 0 18px 48px rgba(0, 0, 0, 0.42);
    --caui-glass-shadow-soft: 0 8px 24px rgba(0, 0, 0, 0.28);
    --caui-shimmer-base: #747482;
    --caui-shimmer-highlight: #ffffff;
  }

  .caui-chat-page:not([data-theme="light"]) {
    background:
      radial-gradient(1100px 520px at 12% -8%, rgba(90, 104, 255, 0.18), transparent 62%),
      radial-gradient(900px 480px at 100% 0%, rgba(50, 170, 165, 0.12), transparent 58%),
      var(--caui-bg);
  }
}

[data-theme="dark"] .caui-root,
[data-theme="dark"] .caui-chat-page,
[data-theme="dark"] .caui-chat-list,
.caui-root[data-theme="dark"],
.caui-chat-page[data-theme="dark"],
.caui-chat-list[data-theme="dark"] {
  --caui-glass-bg: rgba(24, 24, 30, 0.72);
  --caui-glass-bg-strong: rgba(24, 24, 30, 0.88);
  --caui-glass-border: rgba(255, 255, 255, 0.09);
  --caui-glass-line: rgba(255, 255, 255, 0.10);
  --caui-glass-shadow: 0 18px 48px rgba(0, 0, 0, 0.42);
  --caui-glass-shadow-soft: 0 8px 24px rgba(0, 0, 0, 0.28);
  --caui-shimmer-base: #747482;
  --caui-shimmer-highlight: #ffffff;
}

[data-theme="dark"] .caui-chat-page,
.caui-chat-page[data-theme="dark"] {
  background:
    radial-gradient(1100px 520px at 12% -8%, rgba(90, 104, 255, 0.18), transparent 62%),
    radial-gradient(900px 480px at 100% 0%, rgba(50, 170, 165, 0.12), transparent 58%),
    var(--caui-bg);
}

[data-theme="light"] .caui-root,
[data-theme="light"] .caui-chat-page,
[data-theme="light"] .caui-chat-list,
.caui-root[data-theme="light"],
.caui-chat-page[data-theme="light"],
.caui-chat-list[data-theme="light"] {
  --caui-glass-bg: rgba(255, 255, 255, 0.72);
  --caui-glass-bg-strong: rgba(255, 255, 255, 0.88);
  --caui-glass-border: rgba(255, 255, 255, 0.58);
  --caui-glass-line: rgba(20, 23, 40, 0.10);
  --caui-glass-shadow: 0 18px 48px rgba(20, 23, 40, 0.12);
  --caui-glass-shadow-soft: 0 8px 24px rgba(20, 23, 40, 0.08);
  --caui-shimmer-base: var(--caui-muted);
  --caui-shimmer-highlight: var(--caui-fg);
}

[data-theme="light"] .caui-chat-page,
.caui-chat-page[data-theme="light"] {
  background:
    radial-gradient(1100px 520px at 12% -8%, rgba(110, 123, 255, 0.14), transparent 62%),
    radial-gradient(900px 480px at 100% 0%, rgba(90, 200, 190, 0.10), transparent 58%),
    var(--caui-bg);
}

@keyframes caui-orb-breathe {
  0%,
  100% {
    transform: translateY(0) scale(1);
    filter: saturate(1);
  }

  50% {
    transform: translateY(-3px) scale(1.035);
    filter: saturate(1.12);
  }
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
   宿主暗色主题：body[data-ds-dark-theme]
   宿主把深色收在 body 属性上，不是 [data-theme]，也不一定命中
   prefers-color-scheme；这里直接读宿主的 alias token，保证与外壳一致。
   --------------------------------------------------------------------------- */
body[data-ds-dark-theme] .caui-root,
body[data-ds-dark-theme] .caui-chat-page,
body[data-ds-dark-theme] .caui-chat-list {
  --caui-fg: var(--dsw-alias-label-primary, #e9e9ef);
  --caui-bg: var(--dsw-alias-bg-base, #151517);
  --caui-card: var(--dsw-alias-bg-layer-1, #1f1f23);
  --caui-subtle: rgba(255, 255, 255, 0.055);
  --caui-subtle-hover: rgba(255, 255, 255, 0.10);
  --caui-muted: var(--dsw-alias-label-secondary, #a1a1aa);
  --caui-border: var(--dsw-alias-border-l2, rgba(255, 255, 255, 0.12));
  --caui-border-strong: var(--dsw-alias-border-l4, rgba(255, 255, 255, 0.20));
  --caui-accent: #4d6bfe;
  --caui-accent-fg: #ffffff;
  --caui-danger: #ff7b7b;
  --caui-ok: #57c99a;
  --caui-warn: #e0b05a;
  --caui-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  --caui-glass-bg: rgba(24, 24, 30, 0.72);
  --caui-glass-bg-strong: rgba(24, 24, 30, 0.88);
  --caui-glass-border: rgba(255, 255, 255, 0.10);
  --caui-glass-line: rgba(255, 255, 255, 0.10);
  --caui-glass-shadow: 0 18px 48px rgba(0, 0, 0, 0.42);
  --caui-glass-shadow-soft: 0 8px 24px rgba(0, 0, 0, 0.28);
  --caui-shimmer-base: #747482;
  --caui-shimmer-highlight: #ffffff;
}

body[data-ds-dark-theme] .caui-chat-page {
  background:
    radial-gradient(1100px 520px at 12% -8%, rgba(77, 107, 254, 0.18), transparent 62%),
    radial-gradient(900px 480px at 100% 0%, rgba(50, 170, 165, 0.12), transparent 58%),
    var(--caui-bg);
}

body[data-ds-dark-theme] .caui-user-bubble {
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}

body[data-ds-dark-theme] .caui-empty-mark {
  background:
    radial-gradient(circle at 32% 24%, rgba(255, 255, 255, 0.22), transparent 34%),
    linear-gradient(145deg, color-mix(in srgb, var(--caui-accent) 42%, var(--caui-card)), var(--caui-card));
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(255, 255, 255, 0.18);
}
`
