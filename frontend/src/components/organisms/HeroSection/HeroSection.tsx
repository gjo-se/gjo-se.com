import Button from '../../atoms/Button'
import Text from '../../atoms/Text'

export interface HeroSectionProps {
  headline: string
  subline?: string
  ctaLabel?: string
  ctaHref?: string
  className?: string
}

/**
 * HeroSection – Hauptbereich der Startseite mit Headline, Subline und CTA.
 * Wird in Phase 2c vollständig implementiert.
 *
 * @example
 * <HeroSection headline="Hallo, ich bin Gregory." ctaLabel="Portfolio ansehen" ctaHref="/portfolio" />
 */
export default function HeroSection({ headline, subline, ctaLabel, ctaHref, className }: HeroSectionProps) {
  return (
    <section className={`flex flex-col items-center gap-6 py-24 text-center ${className ?? ''}`}>
      <Text as="h1" variant="heading" weight="bold" className="text-4xl text-gray-900">{headline}</Text>
      {subline && <Text variant="body" className="max-w-xl text-gray-500">{subline}</Text>}
      {ctaLabel && ctaHref && (
        <Button variant="primary" size="lg" onClick={() => window.location.assign(ctaHref)}>{ctaLabel}</Button>
      )}
      <div className="mt-2 rounded border border-dashed border-yellow-400 bg-yellow-50 px-3 py-1 text-xs text-yellow-700">
        Stub – wird in Phase 2c ausgebaut
      </div>
    </section>
  )
}
