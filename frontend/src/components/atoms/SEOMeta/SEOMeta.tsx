import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'gjo-se.com'

interface SEOMetaProps {
  /** Seitenspezifischer Titel – wird zu "{title} | gjo-se.com" formatiert */
  title: string
  /** Kurzbeschreibung der Seite (max. 160 Zeichen empfohlen) */
  description: string
  /** Optionales Open-Graph-Bild (absolute URL) */
  ogImage?: string
  /** Open-Graph-Typ (default: "website") */
  ogType?: string
}

/**
 * SEOMeta – setzt `<title>`, `<meta name="description">`, Open Graph und
 * Twitter Card Tags für eine Seite via react-helmet-async.
 *
 * Verwendung:
 * ```tsx
 * <SEOMeta title="Portfolio" description="Alle Projekte im Überblick." />
 * ```
 */
export default function SEOMeta({
  title,
  description,
  ogImage,
  ogType = 'website',
}: SEOMetaProps) {
  const formattedTitle = `${title} | ${SITE_NAME}`

  return (
    <Helmet>
      <title>{formattedTitle}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={formattedTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={formattedTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  )
}
