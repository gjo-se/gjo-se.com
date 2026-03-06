import Link from '../../atoms/Link'
import Text from '../../atoms/Text'
import TagGroup from '../TagGroup'
import { cn } from '../../../lib/utils'

export interface ProjectCardProps {
  /** Projekttitel */
  title: string
  /** Kurzbeschreibung */
  description?: string
  /** Technologie-Tags */
  tags?: string[]
  /** Link zum Projekt */
  href?: string
  /** Optionales Vorschaubild */
  imageSrc?: string
  /** Zusätzliche CSS-Klassen */
  className?: string
}

/**
 * ProjectCard – Karte zur Darstellung eines Portfolio-Projekts.
 *
 * @example
 * <ProjectCard title="gjo-se.com" description="Persönliche Portfolio-Website" tags={['React', 'FastAPI']} href="/portfolio/gjo-se" />
 */
export default function ProjectCard({
  title,
  description,
  tags = [],
  href,
  imageSrc,
  className,
}: ProjectCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md',
        className,
      )}
    >
      {/* Bild */}
      <div className="h-40 w-full bg-gray-100">
        {imageSrc ? (
          <img src={imageSrc} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <span className="text-xs">Kein Vorschaubild</span>
          </div>
        )}
      </div>

      {/* Inhalt */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Text as="h3" variant="subheading" weight="semibold" className="text-gray-900">
          {title}
        </Text>
        {description && (
          <Text variant="body" className="text-sm text-gray-500 line-clamp-2">
            {description}
          </Text>
        )}
        {tags.length > 0 && <TagGroup tags={tags} color="blue" className="mt-auto pt-2" />}
        {href && (
          <Link to={href.startsWith('/') ? href : undefined} href={href.startsWith('/') ? undefined : href} className="mt-2 text-sm">
            Mehr erfahren →
          </Link>
        )}
      </div>
    </div>
  )
}
