import { X } from 'lucide-react'
import { cn } from '../../../lib/utils'

export interface ChipProps {
  /** Anzeigetext */
  label: string
  /** Markiert den Chip als ausgewählt */
  selected?: boolean
  /** Callback bei Klick */
  onClick?: () => void
  /** Zeigt Entfernen-Button */
  onRemove?: () => void
  /** Deaktiviert Interaktionen */
  disabled?: boolean
  /** Zusätzliche CSS-Klassen */
  className?: string
}

/**
 * Chip – Kompaktes interaktives Label, z.B. für Filter oder Tags.
 *
 * @example
 * <Chip label="React" selected={true} onClick={() => toggle('React')} />
 * <Chip label="Python" onRemove={() => remove('Python')} />
 */
export default function Chip({ label, selected, onClick, onRemove, disabled, className }: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
        selected
          ? 'border-blue-600 bg-blue-600 text-white'
          : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400',
        disabled && 'pointer-events-none opacity-50',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={!disabled ? onClick : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={
        onClick && !disabled
          ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick()
          : undefined
      }
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          aria-label={`${label} entfernen`}
          disabled={disabled}
          className="ml-0.5 rounded-full hover:opacity-70 focus-visible:outline-none"
        >
          <X size={10} aria-hidden />
        </button>
      )}
    </span>
  )
}
