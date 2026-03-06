import SocialLink, { type SocialLinkProps } from '../../molecules/SocialLink'
import Link from '../../atoms/Link'
import Divider from '../../atoms/Divider'
import Text from '../../atoms/Text'
import { cn } from '../../../lib/utils'

export interface FooterLink {
  label: string
  href: string
}

export interface FooterProps {
  /** Navigationslinks */
  links?: FooterLink[]
  /** Social-Media-Links */
  socialLinks?: SocialLinkProps[]
  /** Copyright-Text */
  copyright?: string
  /** Zusätzliche CSS-Klassen */
  className?: string
}

const CURRENT_YEAR = new Date().getFullYear()

/**
 * Footer – Seitenabschluss mit Links, Social-Icons und Copyright.
 * Wird in Phase 2b weiter ausgebaut.
 *
 * @example
 * <Footer copyright="Gregory Erdmann" socialLinks={[{ platform: 'github', href: 'https://github.com/gjo-se' }]} />
 */
export default function Footer({
  links = [],
  socialLinks = [],
  copyright = 'Gregory Erdmann',
  className,
}: FooterProps) {
  return (
    <footer className={cn('border-t border-gray-200 bg-white', className)}>
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Links */}
          {links.length > 0 && (
            <nav className="flex flex-wrap justify-center gap-4 md:justify-start">
              {links.map((link) => (
                <Link key={link.href} href={link.href} variant="muted" className="text-sm">
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Social */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-4">
              {socialLinks.map((sl) => (
                <SocialLink key={sl.href} {...sl} />
              ))}
            </div>
          )}
        </div>

        <Divider className="my-6" />

        <Text variant="caption" className="text-center text-gray-400">
          © {CURRENT_YEAR} {copyright}. Alle Rechte vorbehalten.
        </Text>
      </div>
    </footer>
  )
}
