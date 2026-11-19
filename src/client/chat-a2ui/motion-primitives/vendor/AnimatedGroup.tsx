/**
 * Vendored from ibelick/motion-primitives, components/core/animated-group.tsx.
 * Copyright (c) 2024 ibelick, MIT License (see ../LICENCE.md).
 *
 * Local adaptations: framer-motion tag helper and local cx instead of cn;
 * the preset set is unchanged.
 */

import React, { ReactNode, useMemo } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { cx } from '../../util'
import { MOTION } from '../../motion-config'

// 预设的过渡统一走令牌：这几个预设原本各写一套弹簧数值，
// 正是「同一角色不同数值」的漂移源头。
const presetSpring = { type: 'spring', ...MOTION.tokens.springs.soft } as const

export type AnimatedGroupPreset = 'fade' | 'slide' | 'scale' | 'blur' | 'blur-slide' | 'zoom' | 'flip' | 'bounce' | 'rotate' | 'swing'

export interface AnimatedGroupProps {
  children: ReactNode
  className?: string
  variants?: { container?: Variants; item?: Variants }
  preset?: AnimatedGroupPreset
  as?: React.ElementType
  asChild?: React.ElementType
}

const defaultContainerVariants: Variants = { visible: { transition: { staggerChildren: 0.1 } } }
const defaultItemVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1 } }

const presetVariants: Record<AnimatedGroupPreset, Variants> = {
  fade: {},
  slide: { hidden: { y: 20 }, visible: { y: 0 } },
  scale: { hidden: { scale: 0.8 }, visible: { scale: 1 } },
  blur: { hidden: { filter: 'blur(4px)' }, visible: { filter: 'blur(0px)' } },
  'blur-slide': { hidden: { filter: 'blur(4px)', y: 20 }, visible: { filter: 'blur(0px)', y: 0 } },
  zoom: { hidden: { scale: 0.5 }, visible: { scale: 1, transition: presetSpring } },
  flip: { hidden: { rotateX: -90 }, visible: { rotateX: 0, transition: presetSpring } },
  bounce: { hidden: { y: -50 }, visible: { y: 0, transition: presetSpring } },
  rotate: { hidden: { rotate: -180 }, visible: { rotate: 0, transition: presetSpring } },
  swing: { hidden: { rotate: -10 }, visible: { rotate: 0, transition: presetSpring } },
}

const addDefaultVariants = (variants: Variants) => ({
  hidden: { ...defaultItemVariants.hidden, ...variants.hidden },
  visible: { ...defaultItemVariants.visible, ...variants.visible },
})

function motionTag (as: React.ElementType): typeof motion.div {
  if (typeof as === 'string') {
    const tags = motion as unknown as Record<string, typeof motion.div>
    return tags[as] ?? motion.div
  }
  return motion.div
}

export function AnimatedGroup ({ children, className, variants, preset, as = 'div', asChild = 'div' }: AnimatedGroupProps) {
  const selectedVariants = {
    item: addDefaultVariants(preset === undefined ? {} : presetVariants[preset] ?? {}),
    container: addDefaultVariants(defaultContainerVariants),
  }
  const containerVariants = variants?.container ?? selectedVariants.container
  const itemVariants = variants?.item ?? selectedVariants.item
  const MotionComponent = useMemo(() => motionTag(as), [as])
  const MotionChild = useMemo(() => motionTag(asChild), [asChild])

  return (
    <MotionComponent initial="hidden" animate="visible" variants={containerVariants} className={cx('caui-animated-group', className)}>
      {React.Children.map(children, (child, index) => (
        <MotionChild key={index} variants={itemVariants}>{child}</MotionChild>
      ))}
    </MotionComponent>
  )
}

export default AnimatedGroup