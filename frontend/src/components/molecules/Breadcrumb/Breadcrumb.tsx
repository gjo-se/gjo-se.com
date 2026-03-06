import { ChevronRight } from 'lucide-react'
import Link from '../../atoms/Link'
import { cn } from '../../../lib/utils'

export interface BreadcrumbItem {
  /** Anzeigetext */
  label: string
  /** Optionaler Navigationspfad – letztes Element hat keinen */
  to?: string
}

export interface BreadcrumbProps {
  /** Liste der Pfad-Einträge */
  items: BreadcrumbItem[]
  /** Zusätzliche CSS-Klassen */
  className?: string
}

/**
 * Breadcrumb – Seitenpfad-Navigation aus Link-Atoms mit Trennzeichen.
 *
 * @example
 * <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Portfolio', to: '/portfolio' }, { label: 'Projekt X' }]} />
 */
export default function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={index} className="flex items-center gap-1">
            {item.to && !isLast ? (
              <Link to={item.to} variant="muted" className="text-sm">
                {item.label}
              </Link>
            ) : (
              <span className={cn('text-sm', isLast ? 'font-medium text-gray-900' : 'text-gray-500')}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight size={14} className="text-gray-400" aria-hidden />}
          </span>
        )
      })}
    </nav>
  )
}
