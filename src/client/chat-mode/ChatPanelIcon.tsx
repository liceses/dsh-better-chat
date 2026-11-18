/** Left-sidebar navigation glyph for the Chat panel. */

import type { ReactElement } from 'react'
import { cls } from '../chat-a2ui/classes'
import { cx } from '../chat-a2ui/util'

/** Props supplied by the sidebar.panellist seat. */
export interface ChatPanelIconProps {
  size?: number
  active?: boolean
}

/** A speech bubble with a small tail, drawn to match the 18px rail glyphs. */
export function ChatPanelIcon ({ size = 18, active = false }: ChatPanelIconProps): ReactElement {
  return (
    <span
      className={cx(cls.chatModePanelIcon, active && cls.chatModePanelIconActive)}
      data-chat-mode-icon=""
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 20 20"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
        strokeLinejoin="round"
        focusable="false"
      >
        <path d="M3.25 9.4c0-3.2 2.65-5.8 5.92-5.8h1.66c3.27 0 5.92 2.6 5.92 5.8s-2.65 5.8-5.92 5.8H8.1l-3.62 2.05.5-3.02A5.56 5.56 0 0 1 3.25 9.4Z" />
        <path d="M7.1 8.2h5.8M7.1 11.2h3.4" opacity="0.62" />
      </svg>
    </span>
  )
}
