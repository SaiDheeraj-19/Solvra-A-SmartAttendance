"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type CardProps = {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'bordered'
  hoverable?: boolean
  onClick?: () => void
}

export default function Card({ children, className, variant = 'default', hoverable = true, onClick }: CardProps) {
  const base = 'bg-primary-card backdrop-blur-md rounded-2xl p-6 transition-all duration-300'
  const variants: Record<string, string> = {
    default: 'border border-border-primary shadow-soft',
    elevated: 'border border-border-primary shadow-soft hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]',
    bordered: 'border-2 border-accent-bronze'
  }

  const classes = cn(base, variants[variant] ?? variants.default, onClick ? 'cursor-pointer' : '', className)

  return (
    <motion.div
      className={classes}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick) return
        if (e.key === 'Enter' || e.key === ' ') onClick()
      }}
      whileHover={hoverable && onClick ? { scale: 1.03, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' } : undefined}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
