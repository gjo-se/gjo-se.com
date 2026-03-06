import { X } from 'lucide-react'
import { cn } from '../../../lib/utils'

/** Farb-Varianten für Tag */
export type TagColor = 'neutral' | 'blue' | 'green' | 'purple' | 'red'

export interface TagProps {
  /** Anzeigetext */
  label: string
  /** Farbschema */
  color?: TagColor
  /** Callback wenn Entfernen-Button geklickt wird */
  onRemove?: () => void
  /** Zusätzliche CSS-Klassen */
  className?: string
}

const colorClasses: Record<TagColor, string> = {
  neutral: 'bg-gray-100 text-gray-700',
  blue:    'bg-blue-100 text-blue-700',
  green:   'bg-green-100 text-green-700',
  purple:  'bg-purple-100 text-purple-700',
  red:     'bg-red-100 text-red-700',
}

/**
 * Tag – Kompaktes Label für Kategorien oder Technologien.
 *
 * @example
 * <Tag label="React" color="blue" />
 * <Tag label="Python" color="green" onRemove={() => removeTag('Python')} />
 */
export default function Tag({ label, color = 'neutral', onRemove, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium',
        colorClasses[color],
        className,
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`${label} entfernen`}
          className="ml-0.5 rounded hover:opacity-70 focus-visible:outline-none"
        >
          <X size={10} />
        </button>
      )}
    </span>
  )
}
