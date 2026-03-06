import { Check } from 'lucide-react'
import { cn } from '../../../lib/utils'

export interface CheckboxProps {
  /** Aktueller Zustand */
  checked: boolean
  /** Callback bei Zustandsänderung */
  onChange: (checked: boolean) => void
  /** Optionales Label neben der Checkbox */
  label?: string
  /** Deaktiviert die Checkbox */
  disabled?: boolean
  /** Zusätzliche CSS-Klassen */
  className?: string
}

/**
 * Checkbox – Styled Checkbox mit optionalem Label.
 *
 * @example
 * <Checkbox checked={agreed} onChange={setAgreed} label="AGB akzeptieren" />
 * <Checkbox checked={false} onChange={() => {}} disabled />
 */
export default function Checkbox({ checked, onChange, label, disabled, className }: CheckboxProps) {
  return (
    <label
      className={cn(
        'inline-flex items-center gap-2 select-none',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className,
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          checked
            ? 'border-blue-600 bg-blue-600 text-white'
            : 'border-gray-300 bg-white',
        )}
      >
        {checked && <Check size={10} strokeWidth={3} aria-hidden />}
      </button>
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  )
}
