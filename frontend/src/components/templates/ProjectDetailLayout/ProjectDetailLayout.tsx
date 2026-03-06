import { ExternalLink } from 'lucide-react'
import GitHubIcon from '../../atoms/GitHubIcon'
import Text from '../../atoms/Text'
import TagGroup from '../../molecules/TagGroup'
import CodeBlock from '../../atoms/CodeBlock'
import DiagramSlot from '../../atoms/DiagramSlot'
import ProjectCard from '../../molecules/ProjectCard'
import Divider from '../../atoms/Divider'
import Link from '../../atoms/Link'
import type { ProjectCardProps } from '../../molecules/ProjectCard'

export interface ProjectDetailData {
  title: string
  tags: string[]
  githubUrl?: string
  demoUrl?: string
  context: string
  problem: string
  solution: string
  diagramSrc?: string
  diagramCaption?: string
  codeExample: { code: string; language: string; filename?: string }
  results: string
  learnings: string
  relatedProjects: ProjectCardProps[]
}

export interface ProjectDetailLayoutProps {
  data: ProjectDetailData
}

/**
 * ProjectDetailLayout – Inhalts-Template für Projekt-Detailseiten.
 * Zeigt Hero, Kontext/Problem, Lösung+Diagramm, CodeBlock, Ergebnis, Related Projects.
 *
 * @example
 * <ProjectDetailLayout data={projectData} />
 */
export default function ProjectDetailLayout({ data }: ProjectDetailLayoutProps) {
  return (
    <article className="mx-auto max-w-4xl">
      {/* Hero */}
      <header className="mb-10">
            <Text as="h1" variant="heading" weight="bold" className="mb-3 text-3xl text-gray-900 md:text-4xl">
              {data.title}
            </Text>
            <TagGroup tags={data.tags} color="blue" className="mb-4" />
            <div className="flex flex-wrap gap-3">
              {data.githubUrl && (
                <Link href={data.githubUrl} className="inline-flex items-center gap-1.5 text-sm">
                  <GitHubIcon size={14} aria-hidden /> GitHub
                </Link>
              )}
              {data.demoUrl && (
                <Link href={data.demoUrl} className="inline-flex items-center gap-1.5 text-sm">
                  <ExternalLink size={14} aria-hidden /> Live Demo
                </Link>
              )}
            </div>
          </header>

          <Divider className="mb-10" />

          {/* Kontext & Problem */}
          <section className="mb-10">
            <Text as="h2" variant="subheading" weight="semibold" className="mb-3 text-gray-900">
              Kontext
            </Text>
            <Text variant="body" className="mb-6 text-gray-600">{data.context}</Text>
            <Text as="h2" variant="subheading" weight="semibold" className="mb-3 text-gray-900">
              Problem
            </Text>
            <Text variant="body" className="text-gray-600">{data.problem}</Text>
          </section>

          <Divider className="mb-10" />

          {/* Lösung + Diagramm 2-spaltig ab md: */}
          <section className="mb-10">
            <Text as="h2" variant="subheading" weight="semibold" className="mb-6 text-gray-900">
              Lösung
            </Text>
            <div className="grid gap-8 md:grid-cols-2 md:items-start">
              <Text variant="body" className="text-gray-600">{data.solution}</Text>
              <DiagramSlot
                src={data.diagramSrc}
                alt={`${data.title} Architektur-Diagramm`}
                caption={data.diagramCaption ?? 'Architektur-Diagramm folgt'}
                aspectRatio="4/3"
              />
            </div>
          </section>

          <Divider className="mb-10" />

          {/* Code-Highlight */}
          <section className="mb-10">
            <Text as="h2" variant="subheading" weight="semibold" className="mb-4 text-gray-900">
              Code-Beispiel
            </Text>
            <CodeBlock
              code={data.codeExample.code}
              language={data.codeExample.language}
              filename={data.codeExample.filename}
            />
          </section>

          <Divider className="mb-10" />

          {/* Ergebnis & Learnings */}
          <section className="mb-10">
            <Text as="h2" variant="subheading" weight="semibold" className="mb-3 text-gray-900">
              Ergebnis
            </Text>
            <Text variant="body" className="mb-6 text-gray-600">{data.results}</Text>
            <Text as="h2" variant="subheading" weight="semibold" className="mb-3 text-gray-900">
              Learnings
            </Text>
            <Text variant="body" className="text-gray-600">{data.learnings}</Text>
          </section>

          {/* Related Projects */}
          {data.relatedProjects.length > 0 && (
            <>
              <Divider className="mb-10" />
              <section>
                <Text as="h2" variant="subheading" weight="semibold" className="mb-6 text-gray-900">
                  Weitere Projekte
                </Text>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {data.relatedProjects.map((p) => (
                    <ProjectCard key={p.title} {...p} />
                  ))}
        </div>
          </section>
        </>
      )}
    </article>
  )
}
