/**
 * 「从此分支」按钮：本轮结束行上的幽灵小图标按钮。
 * 图标按钮必须给 title 与 aria-label，否则只有鼠标悬停才能知道它做什么。
 */

import { cls } from './classes'

export interface BranchButtonProps {
  disabled?: boolean
  onBranch: () => void
}

export function BranchButton ({ disabled, onBranch }: BranchButtonProps) {
  return (
    <button
      type="button"
      className={cls.branchButton}
      title="从此分支"
      aria-label="从此分支"
      disabled={disabled === true}
      onClick={(event) => {
        // 结束行整体可能带点击行为，分支按钮必须只触发自己。
        event.stopPropagation()
        if (disabled === true) return
        onBranch()
      }}
    >
      <svg
        className={cls.branchIcon}
        viewBox="0 0 16 16"
        width="14"
        height="14"
        aria-hidden="true"
        focusable="false"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="4.2" cy="3.6" r="1.5" />
        <circle cx="4.2" cy="12.4" r="1.5" />
        <circle cx="11.8" cy="5" r="1.5" />
        <path d="M4.2 5.1v5.8" />
        <path d="M11.8 6.5v.6a3 3 0 0 1-3 3H8.2" />
      </svg>
    </button>
  )
}
