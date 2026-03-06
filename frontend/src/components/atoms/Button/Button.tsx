import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../../lib/utils'
import Spinner from '../Spinner'

/** Größen-Varianten für Button */
export type ButtonSize = 'sm' | 'md' | 'lg'

/** Stil-Varianten für Button */
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visueller Stil des Buttons */
  variant?: ButtonVariant
  /** Größe des Buttons */
  size?: ButtonSize
  /** Zeigt einen Lade-Spinner und deaktiviert den Button */
  loading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500',
  secondary:
    'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400',
  ghost:
    'bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-400',
  destructive:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
}

/**
 * Button – Basis-Interaktionselement in vier Varianten und drei Größen.
 *
 * @example
 * <Button variant="primary" size="md" onClick={() => {}}>Speichern</Button>
 * <Button variant="destructive" loading>Löschen...</Button>
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled ?? loading}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}
