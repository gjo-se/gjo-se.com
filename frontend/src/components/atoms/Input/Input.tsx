import type { InputHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../../lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Fehlermeldung – zeigt roten Rahmen */
  error?: string
  /** Icon links im Input */
  leftIcon?: LucideIcon
  /** Icon rechts im Input */
  rightIcon?: LucideIcon
}

/**
 * Input – Basis-Texteingabe mit Icon-Slots und Fehlerzustand.
 *
 * @example
 * <Input placeholder="E-Mail" type="email" />
 * <Input leftIcon={Search} placeholder="Suchen..." />
 * <Input error="Pflichtfeld" placeholder="Name" />
 */
export default function Input({
  error,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className,
  disabled,
  ...props
}: InputProps) {
  return (
    <div className="relative flex w-full items-center">
      {LeftIcon && (
        <LeftIcon
          size={16}
          aria-hidden
          className="pointer-events-none absolute left-3 text-gray-400"
        />
      )}
      <input
        disabled={disabled}
        className={cn(
          'w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900',
          'placeholder:text-gray-400',
          'transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60',
          error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300',
          LeftIcon && 'pl-9',
          RightIcon && 'pr-9',
          className,
        )}
        {...props}
      />
      {RightIcon && (
        <RightIcon
          size={16}
          aria-hidden
          className="pointer-events-none absolute right-3 text-gray-400"
        />
      )}
    </div>
  )
}
