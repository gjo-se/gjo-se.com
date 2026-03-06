import Chip from '../../atoms/Chip'
import { cn } from '../../../lib/utils'

export interface FilterChipProps {
  /** Anzeigetext */
  label: string
  /** Aktuell aktiv/ausgewählt */
  active: boolean
  /** Callback beim Toggle */
  onToggle: () => void
  /** Zusätzliche CSS-Klassen */
  className?: string
}

/**
 * FilterChip – Chip-Atom mit kontrolliertem Toggle-State für Filter.
 *
 * @example
 * <FilterChip label="React" active={activeFilters.includes('React')} onToggle={() => toggle('React')} />
 */
export default function FilterChip({ label, active, onToggle, className }: FilterChipProps) {
  return (
    <Chip
      label={label}
      selected={active}
      onClick={onToggle}
      className={className}
    />
  )
}
