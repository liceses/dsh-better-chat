/**
 * Vendored from ibelick/motion-primitives, components/core/text-shimmer-wave.tsx.
 * Copyright (c) 2024 ibelick, MIT License (see ../LICENCE.md).
 *
 * Local adaptations: framer-motion, local cx/class names, CSS variables for the
 * two colors instead of Tailwind arbitrary properties, and HTML props passthrough.
 */

import React from 'react'
import { motion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import { cx } from '../../util'

export interface TextShimmerWaveProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  children: string
  as?: React.ElementType
  duration?: number
  zDistance?: number
  xDistance?: number
  yDistance?: number
  spread?: number
  scaleDistance?: number
  rotateYDistance?: number
  transition?: Transition
}

function motionTag (as: React.ElementType): typeof motion.span {
  if (typeof as === 'string') {
    const tags = motion as unknown as Record<string, typeof motion.span>
    return tags[as] ?? motion.span
  }
  return motion.span
}

export function TextShimmerWave ({
  children,
  as: Component = 'span',
  className,
  duration = 1,
  zDistance = 10,
  xDistance = 2,
  yDistance = -2,
  spread = 1,
  scaleDistance = 1.1,
  rotateYDistance = 10,
  transition,
  style,
  ...rest
}: TextShimmerWaveProps) {
  const MotionComponent = motionTag(Component) as React.ElementType
  return (
    <MotionComponent
      {...rest}
      className={cx('caui-text-shimmer-wave', className)}
      style={{ color: 'var(--caui-shimmer-base)', ...style }}
    >
      {children.split('').map((char, index) => {
        const delay = (index * duration * (1 / spread)) / Math.max(children.length, 1)
        return (
          <motion.span
            key={index}
            className="caui-shimmer-char"
            initial={{ translateZ: 0, scale: 1, rotateY: 0, color: 'var(--caui-shimmer-base)' }}
            animate={{
              translateZ: [0, zDistance, 0],
              translateX: [0, xDistance, 0],
              translateY: [0, yDistance, 0],
              scale: [1, scaleDistance, 1],
              rotateY: [0, rotateYDistance, 0],
              color: ['var(--caui-shimmer-base)', 'var(--caui-shimmer-highlight)', 'var(--caui-shimmer-base)'],
            }}
            transition={{
              duration,
              repeat: Infinity,
              repeatDelay: (children.length * 0.05) / spread,
              delay,
              ease: 'easeInOut',
              ...transition,
            }}
          >
            {char}
          </motion.span>
        )
      })}
    </MotionComponent>
  )
}

export default TextShimmerWave