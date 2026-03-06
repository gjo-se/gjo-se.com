import { useState } from 'react'
import { Home, Briefcase } from 'lucide-react'

import NavLink from '../../components/molecules/NavLink'
import ThemeToggle from '../../components/molecules/ThemeToggle'
import SearchBar from '../../components/molecules/SearchBar'
import FormField from '../../components/molecules/FormField'
import Toast from '../../components/molecules/Toast'
import Modal from '../../components/molecules/Modal'
import Breadcrumb from '../../components/molecules/Breadcrumb'
import SocialLink from '../../components/molecules/SocialLink'
import TagGroup from '../../components/molecules/TagGroup'
import TimelineItem from '../../components/molecules/TimelineItem'
import FilterChip from '../../components/molecules/FilterChip'
import AvatarWithName from '../../components/molecules/AvatarWithName'
import ProjectCard from '../../components/molecules/ProjectCard'
import SkillCard from '../../components/molecules/SkillCard'
import Input from '../../components/atoms/Input'
import Button from '../../components/atoms/Button'

// ---------------------------------------------------------------------------
// Helpers (kopiert aus AtomsShowcase – in Phase 2j in shared/ShowcaseHelpers auslagern)
// ---------------------------------------------------------------------------
interface PropsRow { prop: string; type: string; default: string; description: string }

function PropsTable({ rows }: { rows: PropsRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-1.5 pr-4 font-medium">Prop</th>
            <th className="py-1.5 pr-4 font-medium">Typ</th>
            <th className="py-1.5 pr-4 font-medium">Default</th>
            <th className="py-1.5 font-medium">Beschreibung</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.prop} className="border-b border-gray-100">
              <td className="py-1.5 pr-4 font-mono text-blue-700">{r.prop}</td>
              <td className="py-1.5 pr-4 font-mono text-purple-700">{r.type}</td>
              <td className="py-1.5 pr-4 font-mono text-gray-500">{r.default}</td>
              <td className="py-1.5 text-gray-600">{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Preview({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 grid gap-3">
      <div className="flex flex-wrap items-start gap-3 rounded-lg border border-gray-200 bg-white p-4">
        <span className="mr-2 text-xs text-gray-400">Hell:</span>
        {children}
      </div>
      <div className="flex flex-wrap items-start gap-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
        <span className="mr-2 text-xs text-gray-500">Dunkel:</span>
        {children}
      </div>
    </div>
  )
}

function Section({ title, description, propsRows, children }: {
  title: string; description: string; propsRows: PropsRow[]; children: React.ReactNode
}) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      <div className="mt-4"><PropsTable rows={propsRows} /></div>
      <Preview>{children}</Preview>
    </section>
  )
}

// ---------------------------------------------------------------------------
// MoleculesShowcase
// ---------------------------------------------------------------------------

/**
 * MoleculesShowcase – Dev-only Übersichtsseite für alle Molecule-Komponenten.
 * Nur sichtbar bei import.meta.env.DEV.
 */
