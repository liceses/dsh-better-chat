/**
 * Vendored from ibelick/motion-primitives, components/core/progressive-blur.tsx.
 * Copyright (c) 2024 ibelick, MIT License (see ../LICENCE.md).
 *
 * Local adaptations: static div layers, local classes, and no Tailwind; the
 * gradient/mask math is unchanged.
 */

import React from 'react'
import { cx } from '../../util'

export const GRADIENT_ANGLES = { top: 0, right: 90, bottom: 180, left: 270 } as const

export interface ProgressiveBlurProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: keyof typeof GRADIENT_ANGLES
  blurLayers?: number
  blurIntensity?: number
}

export function ProgressiveBlur ({
  direction = 'bottom',
  blurLayers = 8,
  className,
  blurIntensity = 0.25,
  ...rest
}: ProgressiveBlurProps) {
  const layers = Math.max(blurLayers, 2)
  const segmentSize = 1 / (layers + 1)
  const angle = GRADIENT_ANGLES[direction]
  return (
    <div {...rest} className={cx('caui-progressive-blur', className)} aria-hidden="true">
      {Array.from({ length: layers }).map((_, index) => {
        const gradientStops = [index * segmentSize, (index + 1) * segmentSize, (index + 2) * segmentSize, (index + 3) * segmentSize]
          .map((pos, posIndex) => 'rgba(255, 255, 255, ' + (posIndex === 1 || posIndex === 2 ? 1 : 0) + ') ' + (pos * 100) + '%')
        const gradient = 'linear-gradient(' + angle + 'deg, ' + gradientStops.join(', ') + ')'
        return (
          <div
            key={index}
            className="caui-progressive-blur-layer"
            style={{
              maskImage: gradient,
              WebkitMaskImage: gradient,
              backdropFilter: 'blur(' + (index * blurIntensity) + 'px)',
              WebkitBackdropFilter: 'blur(' + (index * blurIntensity) + 'px)',
            }}
          />
        )
      })}
    </div>
  )
}

export default ProgressiveBlur