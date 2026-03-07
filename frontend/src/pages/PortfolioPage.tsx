import PageHeader from '../components/organisms/PageHeader'
import ProjectGrid from '../components/organisms/ProjectGrid'
import type { ProjectCardProps } from '../components/molecules/ProjectCard'
import SEOMeta from '../components/atoms/SEOMeta'

const MOCK_PROJECTS: ProjectCardProps[] = [
	{
		title: 'gjo-se.com',
		description:
			'Persönliche Portfolio-Website – Fullstack mit React, FastAPI und PostgreSQL.',
		tags: ['React', 'TypeScript', 'FastAPI', 'Docker'],
		href: '/portfolio/gjo-se',
	},
	{
		title: 'Projekt B',
		description:
			'E-Commerce Plattform mit modernem Tech-Stack und skalierbarer Architektur.',
		tags: ['Vue', 'Python', 'PostgreSQL'],
		href: '/portfolio/projekt-b',
	},
	{
		title: 'Projekt C',
		description:
			'Microservice-Architektur mit CI/CD-Pipeline und automatisierten Tests.',
		tags: ['Docker', 'GitHub Actions', 'pytest'],
		href: '/portfolio/projekt-c',
	},
	{
		title: 'Projekt D',
		description:
			'Mobile-first Web-App mit Offline-Funktionalität und Push-Notifications.',
		tags: ['React', 'PWA', 'TypeScript'],
		href: '/portfolio/projekt-d',
	},
	{
		title: 'Projekt E',
		description: 'Interne Tooling-Plattform für Entwickler-Teams.',
		tags: ['Python', 'FastAPI', 'React'],
		href: '/portfolio/projekt-e',
	},
	{
		title: 'Projekt F',
		description:
			'Daten-Dashboard mit Echtzeit-Updates und interaktiven Charts.',
		tags: ['React', 'TypeScript', 'PostgreSQL'],
		href: '/portfolio/projekt-f',
	},
]

const FILTERS = ['React', 'Vue', 'Python', 'Docker', 'TypeScript']

/**
 * PortfolioPage – Übersicht aller Projekte mit Filter.
 */
export default function PortfolioPage() {
	return (
		<div>
			<SEOMeta
				title="Portfolio"
				description="Alle Projekte im Überblick – von Web-Apps bis Infrastruktur."
			/>
			<PageHeader
				title="Portfolio"
				subtitle="Ausgewählte Projekte und Fallstudien aus meiner Arbeit als Senior Developer."
				breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Portfolio' }]}
			/>
			<ProjectGrid projects={MOCK_PROJECTS} filters={FILTERS} />
		</div>
	)
}
