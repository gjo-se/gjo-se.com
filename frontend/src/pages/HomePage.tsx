import HeroSection from '../components/organisms/HeroSection'
import ProjectCard from '../components/molecules/ProjectCard'
import SkillCard from '../components/molecules/SkillCard'
import ContactSection from '../components/organisms/ContactSection'
import Text from '../components/atoms/Text'
import Divider from '../components/atoms/Divider'

const HIGHLIGHT_PROJECTS = [
  {
    title: 'gjo-se.com',
    description: 'Persönliche Portfolio-Website – Fullstack mit React, FastAPI und PostgreSQL.',
    tags: ['React', 'FastAPI', 'Docker'],
    href: '/portfolio',
  },
  {
    title: 'Projekt B',
    description: 'E-Commerce Plattform mit modernem Tech-Stack und skalierbarer Architektur.',
    tags: ['Vue', 'Python', 'PostgreSQL'],
    href: '/portfolio',
  },
  {
    title: 'Projekt C',
    description: 'Microservice-Architektur mit CI/CD-Pipeline und automatisierten Tests.',
    tags: ['Docker', 'GitHub Actions', 'pytest'],
    href: '/portfolio',
  },
]

const TEASER_SKILLS = [
  { name: 'React', level: 'expert' as const },
  { name: 'TypeScript', level: 'expert' as const },
  { name: 'Python', level: 'advanced' as const },
  { name: 'FastAPI', level: 'advanced' as const },
  { name: 'Docker', level: 'intermediate' as const },
  { name: 'PostgreSQL', level: 'intermediate' as const },
]

const SOCIAL_LINKS = [
  { platform: 'github' as const, href: 'https://github.com/gjo-se' },
  { platform: 'linkedin' as const, href: 'https://linkedin.com/in/gregory-erdmann' },
]

/**
 * HomePage – Startseite mit Hero, Projekt-Highlights, Skills-Teaser und Kontakt.
 */
export default function HomePage() {
  return (
    <div className="-mx-6 -mt-8">
      {/* Hero */}
      <HeroSection
        headline="Hallo, ich bin Gregory."
        subline="Senior Developer & Software Architect – ich baue skalierbare Fullstack-Anwendungen mit modernem Tech-Stack."
        ctaLabel="Projekte ansehen"
        ctaHref="/portfolio"
      />

      <div className="mx-auto max-w-6xl px-6">
        {/* Projekt-Highlights */}
        <section className="py-16">
          <Text as="h2" variant="heading" weight="bold" className="mb-2 text-gray-900">
            Ausgewählte Projekte
          </Text>
          <Text variant="body" className="mb-8 text-gray-500">
            Ein Auszug aus meinen aktuellen Projekten. Alle Details im Portfolio.
          </Text>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {HIGHLIGHT_PROJECTS.map((p) => (
              <ProjectCard key={p.title} {...p} />
            ))}
          </div>
        </section>

        <Divider />

        {/* Skills-Teaser */}
        <section className="py-16">
          <Text as="h2" variant="heading" weight="bold" className="mb-2 text-gray-900">
            Tech Stack
          </Text>
          <Text variant="body" className="mb-8 text-gray-500">
            Die Technologien mit denen ich täglich arbeite. Vollständige Übersicht im Tech-Stack-Bereich.
          </Text>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TEASER_SKILLS.map((s) => (
              <SkillCard key={s.name} {...s} />
            ))}
          </div>
        </section>

        <Divider />
      </div>

      {/* Kontakt */}
      <ContactSection
        email="hi@gjo-se.com"
        ctaLabel="Kontakt aufnehmen"
        socialLinks={SOCIAL_LINKS}
      />
    </div>
  )
}
