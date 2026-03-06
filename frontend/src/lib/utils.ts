import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility: Tailwind-Klassen sicher zusammenführen.
 * Kombiniert clsx (konditionelle Klassen) mit tailwind-merge (Konflikt-Auflösung).
 *
 * @example cn('px-4', isActive && 'bg-blue-500', 'px-2') → 'bg-blue-500 px-2'
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
