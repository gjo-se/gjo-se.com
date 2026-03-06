import { useState } from 'react'
import { cn } from '../../../lib/utils'

/** Position des Tooltip-Inhalts */
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  /** Anzuzeigender Text */
  content: string
  /** Position relativ zum Trigger */
  placement?: TooltipPlacement
  children: React.ReactNode
  /** Zusätzliche CSS-Klassen für den Wrapper */
  className?: string
}

const placementClasses: Record<TooltipPlacement, string> = {
  top:    'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
  left:   'right-full top-1/2 -translate-y-1/2 mr-1.5',
  right:  'left-full top-1/2 -translate-y-1/2 ml-1.5',
}

/**
 * Tooltip – Hover-Info-Overlay für zusätzliche Kontextinformationen.
 *
 * @example
 * <Tooltip content="Einstellungen öffnen" placement="top">
 *   <Icon icon={Settings} />
 * </Tooltip>
 */
export default function Tooltip({
  content,
  placement = 'top',
  children,
  className,
}: TooltipProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={cn(
            'pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1 text-xs text-white shadow-md',
            placementClasses[placement],
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
