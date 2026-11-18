/**
 * Vendored from ibelick/motion-primitives, components/core/border-trail.tsx.
 * Copyright (c) 2024 ibelick, MIT License (see ../LICENCE.md).
 *
 * Local adaptations: local class names, motion import path, and an
 * aria-hidden root because the trail is decorative.
 */

import React from 'react'
import { motion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import { cx } from '../../util'

export interface BorderTrailProps {
  className?: string
  size?: number
  transition?: Transition
  onAnimationComplete?: () => void
  style?: React.CSSProperties
}

export function BorderTrail ({ className, size = 60, transition, onAnimationComplete, style }: BorderTrailProps) {
  const defaultTransition: Transition = { repeat: Infinity, duration: 5, ease: 'linear' }
  return (
    <div className="caui-border-trail" aria-hidden="true">
      <motion.div
        className={cx('caui-border-trail-dot', className)}
        style={{
          width: size,
          offsetPath: 'rect(0 auto auto 0 round ' + size + 'px)',
          ...style,
        }}
        animate={{ offsetDistance: ['0%', '100%'] }}
        transition={transition ?? defaultTransition}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  )
}

export default BorderTrail