import { cn } from '../../../lib/utils'

/** Ausrichtung der Trennlinie */
export type DividerOrientation = 'horizontal' | 'vertical'

/** Linienstil */
export type DividerVariant = 'solid' | 'dashed'

export interface DividerProps {
  /** Ausrichtung */
  orientation?: DividerOrientation
  /** Linienstil */
  variant?: DividerVariant
  /** Zusätzliche CSS-Klassen */
  className?: string
}

/**
 * Divider – Visuelle Trennlinie zwischen Inhaltsbereichen.
 *
 * @example
 * <Divider />
 * <Divider orientation="vertical" className="h-6" />
 * <Divider variant="dashed" />
 */
export default function Divider({
  orientation = 'horizontal',
  variant = 'solid',
  className,
}: DividerProps) {
  return (
    <hr
      aria-hidden
      className={cn(
        'border-gray-200',
        orientation === 'horizontal' ? 'w-full border-t' : 'h-full border-l',
        variant === 'dashed' && 'border-dashed',
        className,
      )}
    />
  )
}
