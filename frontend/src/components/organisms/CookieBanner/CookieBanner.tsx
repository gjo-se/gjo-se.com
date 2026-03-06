import Button from '../../atoms/Button'
import Text from '../../atoms/Text'
import { cn } from '../../../lib/utils'

export interface CookieBannerProps {
  isVisible: boolean
  onAccept: () => void
  onDecline: () => void
  className?: string
}

/**
 * CookieBanner – DSGVO-konformer Cookie-Hinweis. Stub – wird in Phase 2c ausgebaut.
 *
 * @example
 * <CookieBanner isVisible={!cookiesSet} onAccept={acceptAll} onDecline={declineAll} />
 */
export default function CookieBanner({ isVisible, onAccept, onDecline, className }: CookieBannerProps) {
  if (!isVisible) return null
  return (
    <div
      role="dialog"
      aria-label="Cookie-Hinweis"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white p-4 shadow-lg md:bottom-4 md:left-4 md:right-auto md:max-w-sm md:rounded-xl md:border',
        className,
      )}
    >
      <Text variant="label" weight="semibold" className="mb-1 text-gray-900">
        Cookies & Datenschutz
      </Text>
      <Text variant="caption" className="mb-4 text-gray-500">
        Wir verwenden Cookies, um dir die bestmögliche Erfahrung zu bieten.
      </Text>
      <div className="flex gap-2">
        <Button variant="primary" size="sm" onClick={onAccept}>Akzeptieren</Button>
        <Button variant="ghost" size="sm" onClick={onDecline}>Ablehnen</Button>
      </div>
    </div>
  )
}
