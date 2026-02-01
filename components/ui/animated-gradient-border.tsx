'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface AnimatedGradientBorderProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  borderWidth?: number
  borderRadius?: string
  gradientColors?: string[]
  animationDuration?: string
  backgroundColor?: string
  innerClassName?: string
}

export function AnimatedGradientBorder({
  children,
  className,
  containerClassName,
  borderWidth = 2,
  borderRadius = '1.5rem',
  gradientColors = ['#0ea5e9', '#10b981', '#0ea5e9'],
  animationDuration = '4s',
  backgroundColor,
  innerClassName,
}: AnimatedGradientBorderProps) {
  const gradientString = `conic-gradient(from 0deg, ${gradientColors.join(', ')})`

  return (
    <div
      className={cn('relative overflow-hidden', containerClassName)}
      style={{
        borderRadius,
        padding: borderWidth,
        ['--animation-duration' as string]: animationDuration,
      }}
    >
      {/* Rotating gradient - made larger to cover corners during rotation */}
      <div
        className="absolute animate-border-rotate"
        style={{
          inset: '-100%',
          background: gradientString,
        }}
      />

      {/* Inner content with background - masks the center */}
      <div
        className={cn(
          'relative z-10 bg-white/95 dark:bg-zinc-950',
          innerClassName,
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} - ${borderWidth}px)`,
          ...(backgroundColor ? { backgroundColor } : {}),
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default AnimatedGradientBorder
