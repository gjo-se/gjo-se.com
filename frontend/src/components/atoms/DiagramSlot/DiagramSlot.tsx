import { ImageOff } from 'lucide-react'
import { cn } from '../../../lib/utils'

export type DiagramAspectRatio = '16/9' | '4/3' | '1/1'

export interface DiagramSlotProps {
  /** Bild-URL – wenn vorhanden wird das Bild gezeigt, sonst Platzhalter */
  src?: string
  /** Alt-Text für das Bild */
  alt?: string
  /** Beschriftung unter dem Diagramm */
  caption?: string
  /** Seitenverhältnis des Containers */
  aspectRatio?: DiagramAspectRatio
  /** Zusätzliche CSS-Klassen */
  className?: string
}

const aspectClasses: Record<DiagramAspectRatio, string> = {
  '16/9': 'aspect-video',
  '4/3':  'aspect-[4/3]',
  '1/1':  'aspect-square',
}

/**
 * DiagramSlot – Zeigt ein Bild/Diagramm oder einen stilisierten Platzhalter.
 * Responsive: immer `w-full`.
 *
 * @example
 * <DiagramSlot src="/diagrams/arch.svg" alt="Architektur-Diagramm" caption="System-Übersicht" />
 * <DiagramSlot caption="Diagramm folgt" aspectRatio="4/3" />
 */
export default function DiagramSlot({
  src,
  alt = 'Diagramm',
  caption,
  aspectRatio = '16/9',
  className,
}: DiagramSlotProps) {
  return (
    <figure className={cn('w-full', className)}>
      <div
        className={cn(
          'w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800',
          aspectClasses[aspectRatio],
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-300 dark:text-gray-600">
            <ImageOff size={32} aria-hidden />
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {alt ?? 'Diagramm folgt'}
            </span>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
