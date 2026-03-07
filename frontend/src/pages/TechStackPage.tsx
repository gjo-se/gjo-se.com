import PageHeader from '../components/organisms/PageHeader'
import SkillGrid from '../components/organisms/SkillGrid'
import type { SkillCardProps } from '../components/molecules/SkillCard'
import Divider from '../components/atoms/Divider'
import Text from '../components/atoms/Text'
import SEOMeta from '../components/atoms/SEOMeta'

const FRONTEND_SKILLS: SkillCardProps[] = [
  { name: 'React', level: 'expert' },
  { name: 'TypeScript', level: 'expert' },
  { name: 'Tailwind CSS', level: 'expert' },
  { name: 'Vite', level: 'advanced' },
  { name: 'Vue.js', level: 'intermediate' },
]

const BACKEND_SKILLS: SkillCardProps[] = [
  { name: 'Python', level: 'advanced' },
  { name: 'FastAPI', level: 'advanced' },
  { name: 'SQLAlchemy', level: 'advanced' },
  { name: 'Alembic', level: 'intermediate' },
  { name: 'Pydantic', level: 'advanced' },
]

const INFRA_SKILLS: SkillCardProps[] = [
  { name: 'Docker', level: 'intermediate' },
  { name: 'PostgreSQL', level: 'intermediate' },
  { name: 'GitHub Actions', level: 'intermediate' },
  { name: 'nginx', level: 'beginner' },
]

/**
 * TechStackPage – Übersicht der Technologien kategorisiert nach Bereich.
 */
export default function TechStackPage() {
  return (
    <div>
      <SEOMeta
        title="Tech Stack"
        description="Mein technisches Skillset: Backend, Frontend, DevOps und mehr."
      />
      <PageHeader
        title="Tech Stack"
        subtitle="Die Technologien und Tools die ich einsetze – kategorisiert nach Bereich."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Tech Stack' }]}
      />

      <section className="mb-10">
        <Text as="h2" variant="subheading" weight="semibold" className="mb-4 text-gray-700">Frontend</Text>
        <SkillGrid skills={FRONTEND_SKILLS} />
      </section>

      <Divider className="my-8" />

      <section className="mb-10">
        <Text as="h2" variant="subheading" weight="semibold" className="mb-4 text-gray-700">Backend</Text>
        <SkillGrid skills={BACKEND_SKILLS} />
      </section>

      <Divider className="my-8" />

      <section>
        <Text as="h2" variant="subheading" weight="semibold" className="mb-4 text-gray-700">Infrastruktur & Tooling</Text>
        <SkillGrid skills={INFRA_SKILLS} />
      </section>
    </div>
  )
}
