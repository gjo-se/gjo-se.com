import type { ReactNode } from 'react'
import Text from '../../atoms/Text'
import Input from '../../atoms/Input'
import Textarea from '../../atoms/Textarea'
import { cn } from '../../../lib/utils'

export interface FormFieldProps {
  /** Label-Text */
  label: string
  /** Fehlermeldung */
  error?: string
  /** Pflichtfeld-Markierung */
  required?: boolean
  /** Zusätzliche CSS-Klassen */
  className?: string
  /** Input- oder Textarea-Atom als children */
  children?: ReactNode
}

/**
 * FormField – Label + Input/Textarea + Fehlermeldung als zusammengehörige Einheit.
 *
 * @example
 * <FormField label="E-Mail" error="Ungültige E-Mail" required>
 *   <Input type="email" placeholder="name@example.com" error="Ungültige E-Mail" />
 * </FormField>
 */
export default function FormField({ label, error, required, className, children }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Text as="label" variant="label" weight="medium" className="text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500" aria-hidden>*</span>}
      </Text>
      {children}
      {error && (
        <Text variant="caption" className="text-red-500">
          {error}
        </Text>
      )}
    </div>
  )
}

export { Input, Textarea }
