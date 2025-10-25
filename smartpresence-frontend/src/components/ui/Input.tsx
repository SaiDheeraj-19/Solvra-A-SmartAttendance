"use client"
import React from 'react'
import { cn } from '@/lib/utils'

type InputProps = {
  label?: string
  type?: string
  placeholder?: string
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  error?: string
  disabled?: boolean
  required?: boolean
  className?: string
  icon?: React.ReactNode
  name?: string
  id?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, type = 'text', placeholder, value, onChange, onBlur, error, disabled = false, required = false, className, icon, name, id }, ref) => {
    const inputId = id ?? name ?? undefined

    return (
      <div className={cn('flex flex-col gap-2 w-full', className)}>
        {label && (
          <label htmlFor={inputId} className="text-label uppercase text-text-primary font-medium">
            {label} {required && <span aria-hidden>*</span>}
          </label>
        )}

        <div className="relative">
          {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">{icon}</span>}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            value={value as any}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            required={required}
            className={cn(
              'w-full px-4 py-3 rounded-xl bg-primary-card backdrop-blur-sm border transition-all duration-200 font-sans text-body-md text-text-primary placeholder:text-text-secondary placeholder:opacity-50',
              icon ? 'pl-10' : '',
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border-primary focus:border-accent-bronze focus:outline-none focus:ring-2 focus:ring-accent-bronze focus:ring-opacity-20',
              disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : '',
              className
            )}
          />
        </div>

        {error && (
          <span id={`${inputId}-error`} className="text-xs text-red-500 font-medium">
            {error}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
