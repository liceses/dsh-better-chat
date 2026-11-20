/**
 * 消息流层：一条消息在流里长什么样。
 *
 * 空态、行容器、用户气泡、Assistant 正文与动作条、流式光标、思考过程、
 * 工具卡、本轮结束行（时间 / 分支 / token）、回到底部按钮、图片与附件、
 * 提示条、上下文旁白、命令 / 压缩 / 未知节点、新建会话、Markdown 排版。
 * 循环动画的 @keyframes 也只服务于这里的元素，因此随本块
 * （caui-spin / caui-caret-blink / caui-pulse，以及空态光球用的 caui-orb-breathe ——
 * 后者 Chat 空态标题也在用，但重心在消息流，仍按重心归属）。
 *
 * B Soft glass（原 P0.6 视觉层）的增量已并回本块末尾：流列宽与留白、
 * 旁注式的过程行（思考 / 工具调用收成内容宽）、空态光球与建议胶囊、
 * 浮动模糊层与回到底部按钮的玻璃底，以及 reduced 档的动画收口。
 * 它们今天仍然压得住本块自己的基础值 —— 靠的是同一文件里靠后的位置。
 *
 * 页面外壳、左栏与输入区都不在这里。消息流自己的移动端断点在本文件末尾：
 * 一个 @media (max-width: 640px) 装着窄屏值，紧跟其后是四处覆盖
 * （.caui-user 宽度 / .caui-user-bubble 内边距 / 正文字号 / 过程行内边距）。
 * 以前它们散在 misc.ts，胜负取决于别的文件的先后；现在同一段话就能读完顺序。
 */
