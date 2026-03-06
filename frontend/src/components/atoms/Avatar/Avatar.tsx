import { cn } from '../../../lib/utils'

/** Größen-Varianten für Avatar */
export type AvatarSize = 'sm' | 'md' | 'lg'

export interface AvatarProps {
  /** URL des Profilbilds */
  src?: string
  /** Alt-Text für das Bild */
  alt: string
  /** Fallback-Initialen wenn kein src vorhanden (max. 2 Zeichen) */
  initials?: string
  /** Größe */
  size?: AvatarSize
  /** Zusätzliche CSS-Klassen */
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-lg',
}

/**
 * Avatar – Kreisförmiges Profilbild mit Initialen-Fallback.
 *
 * @example
 * <Avatar src="/photo.jpg" alt="Max Mustermann" size="md" />
 * <Avatar alt="Max Mustermann" initials="MM" size="lg" />
 */
export default function Avatar({ src, alt, initials, size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-600 overflow-hidden',
        sizeClasses[size],
        className,
      )}
      aria-label={alt}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span>{initials ?? alt.slice(0, 2).toUpperCase()}</span>
      )}
    </div>
  )
}
