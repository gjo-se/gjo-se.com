import { cn } from '../../../lib/utils'

/** Größen-Varianten für Spinner */
export type SpinnerSize = 'sm' | 'md' | 'lg'

export interface SpinnerProps {
  /** Größe des Spinners */
  size?: SpinnerSize
  /** Zusätzliche CSS-Klassen */
  className?: string
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
}

/**
 * Spinner – Animierter Lade-Indikator.
 *
 * @example
 * <Spinner size="md" />
 * <Spinner size="sm" className="text-white" />
 */
export default function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Lädt..."
      className={cn(
        'inline-block animate-spin rounded-full border-current border-t-transparent',
        sizeClasses[size],
        className,
      )}
    />
  )
}