export const FLOW_CSS = `

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
  transition: opacity var(--caui-dur-sm) var(--caui-ease-out);
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
  transition: background var(--caui-dur-xs) var(--caui-ease-out), color var(--caui-dur-xs) var(--caui-ease-out), border-color var(--caui-dur-xs) var(--caui-ease-out);
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

/* 4 个循环动画的时长来自 motion.config.json（--caui-motion-*），
   这里只留名称与节奏函数；没注入变量时用括号里的默认值。 */
.caui-streaming-cursor {
  display: inline-block;
  width: 0.5em;
  height: 1.05em;
  margin-left: 2px;
  border-radius: 1px;
  background: currentColor;
  vertical-align: -0.16em;
  animation-name: caui-caret-blink;
  animation-duration: var(--caui-motion-caret, 1.05s);
  animation-timing-function: steps(2, start);
  animation-iteration-count: infinite;
}

/* 流式块的高度补间：新内容整块到达时，先停住高度再长到目标，
   让文字从下边缘一行行长出来。时长按距离算，由 Markdown 内联给出（transitionDuration）。 */
.caui-md-clip {
  overflow: hidden;
}

.caui-md-clip-animated {
  transition-property: height;
  transition-timing-function: var(--caui-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
}

/* 流式尾巴：逐字模糊渐入。时长与模糊半径来自 motion.config.json 的 stream.*，
   由 Markdown 组件内联成 --caui-stream-* 两个变量。 */
.caui-md-stream-char {
  animation-name: caui-md-stream-in;
  animation-duration: var(--caui-stream-duration, 0.42s);
  animation-timing-function: var(--caui-ease-out, cubic-bezier(0.22, 1, 0.36, 1));
  animation-fill-mode: both;
}

@keyframes caui-md-stream-in {
  from {
    opacity: 0.12;
    filter: blur(var(--caui-stream-blur, 6px));
  }

  to {
    opacity: 1;
    filter: blur(0);
  }
}

.caui-live-dot {
  display: inline-block;
  flex: none;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--caui-accent);
  animation-name: caui-pulse;
  animation-duration: var(--caui-motion-pulse, 1.6s);
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
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
  transition: background var(--caui-dur-xs) var(--caui-ease-out), color var(--caui-dur-xs) var(--caui-ease-out);
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
  transition: transform var(--caui-dur-sm) var(--caui-ease-out);
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
  animation-name: caui-spin;
  animation-duration: var(--caui-motion-spin, 0.8s);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
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
  transition: background var(--caui-dur-xs) var(--caui-ease-out);
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
  animation-name: caui-spin;
  animation-duration: var(--caui-motion-spin, 0.8s);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
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
  transition: transform var(--caui-dur-sm) var(--caui-ease-out);
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
  transition: background var(--caui-dur-xs) var(--caui-ease-out), color var(--caui-dur-xs) var(--caui-ease-out), border-color var(--caui-dur-xs) var(--caui-ease-out);
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
  transition: opacity var(--caui-dur-sm) var(--caui-ease-out), transform var(--caui-dur-sm) var(--caui-ease-out), visibility var(--caui-dur-sm) var(--caui-ease-out),
    color var(--caui-dur-xs) var(--caui-ease-out);
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
  transition: background var(--caui-dur-xs) var(--caui-ease-out), border-color var(--caui-dur-xs) var(--caui-ease-out), transform var(--caui-dur-xs) var(--caui-ease-out);
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
   减少动态效果：只保留必要的一帧，避免前庭不适
   --------------------------------------------------------------------------- */
@media (prefers-reduced-motion: reduce) {
  /* 只关常驻循环动画；hover / 焦点用的颜色与背景过渡保留。
     这里管的是 data-motion 还没写上去的首帧，之后由 [data-motion="reduced"] 接管。 */
  .caui-root:not([data-motion="full"]) .caui-empty-mark,
  .caui-chat-page:not([data-motion="full"]) .caui-empty-mark,
  .caui-chat-page:not([data-motion="full"]) .caui-chat-blank-orb,
  .caui-root:not([data-motion="full"]) .caui-live-dot,
  .caui-root:not([data-motion="full"]) .caui-reasoning-spinner,
  .caui-root:not([data-motion="full"]) .caui-tool-status[data-state="running"] {
    animation: none !important;
  }

  .caui-root:not([data-motion="full"]) .caui-streaming-cursor {
    animation: none !important;
    opacity: 0.8;
  }
}

@media (hover: none) {
  .caui-assistant-footer {
    opacity: 1;
  }
}

/* ---------------------------------------------------------------------------
   B Soft glass（原 P0.6 视觉层）已并回本块
   --------------------------------------------------------------------------- */

.caui-flow {
  max-width: 780px;
  gap: 20px;
  padding: 26px 22px 38px;
}

.caui-assistant {
  gap: 13px;
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
  transition: transform var(--caui-dur-sm) var(--caui-ease-out);
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
/* ---------------------------------------------------------------------------
   响应式：本表面自己的窄屏规则 + 覆盖，和它的基础规则放在同一个文件里

   以前这些散在 misc.ts 的两个 640 断点里，靠「谁排在后面谁赢」压住彼此；
   现在按表面归位：媒体查询里是窄屏值，紧跟其后的是覆盖（同一份文件、同一段话
   就能读完顺序）。级联结果由 tests/style-split.test.ts 的级联等价性在 448 个
   状态下逐条盯住。
   --------------------------------------------------------------------------- */

@media (max-width: 640px) {
  /* 两组合并成一块，顺序照原样：先是 P0.6 那一组的值，再是更早的 640 断点的值。
     同名的两条都留着——后写的赢，和合并前「后一个块赢」完全等价，
     也因此规则清单能与基线逐条对上（没有偷偷删掉任何一条声明）。 */

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

  .caui-token-usage {
    display: none;
  }

  .caui-markdown pre {
    font-size: 12px;
    padding: 8px 10px;
  }

  /* —— 更早的 640 断点（原本在 misc.ts 更靠后的位置） —— */

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
}

/* 覆盖：宽屏尺寸在窄屏下仍然成立，所以写在媒体查询之后（同文件内就近） */

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
}
`