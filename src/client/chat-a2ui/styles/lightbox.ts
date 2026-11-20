/**
 * 灯箱层：图片放大查看。
 *
 * 灯箱 portal 到 document.body（避免被滚动容器裁剪），所以这是唯一一块
 * 不套 .caui-root、也不读 --caui-* 变量的样式 —— 全是顶层选择器，
 * 配色与半径都写死在这里，不跟着主题变量走。
 */
export const LIGHTBOX_CSS = `

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
  transition: background var(--caui-dur-xs) var(--caui-ease-out), border-color var(--caui-dur-xs) var(--caui-ease-out);
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
   响应式：灯箱自己的窄屏规则（这一块是顶层选择器，不套 .caui-root）
   --------------------------------------------------------------------------- */

@media (max-width: 640px) {
  .caui-lightbox {
    padding: 12px;
  }

  .caui-lightbox-close {
    top: max(10px, env(safe-area-inset-top));
    right: 10px;
  }
}
`
