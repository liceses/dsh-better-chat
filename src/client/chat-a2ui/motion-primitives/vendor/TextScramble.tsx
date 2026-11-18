/**
 * Vendored from ibelick/motion-primitives, components/core/text-scramble.tsx.
 * Copyright (c) 2024 ibelick, MIT License (see ../LICENCE.md).
 *
 * Local adaptations: framer-motion tag helper, local class names, interval
 * cleanup, and effect dependencies that actually follow the visible text.
 */

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cx } from '../../util'

export interface TextScrambleProps extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  children: string
  duration?: number
  speed?: number
  characterSet?: string
  as?: React.ElementType
  trigger?: boolean
  onScrambleComplete?: () => void
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function motionTag (as: React.ElementType): typeof motion.span {
  if (typeof as === 'string') {
    const tags = motion as unknown as Record<string, typeof motion.span>
    return tags[as] ?? motion.span
  }
  return motion.span
}

export function TextScramble ({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = DEFAULT_CHARS,
  className,
  as: Component = 'span',
  trigger = true,
  onScrambleComplete,
  ...rest
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(children)
  const completeRef = useRef(onScrambleComplete)
  completeRef.current = onScrambleComplete

  useEffect(() => {
    setDisplayText(children)
    if (!trigger || duration <= 0 || speed <= 0) return
    const steps = Math.max(1, Math.round(duration / speed))
    let step = 0
    const timer = window.setInterval(() => {
      step += 1
      if (step > steps) {
        window.clearInterval(timer)
        setDisplayText(children)
        completeRef.current?.()
        return
      }
      const progress = step / steps
      let scrambled = ''
      for (let index = 0; index < children.length; index += 1) {
        const char = children[index]
        if (char === undefined) continue
        if (/\s/.test(char)) {
          scrambled += char
        } else if (progress * children.length > index) {
          scrambled += char
        } else {
          scrambled += characterSet[Math.floor(Math.random() * characterSet.length)] ?? char
        }
      }
      setDisplayText(scrambled)
    }, Math.max(16, speed * 1000))
    return () => { window.clearInterval(timer) }
  }, [children, trigger, duration, speed, characterSet])

  const MotionComponent = motionTag(Component) as React.ElementType
  return <MotionComponent {...rest} className={cx('caui-text-scramble', className)}>{displayText}</MotionComponent>
}

export default TextScramble