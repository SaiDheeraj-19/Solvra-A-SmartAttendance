"use client"
import React from 'react'
import { cn } from '@/lib/utils'

export type SelectOption = {
  value: string | number
  label: string
}

type SelectProps = {
  label?: string
  options: SelectOption[]
  value?: string | number
  onChange?: (value: string | number) => void
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
  className?: string
  name?: string
  id?: string
}

export default function Select({ label, options, value, onChange, placeholder = 'Select an option', error, disabled = false, required = false, className, name, id }: SelectProps) {
  const selectId = id ?? name ?? undefined

  return (
    <div className={cn('flex flex-col gap-2 w-full', className)}>
      {label && (
        <label htmlFor={selectId} className="text-label uppercase text-text-primary font-medium">
          {label} {required && <span aria-hidden>*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          name={name}
          value={value as any}
          onChange={(e) => onChange && onChange(e.target.value)}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          required={required}
          className={cn(
            'w-full px-4 py-3 pr-10 rounded-xl bg-primary-card backdrop-blur-sm border transition-all duration-200 font-sans text-body-md text-text-primary appearance-none cursor-pointer',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-border-primary focus:border-accent-bronze focus:outline-none focus:ring-2 focus:ring-accent-bronze focus:ring-opacity-20',
            disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''
          )}
        >
          {placeholder && (
            <option value="" disabled selected={!value}>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={String(opt.value)} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">▾</span>
      </div>

      {error && (
        <span id={`${selectId}-error`} className="text-xs text-red-500 font-medium">
          {error}
        </span>
      )}
    </div>
  )
}
