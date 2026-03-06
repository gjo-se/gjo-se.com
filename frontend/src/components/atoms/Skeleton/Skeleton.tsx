import { cn } from '../../../lib/utils'

/** Form-Varianten für Skeleton */
export type SkeletonVariant = 'rect' | 'circle'

export interface SkeletonProps {
  /** Form des Platzhalters */
  variant?: SkeletonVariant
  /** Breite (Tailwind-Klasse oder beliebiger CSS-Wert) */
  width?: string
  /** Höhe (Tailwind-Klasse oder beliebiger CSS-Wert) */
  height?: string
  /** Zusätzliche CSS-Klassen */
  className?: string
}

/**
 * Skeleton – Animierter Lade-Platzhalter für Inhaltsblöcke.
 *
 * @example
 * <Skeleton width="w-48" height="h-4" />
 * <Skeleton variant="circle" width="w-10" height="h-10" />
 */
export default function Skeleton({
  variant = 'rect',
  width = 'w-full',
  height = 'h-4',
  className,
}: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'animate-pulse bg-gray-200',
        variant === 'circle' ? 'rounded-full' : 'rounded-md',
        width,
        height,
        className,
      )}
    />
  )
}
