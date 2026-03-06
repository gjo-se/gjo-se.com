import PageHeader from '../components/organisms/PageHeader'
import Timeline from '../components/organisms/Timeline'
import AvatarWithName from '../components/molecules/AvatarWithName'
import Button from '../components/atoms/Button'
import Text from '../components/atoms/Text'
import Divider from '../components/atoms/Divider'
import type { TimelineItemProps } from '../components/molecules/TimelineItem'
import { Download } from 'lucide-react'

const CV_TIMELINE: TimelineItemProps[] = [
	{
		date: '2022 – heute',
		title: 'Senior Developer & Software Architect',
		badge: 'Entrados GmbH',
		description:
			'Fullstack-Entwicklung mit React, FastAPI und PostgreSQL. Architektur-Entscheidungen, Code-Reviews und Team-Führung.',
	},
	{
		date: '2019 – 2022',
		title: 'Frontend Developer',
		badge: 'Agentur AG',
		description:
			'Entwicklung von Web-Applikationen mit Vue.js und TYPO3. Enge Zusammenarbeit mit UX/Design.',
	},
	{
		date: '2016 – 2019',
		title: 'Junior Developer',
		badge: 'Freelance',
		description: 'Erste Projekte mit HTML, CSS, JavaScript und TYPO3-Extensions.',
	},
	{
		date: '2014 – 2016',
		title: 'Ausbildung – Fachinformatiker Anwendungsentwicklung',
		description: 'Grundlagen der Softwareentwicklung, Datenbanken und Web-Technologien.',
		isLast: true,
	},
]

/**
 * AboutPage – Über mich / CV mit Portrait, Timeline und Download-Button.
 */
export default function AboutPage() {
	return (
		<div>
			<PageHeader
				title="About / CV"
				subtitle="Senior Developer & Software Architect mit über 10 Jahren Erfahrung."
				breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'About' }]}
			/>

			{/* Portrait + Kurzvorstellung */}
			<section className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start">
				<div className="shrink-0">
					<AvatarWithName
						name="Gregory Erdmann"
						role="Senior Developer & Software Architect"
						initials="GE"
						size="lg"
					/>
				</div>
				<div className="flex flex-col gap-3">
					<Text variant="body" className="text-gray-600">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ich entwickle skalierbare
						Fullstack-Applikationen mit React, FastAPI und PostgreSQL. Mein Fokus liegt auf
						sauberem Code, guter Architektur und nachhaltigem Engineering.
					</Text>
					<Text variant="body" className="text-gray-600">
						Neben der Entwicklung interessiere ich mich für Software-Architektur, Developer-Experience
						und moderne CI/CD-Praktiken. Ich arbeite gerne in agilen Teams und lege großen
						Wert auf Code-Qualität und Tests.
					</Text>
					<div className="mt-2">
						<Button
							variant="secondary"
							size="sm"
							onClick={() => {}}
							aria-label="Lebenslauf herunterladen"
						>
							<Download size={14} className="mr-1.5" aria-hidden />
							Lebenslauf herunterladen
						</Button>
					</div>
				</div>
			</section>

			<Divider className="my-8" />

			{/* Werdegang */}
			<section>
				<Text as="h2" variant="subheading" weight="semibold" className="mb-6 text-gray-700">
					Werdegang
				</Text>
				<Timeline items={CV_TIMELINE} />
			</section>
		</div>
	)
}
