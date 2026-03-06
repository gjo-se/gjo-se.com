import Badge from '../../atoms/Badge'
import Text from '../../atoms/Text'
import { cn } from '../../../lib/utils'

export interface TimelineItemProps {
  /** Datum oder Zeitraum */
  date: string
  /** Titel des Eintrags */
  title: string
  /** Optionale Beschreibung */
  description?: string
  /** Optionales Badge (z.B. Firmenname, Technologie) */
  badge?: string
  /** Letzter Eintrag – kein Verbindungsstrich */
  isLast?: boolean
  /** Zusätzliche CSS-Klassen */
  className?: string
}

/**
 * TimelineItem – Einzelner Eintrag in einer Zeitleiste (CV, Verlauf).
 *
 * @example
 * <TimelineItem date="2022 – heute" title="Senior Developer" badge="Firma GmbH" description="React, TypeScript" />
 */
export default function TimelineItem({
  date,
  title,
  description,
  badge,
  isLast = false,
  className,
}: TimelineItemProps) {
  return (
    <div className={cn('relative flex gap-4', className)}>
      {/* Connector */}
      <div className="flex flex-col items-center">
        <div className="mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-blue-500 bg-white" />
        {!isLast && <div className="mt-1 w-0.5 flex-1 bg-gray-200" />}
      </div>

      {/* Content */}
      <div className={cn('pb-6', isLast && 'pb-0')}>
        <Text variant="caption" className="mb-1 text-gray-500">
          {date}
        </Text>
        <div className="flex flex-wrap items-center gap-2">
          <Text variant="label" weight="semibold" className="text-gray-900">
            {title}
          </Text>
          {badge && <Badge variant="info" size="sm">{badge}</Badge>}
        </div>
        {description && (
          <Text variant="body" className="mt-1 text-sm text-gray-600">
            {description}
          </Text>
        )}
      </div>
    </div>
  )
}
