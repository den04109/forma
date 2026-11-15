import { forwardRef, useId, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...rest }, ref) => {
    const autoId = useId()
    const inputId = id ?? autoId
    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="block text-sm font-medium text-ink-soft">{label}</label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-err` : undefined}
          className={cn(
            'h-10 w-full rounded-xl border bg-white px-3 text-sm placeholder:text-ink-muted',
            error ? 'border-red-500' : 'border-line focus:border-brand-600',
            className,
          )}
          {...rest}
        />
        {error && <p id={`${inputId}-err`} className="text-sm text-red-600">{error}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'