export default function MoleculesShowcase() {
  const [isDark, setIsDark] = useState(false)
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState(false)
  const [toastVisible, setToastVisible] = useState(true)

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">🧬 Molecules</h1>
      <p className="mb-10 text-gray-500">Kombinationen aus Atoms – können minimalen State halten.</p>

      {/* NavLink */}
      <Section title="NavLink" description="React Router Link mit Active-State-Styling."
        propsRows={[
          { prop: 'to', type: 'string', default: '–', description: 'Zielpfad (Pflicht)' },
          { prop: 'label', type: 'string', default: '–', description: 'Anzeigetext (Pflicht)' },
          { prop: 'icon', type: 'LucideIcon', default: '–', description: 'Optionales Icon' },
        ]}
      >
        <NavLink to="/" label="Home" icon={Home} />
        <NavLink to="/portfolio" label="Portfolio" icon={Briefcase} />
        <NavLink to="/dev/atoms" label="Atoms (aktiv)" />
      </Section>

      {/* ThemeToggle */}
      <Section title="ThemeToggle" description="Umschalten zwischen Dark- und Light-Mode."
        propsRows={[
          { prop: 'isDark', type: 'boolean', default: '–', description: 'Aktueller Zustand (Pflicht)' },
          { prop: 'onToggle', type: '() => void', default: '–', description: 'Callback (Pflicht)' },
        ]}
      >
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark(d => !d)} />
        <span className="text-sm text-gray-500">Aktuell: {isDark ? 'Dark' : 'Light'}</span>
      </Section>

      {/* SearchBar */}
      <Section title="SearchBar" description="Sucheingabe mit Icon und Clear-Button."
        propsRows={[
          { prop: 'value', type: 'string', default: '–', description: 'Aktueller Wert (Pflicht)' },
          { prop: 'onChange', type: '(v: string) => void', default: '–', description: 'Callback (Pflicht)' },
          { prop: 'placeholder', type: 'string', default: "'Suchen...'", description: 'Platzhaltertext' },
        ]}
      >
        <SearchBar value={query} onChange={setQuery} placeholder="Projekte suchen..." className="w-72" />
      </Section>

      {/* FormField */}
      <Section title="FormField" description="Label + Input/Textarea + Fehlermeldung."
        propsRows={[
          { prop: 'label', type: 'string', default: '–', description: 'Label-Text (Pflicht)' },
          { prop: 'error', type: 'string', default: '–', description: 'Fehlermeldung' },
          { prop: 'required', type: 'boolean', default: 'false', description: 'Pflichtfeld-Markierung' },
        ]}
      >
        <div className="flex w-full flex-col gap-3">
          <FormField label="E-Mail" required>
            <Input type="email" placeholder="name@example.com" />
          </FormField>
          <FormField label="Name" error="Pflichtfeld" required>
            <Input placeholder="Dein Name" error="Pflichtfeld" />
          </FormField>
        </div>
      </Section>

      {/* Toast */}
      <Section title="Toast" description="Kurze Feedback-Meldung mit Schließen-Button."
        propsRows={[
          { prop: 'message', type: 'string', default: '–', description: 'Nachricht (Pflicht)' },
          { prop: 'variant', type: "'success'|'error'|'info'|'warning'", default: "'info'", description: 'Stil' },
          { prop: 'onClose', type: '() => void', default: '–', description: 'Schließen-Callback (Pflicht)' },
        ]}
      >
        <div className="flex w-full flex-col gap-2">
          <Toast variant="success" message="Gespeichert!" onClose={() => {}} />
          <Toast variant="error" message="Fehler beim Speichern." onClose={() => {}} />
          <Toast variant="info" message="Hinweis: Neue Version verfügbar." onClose={() => {}} />
          <Toast variant="warning" message="Achtung: Änderungen nicht gespeichert." onClose={() => {}} />
          {toastVisible
            ? <Toast variant="success" message="Ich kann geschlossen werden." onClose={() => setToastVisible(false)} />
            : <Button variant="secondary" size="sm" onClick={() => setToastVisible(true)}>Toast wieder anzeigen</Button>}
        </div>
      </Section>

      {/* Modal */}
      <Section title="Modal" description="Dialog-Overlay mit Backdrop und Schließen-Button."
        propsRows={[
          { prop: 'isOpen', type: 'boolean', default: '–', description: 'Sichtbarkeit (Pflicht)' },
          { prop: 'onClose', type: '() => void', default: '–', description: 'Schließen-Callback (Pflicht)' },
          { prop: 'title', type: 'string', default: '–', description: 'Optionaler Titel' },
        ]}
      >
        <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>Modal öffnen</Button>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Beispiel-Dialog">
          <p className="text-sm text-gray-600">Dies ist der Inhalt des Modals. Klick auf das X oder den Backdrop zum Schließen.</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Abbrechen</Button>
            <Button variant="primary" size="sm" onClick={() => setModalOpen(false)}>Bestätigen</Button>
          </div>
        </Modal>
      </Section>

      {/* Breadcrumb */}
      <Section title="Breadcrumb" description="Seitenpfad-Navigation aus Link-Atoms."
        propsRows={[
          { prop: 'items', type: 'BreadcrumbItem[]', default: '–', description: 'Pfad-Einträge (Pflicht)' },
        ]}
      >
        <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Portfolio', to: '/portfolio' }, { label: 'Projekt X' }]} />
      </Section>

      {/* SocialLink */}
      <Section title="SocialLink" description="Icon + Link für soziale Netzwerke."
        propsRows={[
          { prop: 'platform', type: "'github'|'linkedin'|'xing'|'mail'|'website'", default: '–', description: 'Plattform (Pflicht)' },
          { prop: 'href', type: 'string', default: '–', description: 'Ziel-URL (Pflicht)' },
          { prop: 'label', type: 'string', default: '–', description: 'Optionaler Text neben Icon' },
        ]}
      >
        <SocialLink platform="github" href="https://github.com/gjo-se" />
        <SocialLink platform="linkedin" href="https://linkedin.com" label="LinkedIn" />
        <SocialLink platform="mail" href="mailto:hi@gjo-se.com" label="E-Mail" />
      </Section>

      {/* TagGroup */}
      <Section title="TagGroup" description="Mehrere Tag-Atoms als Gruppe."
        propsRows={[
          { prop: 'tags', type: 'string[]', default: '–', description: 'Tag-Liste (Pflicht)' },
          { prop: 'color', type: 'TagColor', default: "'neutral'", description: 'Einheitliche Farbe' },
          { prop: 'onRemove', type: '(tag: string) => void', default: '–', description: 'Entfernen-Callback' },
        ]}
      >
        <TagGroup tags={['React', 'TypeScript', 'Python', 'FastAPI']} color="blue" />
        <TagGroup tags={['Docker', 'CI/CD']} color="green" onRemove={() => {}} />
      </Section>

      {/* TimelineItem */}
      <Section title="TimelineItem" description="Einzelner Eintrag in einer Zeitleiste."
        propsRows={[
          { prop: 'date', type: 'string', default: '–', description: 'Datum/Zeitraum (Pflicht)' },
          { prop: 'title', type: 'string', default: '–', description: 'Titel (Pflicht)' },
          { prop: 'description', type: 'string', default: '–', description: 'Beschreibung' },
          { prop: 'badge', type: 'string', default: '–', description: 'Badge-Text' },
          { prop: 'isLast', type: 'boolean', default: 'false', description: 'Letzter Eintrag (kein Strich)' },
        ]}
      >
        <div className="w-full">
          <TimelineItem date="2022 – heute" title="Senior Developer" badge="Firma GmbH" description="React, TypeScript, FastAPI" />
          <TimelineItem date="2019 – 2022" title="Frontend Developer" badge="Agentur AG" description="Vue.js, Nuxt, TYPO3" isLast />
        </div>
      </Section>

      {/* FilterChip */}
      <Section title="FilterChip" description="Chip mit Toggle-State für Filter."
        propsRows={[
          { prop: 'label', type: 'string', default: '–', description: 'Anzeigetext (Pflicht)' },
          { prop: 'active', type: 'boolean', default: '–', description: 'Aktiv-Zustand (Pflicht)' },
          { prop: 'onToggle', type: '() => void', default: '–', description: 'Toggle-Callback (Pflicht)' },
        ]}
      >
        <FilterChip label="React" active={activeFilter} onToggle={() => setActiveFilter(a => !a)} />
        <FilterChip label="Python" active={true} onToggle={() => {}} />
        <FilterChip label="Docker" active={false} onToggle={() => {}} />
      </Section>

      {/* AvatarWithName */}
      <Section title="AvatarWithName" description="Avatar + Name + Rollenbezeichnung."
        propsRows={[
          { prop: 'name', type: 'string', default: '–', description: 'Name (Pflicht)' },
          { prop: 'role', type: 'string', default: '–', description: 'Rollenbezeichnung' },
          { prop: 'initials', type: 'string', default: 'aus name', description: 'Fallback-Initialen' },
          { prop: 'size', type: "'sm'|'md'|'lg'", default: "'md'", description: 'Größe' },
        ]}
      >
        <AvatarWithName name="Gregory Erdmann" role="Senior Developer" initials="GE" size="sm" />
        <AvatarWithName name="Gregory Erdmann" role="Senior Developer" initials="GE" size="md" />
        <AvatarWithName name="Gregory Erdmann" initials="GE" size="lg" />
      </Section>

      {/* ProjectCard */}
      <Section title="ProjectCard" description="Karte für Portfolio-Projekte."
        propsRows={[
          { prop: 'title', type: 'string', default: '–', description: 'Projekttitel (Pflicht)' },
          { prop: 'description', type: 'string', default: '–', description: 'Kurzbeschreibung' },
          { prop: 'tags', type: 'string[]', default: '[]', description: 'Technologie-Tags' },
          { prop: 'href', type: 'string', default: '–', description: 'Link zum Projekt' },
        ]}
      >
        <ProjectCard title="gjo-se.com" description="Persönliche Portfolio-Website" tags={['React', 'FastAPI', 'Docker']} href="/portfolio/gjo-se" />
        <ProjectCard title="Projekt ohne Bild" tags={['Python']} />
      </Section>

      {/* SkillCard */}
      <Section title="SkillCard" description="Karte für eine Technologie/einen Skill."
        propsRows={[
          { prop: 'name', type: 'string', default: '–', description: 'Skill-Name (Pflicht)' },
          { prop: 'icon', type: 'LucideIcon', default: '–', description: 'Optionales Icon' },
          { prop: 'level', type: "'beginner'|'intermediate'|'advanced'|'expert'", default: '–', description: 'Kompetenzniveau' },
        ]}
      >
        <SkillCard name="React" icon={Home} level="expert" />
        <SkillCard name="Python" level="advanced" />
        <SkillCard name="Docker" level="intermediate" />
        <SkillCard name="Rust" level="beginner" />
      </Section>
    </div>
  )
}
