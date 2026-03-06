import type { ProjectCardProps } from '../../molecules/ProjectCard'
import ProjectCard from '../../molecules/ProjectCard'
import FilterChip from '../../molecules/FilterChip'
import { useState } from 'react'

export interface ProjectGridProps {
  projects: ProjectCardProps[]
  filters?: string[]
  className?: string
}

/** ProjectGrid – Gefiltertes Grid aus ProjectCards. Stub – wird in Phase 2c ausgebaut. */
export default function ProjectGrid({ projects, filters = [], className }: ProjectGridProps) {
  const [active, setActive] = useState<string | null>(null)
  const visible = active ? projects.filter(p => p.tags?.includes(active)) : projects
  return (
    <section className={className}>
      {filters.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {filters.map(f => (
            <FilterChip key={f} label={f} active={active === f} onToggle={() => setActive(a => a === f ? null : f)} />
          ))}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(p => <ProjectCard key={p.title} {...p} />)}
      </div>
    </section>
  )
}
