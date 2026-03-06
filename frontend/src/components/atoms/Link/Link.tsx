import { Link as RouterLink } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { cn } from '../../../lib/utils'

/** Stil-Varianten für Link */
export type LinkVariant = 'default' | 'muted' | 'danger'

export interface LinkProps {
  /** Interner Pfad (React Router) – bei internen Links verwenden */
  to?: string
  /** Externe URL – bei externen Links verwenden */
  href?: string
  /** Visueller Stil */
  variant?: LinkVariant
  /** Öffnet in neuem Tab mit rel="noopener noreferrer" */
  external?: boolean
  /** Zusätzliche CSS-Klassen */
  className?: string
  children: React.ReactNode
}

const variantClasses: Record<LinkVariant, string> = {
  default: 'text-blue-600 hover:text-blue-800 hover:underline',
  muted:   'text-gray-500 hover:text-gray-700 hover:underline',
  danger:  'text-red-600 hover:text-red-800 hover:underline',
}

/**
 * Link – Typsicherer Link-Wrapper für interne und externe Links.
 * Verwendet React Router <Link> für interne Navigationen (to),
 * und <a> für externe URLs (href).
 *
 * @example
 * <Link to="/portfolio">Portfolio</Link>
 * <Link href="https://github.com" external>GitHub</Link>
 * <Link href="mailto:mail@example.com" variant="muted">E-Mail</Link>
 */
export default function Link({
  to,
  href,
  variant = 'default',
  external = false,
  className,
  children,
}: LinkProps) {
  const baseClass = cn(
    'inline-flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded',
    variantClasses[variant],
    className,
  )

  if (to) {
    return (
      <RouterLink to={to} className={baseClass}>
        {children}
      </RouterLink>
    )
  }

  return (
    <a
      href={href}
      className={baseClass}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      {external && <ExternalLink size={12} aria-hidden />}
    </a>
  )
}
