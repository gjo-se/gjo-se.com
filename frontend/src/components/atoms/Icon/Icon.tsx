import type { LucideIcon } from 'lucide-react'
import { cn } from '../../../lib/utils'

export interface IconProps {
  /** Lucide-Icon-Komponente */
  icon: LucideIcon
  /** Größe in Pixeln */
  size?: number
  /** Zusätzliche CSS-Klassen (für Farbe etc.) */
  className?: string
  /** Barrierefreiheit: Beschreibung des Icons */
  'aria-label'?: string
}

/**
 * Icon – Typsicherer Wrapper für Lucide-Icons.
 *
 * @example
 * import { Home } from 'lucide-react'
 * <Icon icon={Home} size={20} className="text-blue-600" />
 */
export default function Icon({
  icon: LucideIconComponent,
  size = 16,
  className,
  'aria-label': ariaLabel,
}: IconProps) {
  return (
    <LucideIconComponent
      size={size}
      className={cn('shrink-0', className)}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    />
  )
}
