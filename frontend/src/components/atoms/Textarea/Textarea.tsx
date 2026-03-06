import type { TextareaHTMLAttributes } from 'react'
import { cn } from '../../../lib/utils'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Fehlermeldung – zeigt roten Rahmen */
  error?: string
}

/**
 * Textarea – Mehrzeiliges Texteingabe-Atom.
 *
 * @example
 * <Textarea placeholder="Nachricht..." rows={4} />
 * <Textarea error="Pflichtfeld" rows={3} />
 */
export default function Textarea({ error, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'w-full rounded-md border bg-white px-3 py-2 text-sm text-gray-900',
        'placeholder:text-gray-400 resize-y min-h-[80px]',
        'transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60',
        error ? 'border-red-400 focus:ring-red-400' : 'border-gray-300',
        className,
      )}
      {...props}
    />
  )
}
