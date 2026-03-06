import type { SkillCardProps } from '../../molecules/SkillCard'
import SkillCard from '../../molecules/SkillCard'
import Text from '../../atoms/Text'

export interface SkillGridProps {
  skills: SkillCardProps[]
  categories?: string[]
  className?: string
}

/** SkillGrid – Grid aus SkillCards gruppiert nach Kategorie. Stub – wird in Phase 2c ausgebaut. */
export default function SkillGrid({ skills, className }: SkillGridProps) {
  return (
    <section className={className}>
      <Text as="h2" variant="subheading" weight="semibold" className="mb-4">Skills</Text>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map(s => <SkillCard key={s.name} {...s} />)}
      </div>
    </section>
  )
}
