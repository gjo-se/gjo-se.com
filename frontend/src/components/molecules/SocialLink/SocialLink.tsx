import type React from 'react'
import { Mail, Globe } from 'lucide-react'
import GitHubIcon from '../../atoms/GitHubIcon'
import LinkedInIcon from '../../atoms/LinkedInIcon'
import Link from '../../atoms/Link'
import { cn } from '../../../lib/utils'

/** Unterstützte Plattformen */
export type SocialPlatform = 'github' | 'linkedin' | 'xing' | 'mail' | 'website'

export interface SocialLinkProps {
  /** Plattform – bestimmt das Icon */
  platform: SocialPlatform
  /** Ziel-URL */
  href: string
  /** Optionaler Anzeigetext neben dem Icon */
  label?: string
  /** Zusätzliche CSS-Klassen */
  className?: string
}

/** Gemeinsamer Typ für LucideIcon und eigene SVG-Icons */
type IconComponent = React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>

const platformConfig: Record<SocialPlatform, { icon: IconComponent; defaultLabel: string }> = {
  github:   { icon: GitHubIcon, defaultLabel: 'GitHub' },
  linkedin: { icon: LinkedInIcon, defaultLabel: 'LinkedIn' },
  xing:     { icon: Globe,      defaultLabel: 'XING' },
  mail:     { icon: Mail,       defaultLabel: 'E-Mail' },
  website:  { icon: Globe,      defaultLabel: 'Website' },
}

/**
 * SocialLink – Icon + Link für soziale Netzwerke und Kontaktkanäle.
 *
 * @example
 * <SocialLink platform="github" href="https://github.com/gjo-se" />
 * <SocialLink platform="mail" href="mailto:hi@gjo-se.com" label="Kontakt" />
 */
export default function SocialLink({ platform, href, label, className }: SocialLinkProps) {
  const { icon: IconComponent, defaultLabel } = platformConfig[platform]
  const isMailto = href.startsWith('mailto:')

  return (
    <Link
      href={href}
      external={!isMailto}
      variant="muted"
      aria-label={label ?? defaultLabel}
      className={cn('gap-1.5', className)}
    >
      <IconComponent size={16} aria-hidden />
      {label && <span className="text-sm">{label}</span>}
    </Link>
  )
}
