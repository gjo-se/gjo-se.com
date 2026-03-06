import { useNavigate } from 'react-router-dom'
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
 *
 * @example
 * <HeroSection headline="Hallo, ich bin Gregory." ctaLabel="Portfolio ansehen" ctaHref="/portfolio" />
 */
export default function HeroSection({ headline, subline, ctaLabel, ctaHref, className }: HeroSectionProps) {
  const navigate = useNavigate()

  return (
    <section className={`flex flex-col items-center gap-6 py-24 text-center ${className ?? ''}`}>
      <Text
        as="h1"
        variant="heading"
        weight="bold"
        className="text-4xl text-gray-900 md:text-5xl lg:text-6xl"
      >
        {headline}
      </Text>
      {subline && (
        <Text variant="body" className="max-w-xl text-base text-gray-500 md:text-lg">
          {subline}
        </Text>
      )}
      {ctaLabel && ctaHref && (
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate(ctaHref)}
        >
          {ctaLabel}
        </Button>
      )}
    </section>
  )
}
