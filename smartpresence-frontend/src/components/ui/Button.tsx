"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type ButtonProps = {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
  disabled?: boolean
  icon?: React.ReactNode
}

export default function Button({
  children,
  variant = 'primary',
  onClick,
  className,
  type = 'button',
  fullWidth = false,
  disabled = false,
  icon
}: ButtonProps) {
  const base = 'px-6 py-3 rounded-xl font-medium transition-all duration-300 text-sm tracking-wider uppercase flex items-center justify-center gap-2 relative overflow-hidden'

  const variants: Record<string, string> = {
    primary: 'bg-accent-bronze text-white border border-accent-bronze hover:bg-[#a88d63] hover:border-[#a88d63] shadow-bronze-glow',
    secondary: 'bg-transparent text-text-primary border border-border-primary hover:border-accent-bronze hover:shadow-soft',
    outline: 'bg-transparent text-text-primary border border-accent-bronze hover:bg-accent-bronze hover:text-white'
  }

  const classes = cn(base, variants[variant] ?? variants.primary, fullWidth ? 'w-full' : '', className, disabled ? 'opacity-50 cursor-not-allowed' : '')

  return (
    <motion.button
      type={type}
      className={classes}
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? undefined : { scale: 1.02, y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      disabled={disabled}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{children}</span>
      {/* shimmer */}
      <span className="absolute inset-0 pointer-events-none">
        <span className="absolute left-[-120%] top-0 h-full w-20 bg-gradient-to-r from-transparent via-[rgba(191,164,122,0.12)] to-transparent transform hover:translate-x-[240%] transition-all duration-500" />
      </span>
    </motion.button>
  )
}
