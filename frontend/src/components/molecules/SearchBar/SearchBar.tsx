import { Search, X } from 'lucide-react'
import Input from '../../atoms/Input'
import Button from '../../atoms/Button'
import { cn } from '../../../lib/utils'

export interface SearchBarProps {
  /** Aktueller Suchwert */
  value: string
  /** Callback bei Änderung */
  onChange: (value: string) => void
  /** Platzhaltertext */
  placeholder?: string
  /** Zusätzliche CSS-Klassen */
  className?: string
}

/**
 * SearchBar – Sucheingabe mit Icon und Clear-Button.
 *
 * @example
 * <SearchBar value={query} onChange={setQuery} placeholder="Projekte suchen..." />
 */
export default function SearchBar({ value, onChange, placeholder = 'Suchen...', className }: SearchBarProps) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        leftIcon={Search}
        rightIcon={value ? undefined : undefined}
        className="pr-8"
        aria-label={placeholder}
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange('')}
          aria-label="Suche zurücksetzen"
          className="absolute right-1 h-6 w-6 p-0"
        >
          <X size={12} aria-hidden />
        </Button>
      )}
    </div>
  )
}
