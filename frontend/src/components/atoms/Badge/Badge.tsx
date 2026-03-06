import { cn } from '../../../lib/utils'

/** Stil-Varianten für Badge */
export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

/** Größen-Varianten für Badge */
export type BadgeSize = 'sm' | 'md'

export interface BadgeProps {
  /** Visueller Stil */
  variant?: BadgeVariant
  /** Größe */
  size?: BadgeSize
  /** Zusätzliche CSS-Klassen */
  className?: string
  children: React.ReactNode
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error:   'bg-red-100 text-red-700',
  info:    'bg-blue-100 text-blue-700',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-sm',
}

/**
 * Badge – Kompaktes Status-Label für kurze Informationen.
 *
 * @example
 * <Badge variant="success">Aktiv</Badge>
 * <Badge variant="error" size="sm">Fehler</Badge>
 */
export default function Badge({
  variant = 'default',
  size = 'md',
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </span>
  )
}
