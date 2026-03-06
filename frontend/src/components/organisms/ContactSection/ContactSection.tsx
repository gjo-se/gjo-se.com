import type { SocialLinkProps } from '../../molecules/SocialLink'
import SocialLink from '../../molecules/SocialLink'
import Button from '../../atoms/Button'
import Text from '../../atoms/Text'

export interface ContactSectionProps {
  email?: string
  ctaLabel?: string
  socialLinks?: SocialLinkProps[]
  className?: string
}

/** ContactSection – Kontaktbereich mit CTA und Social Links. Stub – wird in Phase 2c ausgebaut. */
export default function ContactSection({ email, ctaLabel = 'Kontakt aufnehmen', socialLinks = [], className }: ContactSectionProps) {
  return (
    <section className={`flex flex-col items-center gap-6 py-16 text-center ${className ?? ''}`}>
      <Text as="h2" variant="heading" weight="bold">Lass uns sprechen</Text>
      {email && <Button variant="primary" size="lg" onClick={() => window.location.assign(`mailto:${email}`)}>{ctaLabel}</Button>}
      {socialLinks.length > 0 && (
        <div className="flex gap-4">{socialLinks.map(sl => <SocialLink key={sl.href} {...sl} />)}</div>
      )}
    </section>
  )
}
