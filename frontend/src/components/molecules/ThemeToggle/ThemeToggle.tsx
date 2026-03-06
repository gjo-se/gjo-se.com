import { Sun, Moon } from 'lucide-react'
import Button from '../../atoms/Button'

export interface ThemeToggleProps {
  /** Aktueller Dark-Mode-Zustand */
  isDark: boolean
  /** Callback beim Umschalten */
  onToggle: () => void
  /** Zusätzliche CSS-Klassen */
  className?: string
}

/**
 * ThemeToggle – Button zum Umschalten zwischen Dark- und Light-Mode.
 *
 * @example
 * <ThemeToggle isDark={isDark} onToggle={() => setIsDark(d => !d)} />
 */
export default function ThemeToggle({ isDark, onToggle, className }: ThemeToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      aria-label={isDark ? 'Light Mode aktivieren' : 'Dark Mode aktivieren'}
      className={className}
    >
      {isDark ? <Moon size={16} aria-hidden /> : <Sun size={16} aria-hidden />}
    </Button>
  )
}
