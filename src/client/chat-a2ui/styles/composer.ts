/**
 * 输入区层：常驻输入框（composer）周围由插件负责的那几件事。
 *
 * 1. 空白会话：宿主保留了输入框，但视图区什么都不渲染 —— 把输入框压在底部，
 *    Chat 自己的空态浮在它上方，替代原生 onboarding Hero；
 * 2. 轨迹抽屉里嵌的 Conversation 自带一份输入框，抽屉只要正文，因此隐藏它。
 *
 * 输入框本身的样式由宿主的原生 composer 负责，插件不重复造；
 * 给输入框让位的留白（--caui-composer-clearance）挂在骨架规则上，随 base.ts。
 *
 * B Soft glass（原 P0.6 视觉层）的增量已并回本块末尾：空态面板的 10px 间距与
 * 190px 顶高、光球（复用 flow.ts 的 caui-orb-breathe）和标题的 TextEffect 归零边距。
 * 它们是「空态这一块皮」的一部分，所以跟着输入区而不是消息流。
 */
export const COMPOSER_CSS = `

/* A blank Chat Session keeps the resident composer, but its views area renders
   nothing (the native guard hides it while blank). Pin the composer to the
   floor and show a Chat-specific empty state above it instead of the native
   onboarding Hero. */
.caui-chat-blank [data-conversation-scroll] {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.caui-chat-blank-state {
  position: absolute;
  inset: 0 0 190px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 32px;
  text-align: center;
  pointer-events: none;
}

.caui-chat-blank-title {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--caui-fg);
}

.caui-chat-blank-hint {
  max-width: 420px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--caui-muted);
}

/* The embedded Conversation factory always mounts its resident composer;
   the dock only needs the trajectory body. */
.caui-chat-dock-conversation [data-conversation-region="composer"] {
  display: none !important;
}

/* ---------------------------------------------------------------------------
   B Soft glass（原 P0.6 视觉层）已并回本块
   --------------------------------------------------------------------------- */

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
}`
