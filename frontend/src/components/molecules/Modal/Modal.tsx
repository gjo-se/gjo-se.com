import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import Button from '../../atoms/Button'
import Text from '../../atoms/Text'
import Divider from '../../atoms/Divider'
import { cn } from '../../../lib/utils'

export interface ModalProps {
  /** Sichtbarkeit */
  isOpen: boolean
  /** Callback beim Schließen */
  onClose: () => void
  /** Optionaler Titel */
  title?: string
  /** Inhalt */
  children: ReactNode
  /** Zusätzliche CSS-Klassen für den Dialog */
  className?: string
}

/**
 * Modal – Dialog-Overlay mit Backdrop und Schließen-Button.
 *
 * @example
 * <Modal isOpen={open} onClose={() => setOpen(false)} title="Bestätigung">
 *   <p>Möchtest du das wirklich löschen?</p>
 * </Modal>
 */
export default function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal
      aria-label={title ?? 'Dialog'}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />
      {/* Dialog */}
      <div
        className={cn(
          'relative z-10 w-full max-w-md rounded-xl bg-white p-6 shadow-xl',
          className,
        )}
      >
        {title && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <Text as="h2" variant="subheading" weight="semibold">
                {title}
              </Text>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Dialog schließen"
                className="h-8 w-8 p-0"
              >
                <X size={16} aria-hidden />
              </Button>
            </div>
            <Divider className="mb-4" />
          </>
        )}
        {children}
      </div>
    </div>
  )
}
