/**
 * Vendored from ibelick/motion-primitives, components/core/text-effect.tsx.
 * Copyright (c) 2024 ibelick, MIT License (see ../LICENCE.md).
 *
 * Local adaptations: framer-motion instead of motion/react, local cx instead
 * of Tailwind/cn, local class names, and a static render when trigger=false so
 * reduced-motion users still see the text.
 */

import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { TargetAndTransition, Transition, Variant, Variants } from 'framer-motion'
import { cx } from '../../util'

export type TextEffectPreset = 'blur' | 'fade-in-blur' | 'scale' | 'fade' | 'slide'
export type TextEffectPer = 'word' | 'char' | 'line'

export interface TextEffectProps {
  children: string
  per?: TextEffectPer
  as?: keyof React.JSX.IntrinsicElements
  variants?: { container?: Variants; item?: Variants }
  className?: string
  preset?: TextEffectPreset
  delay?: number
  speedReveal?: number
  speedSegment?: number
  trigger?: boolean
  onAnimationComplete?: () => void
  onAnimationStart?: () => void
  segmentWrapperClassName?: string
  containerTransition?: Transition
  segmentTransition?: Transition
  style?: React.CSSProperties
}

const defaultStaggerTimes: Record<TextEffectPer, number> = { char: 0.03, word: 0.05, line: 0.1 }

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
}

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const presetVariants: Record<TextEffectPreset, { container: Variants; item: Variants }> = {
  blur: {
    container: defaultContainerVariants,
    item: { hidden: { opacity: 0, filter: 'blur(12px)' }, visible: { opacity: 1, filter: 'blur(0px)' }, exit: { opacity: 0, filter: 'blur(12px)' } },
  },
  'fade-in-blur': {
    container: defaultContainerVariants,
    item: { hidden: { opacity: 0, y: 20, filter: 'blur(12px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)' }, exit: { opacity: 0, y: 20, filter: 'blur(12px)' } },
  },
  scale: {
    container: defaultContainerVariants,
    item: { hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0 } },
  },
  fade: {
    container: defaultContainerVariants,
    item: { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } },
  },
  slide: {
    container: defaultContainerVariants,
    item: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 } },
  },
}

function motionTag (as: keyof React.JSX.IntrinsicElements): typeof motion.div {
  const tags = motion as unknown as Record<string, typeof motion.div>
  return tags[as as string] ?? motion.div
}

const AnimationComponent = React.memo(function AnimationComponent ({ segment, variants, per, segmentWrapperClassName }: {
  segment: string
  variants: Variants
  per: 'line' | 'word' | 'char'
  segmentWrapperClassName?: string
}) {
  const content = per === 'line'
    ? <motion.span variants={variants} className="caui-text-effect-line">{segment}</motion.span>
    : per === 'word'
      ? <motion.span aria-hidden="true" variants={variants} className="caui-text-effect-segment">{segment}</motion.span>
      : (
        <motion.span className="caui-text-effect-segment">
          {segment.split('').map((char, charIndex) => (
            <motion.span key={'char-' + charIndex} aria-hidden="true" variants={variants} className="caui-text-effect-char">
              {char}
            </motion.span>
          ))}
        </motion.span>
        )
  if (segmentWrapperClassName === undefined) return content
  return <span className={cx(per === 'line' ? 'caui-text-effect-line' : 'caui-text-effect-segment', segmentWrapperClassName)}>{content}</span>
})

const splitText = (text: string, per: TextEffectPer): string[] => per === 'line' ? text.split('\n') : text.split(/(\s+)/)

const hasTransition = (variant?: Variant): variant is TargetAndTransition & { transition?: Transition } => {
  if (variant === undefined || variant === null) return false
  return typeof variant === 'object' && 'transition' in variant
}

const createVariantsWithTransition = (baseVariants: Variants, transition?: Transition & { exit?: Transition }): Variants => {
  if (transition === undefined) return baseVariants
  const { exit: _exit, ...mainTransition } = transition
  return {
    ...baseVariants,
    visible: {
      ...baseVariants.visible,
      transition: {
        ...(hasTransition(baseVariants.visible) ? baseVariants.visible.transition : {}),
        ...mainTransition,
      },
    },
    exit: {
      ...baseVariants.exit,
      transition: {
        ...(hasTransition(baseVariants.exit) ? baseVariants.exit.transition : {}),
        ...mainTransition,
        staggerDirection: -1,
      },
    },
  }
}

export function TextEffect ({
  children,
  per = 'word',
  as = 'p',
  variants,
  className,
  preset = 'fade',
  delay = 0,
  speedReveal = 1,
  speedSegment = 1,
  trigger = true,
  onAnimationComplete,
  onAnimationStart,
  segmentWrapperClassName,
  containerTransition,
  segmentTransition,
  style,
}: TextEffectProps) {
  const segments = splitText(children, per)
  const MotionTag = motionTag(as)
  const baseVariants = presetVariants[preset] ?? { container: defaultContainerVariants, item: defaultItemVariants }
  const stagger = defaultStaggerTimes[per] / speedReveal
  const baseDuration = 0.3 / speedSegment

  const customStagger = hasTransition(variants?.container?.visible ?? {})
    ? (variants?.container?.visible as TargetAndTransition).transition?.staggerChildren
    : undefined
  const customDelay = hasTransition(variants?.container?.visible ?? {})
    ? (variants?.container?.visible as TargetAndTransition).transition?.delayChildren
    : undefined

  const computedVariants = {
    container: createVariantsWithTransition(variants?.container ?? baseVariants.container, {
      staggerChildren: customStagger ?? stagger,
      delayChildren: customDelay ?? delay,
      ...containerTransition,
      exit: { staggerChildren: customStagger ?? stagger, staggerDirection: -1 },
    }),
    item: createVariantsWithTransition(variants?.item ?? baseVariants.item, {
      duration: baseDuration,
      ...segmentTransition,
    }),
  }

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <MotionTag
        initial={trigger ? 'hidden' : false}
        animate="visible"
        exit="exit"
        variants={computedVariants.container}
        className={cx('caui-text-effect', className)}
        onAnimationComplete={onAnimationComplete}
        onAnimationStart={onAnimationStart}
        style={style}
      >
        {per !== 'line' ? <span className="caui-sr-only">{children}</span> : null}
        {segments.map((segment, index) => (
          <AnimationComponent
            key={per + '-' + index + '-' + segment}
            segment={segment}
            variants={computedVariants.item}
            per={per}
            segmentWrapperClassName={segmentWrapperClassName}
          />
        ))}
      </MotionTag>
    </AnimatePresence>
  )
}

export default TextEffect