/**
 * Derived from ibelick/motion-primitives, components/core/disclosure.tsx
 * (DisclosureContent). Copyright (c) 2024 ibelick, MIT License.
 *
 * The Chat shell needs the animated body only; trigger semantics stay in the
 * owning component so the native button keeps its aria-expanded contract.
 */

import React, { useId } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cx } from '../../util'
import { collapseSpring } from '../../motion'
import { useMotionEnabled } from '../../motion-preference'

export interface CollapsibleBodyProps {
  open: boolean
  id?: string
  className?: string
  children: React.ReactNode
}

export function CollapsibleBody ({ open, id, className, children }: CollapsibleBodyProps) {
  const fallbackId = useId()
  const enabled = useMotionEnabled()
  return (
    <div className="caui-collapsible">
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="body"
            id={id ?? fallbackId}
            className={cx('caui-collapsible-inner', className)}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={enabled ? collapseSpring : { duration: 0 }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default CollapsibleBody