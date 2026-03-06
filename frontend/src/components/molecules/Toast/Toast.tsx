import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import Button from '../../atoms/Button'
import Text from '../../atoms/Text'
import { cn } from '../../../lib/utils'

/** Stil-Varianten für Toast */
export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export interface ToastProps {
  /** Anzuzeigende Nachricht */
  message: string
  /** Visueller Stil */
  variant?: ToastVariant
  /** Callback beim Schließen */
  onClose: () => void
  /** Zusätzliche CSS-Klassen */
  className?: string
}

const variantConfig: Record<ToastVariant, { icon: typeof CheckCircle; classes: string }> = {
  success: { icon: CheckCircle,    classes: 'bg-green-50 border-green-200 text-green-800' },
  error:   { icon: XCircle,        classes: 'bg-red-50 border-red-200 text-red-800' },
  info:    { icon: Info,            classes: 'bg-blue-50 border-blue-200 text-blue-800' },
  warning: { icon: AlertTriangle,  classes: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
}

/**
 * Toast – Kurze Feedback-Meldung mit Schließen-Button.
 *
 * @example
 * <Toast variant="success" message="Gespeichert!" onClose={() => setVisible(false)} />
 */
export default function Toast({ message, variant = 'info', onClose, className }: ToastProps) {
  const { icon: IconComponent, classes } = variantConfig[variant]

  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-lg border px-4 py-3 shadow-sm',
        classes,
        className,
      )}
    >
      <IconComponent size={18} className="mt-0.5 shrink-0" aria-hidden />
      <Text variant="body" className="flex-1 text-sm">
        {message}
      </Text>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        aria-label="Meldung schließen"
        className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
      >
        <X size={14} aria-hidden />
      </Button>
    </div>
  )
}
