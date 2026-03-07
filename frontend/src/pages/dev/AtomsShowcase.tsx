import { useState } from 'react'
import { Search, Mail, Eye } from 'lucide-react'

import Button from '../../components/atoms/Button'
import Badge from '../../components/atoms/Badge'
import Icon from '../../components/atoms/Icon'
import Tag from '../../components/atoms/Tag'
import Avatar from '../../components/atoms/Avatar'
import Spinner from '../../components/atoms/Spinner'
import Text from '../../components/atoms/Text'
import Link from '../../components/atoms/Link'
import Divider from '../../components/atoms/Divider'
import Skeleton from '../../components/atoms/Skeleton'
import Input from '../../components/atoms/Input'
import Textarea from '../../components/atoms/Textarea'
import Checkbox from '../../components/atoms/Checkbox'
import Tooltip from '../../components/atoms/Tooltip'
import Chip from '../../components/atoms/Chip'
import CodeBlock from '../../components/atoms/CodeBlock'
import DiagramSlot from '../../components/atoms/DiagramSlot'
import SEOMeta from '../../components/atoms/SEOMeta'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface PropsRow {
  prop: string
  type: string
  default: string
  description: string
}

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
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-4">
        <span className="mr-2 text-xs text-gray-400">Hell:</span>
        {children}
      </div>
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-700 bg-gray-900 p-4">
        <span className="mr-2 text-xs text-gray-500">Dunkel:</span>
        {children}
      </div>
    </div>
  )
}

function Section({
  title,
  description,
  propsRows,
  children,
}: {
  title: string
  description: string
  propsRows: PropsRow[]
  children: React.ReactNode
}) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      <div className="mt-4">
        <PropsTable rows={propsRows} />
      </div>
      <Preview>{children}</Preview>
    </section>
  )
}

// ---------------------------------------------------------------------------
// AtomsShowcase
// ---------------------------------------------------------------------------

/**
 * AtomsShowcase – Dev-only Übersichtsseite für alle Atom-Komponenten.
 * Nur sichtbar bei import.meta.env.DEV.
 */
export default function AtomsShowcase() {
  const [checked, setChecked] = useState(false)
  const [chipSelected, setChipSelected] = useState(false)

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">⚛️ Atoms</h1>
      <p className="mb-10 text-gray-500">
        Kleinste UI-Einheiten ohne eigenen State (Ausnahmen: Tooltip, Checkbox, Chip).
      </p>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Button"
        description="Basis-Interaktionselement in vier Varianten und drei Größen."
        propsRows={[
          { prop: 'variant', type: "'primary'|'secondary'|'ghost'|'destructive'", default: "'primary'", description: 'Visueller Stil' },
          { prop: 'size', type: "'sm'|'md'|'lg'", default: "'md'", description: 'Größe' },
          { prop: 'loading', type: 'boolean', default: 'false', description: 'Zeigt Spinner, deaktiviert Button' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Deaktiviert den Button' },
        ]}
      >
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="primary" size="sm">Small</Button>
        <Button variant="primary" size="lg">Large</Button>
        <Button variant="primary" loading>Loading</Button>
        <Button variant="primary" disabled>Disabled</Button>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Badge"
        description="Kompaktes Status-Label."
        propsRows={[
          { prop: 'variant', type: "'default'|'success'|'warning'|'error'|'info'", default: "'default'", description: 'Farbschema' },
          { prop: 'size', type: "'sm'|'md'", default: "'md'", description: 'Größe' },
        ]}
      >
        <Badge variant="default">Default</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="error">Error</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="success" size="sm">Small</Badge>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Icon"
        description="Typsicherer Wrapper für Lucide-Icons."
        propsRows={[
          { prop: 'icon', type: 'LucideIcon', default: '–', description: 'Lucide-Icon-Komponente (Pflicht)' },
          { prop: 'size', type: 'number', default: '16', description: 'Größe in Pixeln' },
          { prop: 'className', type: 'string', default: '–', description: 'Für Farbe via Tailwind' },
        ]}
      >
        <Icon icon={Search} size={16} />
        <Icon icon={Mail} size={20} className="text-blue-600" />
        <Icon icon={Eye} size={24} className="text-green-600" />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Tag"
        description="Kompaktes Label für Kategorien oder Technologien."
        propsRows={[
          { prop: 'label', type: 'string', default: '–', description: 'Anzeigetext (Pflicht)' },
          { prop: 'color', type: "'neutral'|'blue'|'green'|'purple'|'red'", default: "'neutral'", description: 'Farbschema' },
          { prop: 'onRemove', type: '() => void', default: '–', description: 'Zeigt Entfernen-Button' },
        ]}
      >
        <Tag label="Neutral" />
        <Tag label="React" color="blue" />
        <Tag label="Python" color="green" />
        <Tag label="TypeScript" color="purple" />
        <Tag label="Error" color="red" />
        <Tag label="Entfernbar" color="blue" onRemove={() => {}} />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Avatar"
        description="Kreisförmiges Profilbild mit Initialen-Fallback."
        propsRows={[
          { prop: 'alt', type: 'string', default: '–', description: 'Alt-Text (Pflicht)' },
          { prop: 'src', type: 'string', default: '–', description: 'Bild-URL' },
          { prop: 'initials', type: 'string', default: 'aus alt', description: 'Fallback-Initialen (max 2 Zeichen)' },
          { prop: 'size', type: "'sm'|'md'|'lg'", default: "'md'", description: 'Größe' },
        ]}
      >
        <Avatar alt="Max Mustermann" initials="MM" size="sm" />
        <Avatar alt="Max Mustermann" initials="MM" size="md" />
        <Avatar alt="Max Mustermann" initials="MM" size="lg" />
        <Avatar alt="Gregory" src="https://avatars.githubusercontent.com/u/1" size="md" />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Spinner"
        description="Animierter Lade-Indikator."
        propsRows={[
          { prop: 'size', type: "'sm'|'md'|'lg'", default: "'md'", description: 'Größe' },
          { prop: 'className', type: 'string', default: '–', description: 'Für Farbe via Tailwind' },
        ]}
      >
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
        <Spinner size="md" className="text-blue-600" />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Text"
        description="Typografie-Atom für alle Textelemente."
        propsRows={[
          { prop: 'as', type: "'h1'...'h6'|'p'|'span'|'label'|'caption'", default: "'p'", description: 'HTML-Element' },
          { prop: 'variant', type: "'heading'|'subheading'|'body'|'label'|'caption'", default: "'body'", description: 'Visueller Stil' },
          { prop: 'weight', type: "'normal'|'medium'|'semibold'|'bold'", default: "'normal'", description: 'Schriftstärke' },
        ]}
      >
        <div className="flex flex-col gap-1">
          <Text as="h1" variant="heading" weight="bold">Heading Bold</Text>
          <Text as="h2" variant="subheading" weight="semibold">Subheading Semibold</Text>
          <Text variant="body">Body Normal Text</Text>
          <Text variant="label" weight="medium">Label Medium</Text>
          <Text variant="caption">Caption Text</Text>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Link"
        description="Interner (React Router) und externer Link-Wrapper."
        propsRows={[
          { prop: 'to', type: 'string', default: '–', description: 'Interner Pfad (React Router)' },
          { prop: 'href', type: 'string', default: '–', description: 'Externe URL' },
          { prop: 'variant', type: "'default'|'muted'|'danger'", default: "'default'", description: 'Visueller Stil' },
          { prop: 'external', type: 'boolean', default: 'false', description: 'Öffnet in neuem Tab' },
        ]}
      >
        <Link to="/">Intern: Home</Link>
        <Link href="https://github.com" external>Extern: GitHub</Link>
        <Link href="#" variant="muted">Muted</Link>
        <Link href="#" variant="danger">Danger</Link>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Divider"
        description="Visuelle Trennlinie zwischen Inhaltsbereichen."
        propsRows={[
          { prop: 'orientation', type: "'horizontal'|'vertical'", default: "'horizontal'", description: 'Ausrichtung' },
          { prop: 'variant', type: "'solid'|'dashed'", default: "'solid'", description: 'Linienstil' },
        ]}
      >
        <div className="flex w-full flex-col gap-3">
          <Divider />
          <Divider variant="dashed" />
          <div className="flex h-8 items-center gap-3">
            <span className="text-xs text-gray-500">Links</span>
            <Divider orientation="vertical" className="h-full" />
            <span className="text-xs text-gray-500">Rechts</span>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Skeleton"
        description="Animierter Lade-Platzhalter für Inhaltsblöcke."
        propsRows={[
          { prop: 'variant', type: "'rect'|'circle'", default: "'rect'", description: 'Form' },
          { prop: 'width', type: 'string', default: "'w-full'", description: 'Tailwind-Breiten-Klasse' },
          { prop: 'height', type: 'string', default: "'h-4'", description: 'Tailwind-Höhen-Klasse' },
        ]}
      >
        <div className="flex w-full flex-col gap-2">
          <Skeleton width="w-full" height="h-4" />
          <Skeleton width="w-3/4" height="h-4" />
          <Skeleton width="w-1/2" height="h-4" />
        </div>
        <Skeleton variant="circle" width="w-10" height="h-10" />
        <Skeleton variant="rect" width="w-24" height="h-24" />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Input"
        description="Basis-Texteingabe mit Icon-Slots und Fehlerzustand."
        propsRows={[
          { prop: 'placeholder', type: 'string', default: '–', description: 'Platzhaltertext' },
          { prop: 'error', type: 'string', default: '–', description: 'Fehlermeldung (zeigt roten Rahmen)' },
          { prop: 'leftIcon', type: 'LucideIcon', default: '–', description: 'Icon links' },
          { prop: 'rightIcon', type: 'LucideIcon', default: '–', description: 'Icon rechts' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Deaktiviert' },
        ]}
      >
        <div className="flex w-full flex-col gap-2">
          <Input placeholder="Standard Input" />
          <Input placeholder="Mit linkem Icon" leftIcon={Search} />
          <Input placeholder="Mit rechtem Icon" rightIcon={Mail} />
          <Input placeholder="Fehler-Zustand" error="Pflichtfeld" />
          <Input placeholder="Deaktiviert" disabled />
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Textarea"
        description="Mehrzeiliges Texteingabe-Atom."
        propsRows={[
          { prop: 'placeholder', type: 'string', default: '–', description: 'Platzhaltertext' },
          { prop: 'rows', type: 'number', default: '–', description: 'Anzahl sichtbarer Zeilen' },
          { prop: 'error', type: 'string', default: '–', description: 'Fehlermeldung' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Deaktiviert' },
        ]}
      >
        <div className="flex w-full flex-col gap-2">
          <Textarea placeholder="Nachricht eingeben..." rows={3} />
          <Textarea placeholder="Fehler-Zustand" error="Zu kurz" rows={2} />
          <Textarea placeholder="Deaktiviert" disabled rows={2} />
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Checkbox"
        description="Styled Checkbox mit optionalem Label."
        propsRows={[
          { prop: 'checked', type: 'boolean', default: '–', description: 'Aktueller Zustand (Pflicht)' },
          { prop: 'onChange', type: '(checked: boolean) => void', default: '–', description: 'Callback (Pflicht)' },
          { prop: 'label', type: 'string', default: '–', description: 'Label neben Checkbox' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Deaktiviert' },
        ]}
      >
        <Checkbox checked={checked} onChange={setChecked} label="AGB akzeptieren" />
        <Checkbox checked={true} onChange={() => {}} label="Bereits ausgewählt" />
        <Checkbox checked={false} onChange={() => {}} label="Deaktiviert" disabled />
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Tooltip"
        description="Hover-Info-Overlay für zusätzliche Kontextinformationen."
        propsRows={[
          { prop: 'content', type: 'string', default: '–', description: 'Anzuzeigender Text (Pflicht)' },
          { prop: 'placement', type: "'top'|'bottom'|'left'|'right'", default: "'top'", description: 'Position' },
        ]}
      >
        <Tooltip content="Oben (Standard)" placement="top">
          <Button variant="secondary" size="sm">Hover: Top</Button>
        </Tooltip>
        <Tooltip content="Unten" placement="bottom">
          <Button variant="secondary" size="sm">Hover: Bottom</Button>
        </Tooltip>
        <Tooltip content="Links" placement="left">
          <Button variant="secondary" size="sm">Hover: Left</Button>
        </Tooltip>
        <Tooltip content="Rechts" placement="right">
          <Button variant="secondary" size="sm">Hover: Right</Button>
        </Tooltip>
      </Section>

      {/* ------------------------------------------------------------------ */}
      <Section
        title="Chip"
        description="Kompaktes interaktives Label für Filter oder Tags."
        propsRows={[
          { prop: 'label', type: 'string', default: '–', description: 'Anzeigetext (Pflicht)' },
          { prop: 'selected', type: 'boolean', default: 'false', description: 'Ausgewählt-Zustand' },
          { prop: 'onClick', type: '() => void', default: '–', description: 'Klick-Callback' },
          { prop: 'onRemove', type: '() => void', default: '–', description: 'Zeigt Entfernen-Button' },
          { prop: 'disabled', type: 'boolean', default: 'false', description: 'Deaktiviert' },
        ]}
      >
        <Chip label="Standard" />
        <Chip label="Ausgewählt" selected />
        <Chip
          label={chipSelected ? 'Aktiv' : 'Inaktiv'}
          selected={chipSelected}
          onClick={() => setChipSelected((s) => !s)}
        />
        <Chip label="Entfernbar" onRemove={() => {}} />
        <Chip label="Deaktiviert" disabled />
      </Section>

      <Section
        title="CodeBlock"
        description="Syntax-Highlighting mit Copy-Button"
        propsRows={[
          { prop: 'code', type: 'string', default: '–', description: 'Quellcode' },
          { prop: 'language', type: 'string', default: '–', description: 'Sprache für Highlighting' },
          { prop: 'filename', type: 'string', default: 'language', description: 'Dateiname in Kopfzeile' },
        ]}
      >
        <div className="w-full">
          <CodeBlock
            code={`import { useState } from 'react'\n\nexport function Counter() {\n  const [count, setCount] = useState(0)\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>\n}`}
            language="typescript"
            filename="Counter.tsx"
          />
        </div>
        <div className="w-full">
          <CodeBlock
            code={`@router.get("/health")\nasync def health_check() -> dict[str, str]:\n    return {"status": "ok"}`}
            language="python"
            filename="health.py"
          />
        </div>
      </Section>

      <Section
        title="DiagramSlot"
        description="Bild/Diagramm-Platzhalter mit Caption"
        propsRows={[
          { prop: 'src', type: 'string', default: 'undefined', description: 'Bild-URL – ohne src wird Platzhalter gezeigt' },
          { prop: 'alt', type: 'string', default: '"Diagramm"', description: 'Alt-Text' },
          { prop: 'caption', type: 'string', default: '–', description: 'Beschriftung unter dem Diagramm' },
          { prop: 'aspectRatio', type: '"16/9" | "4/3" | "1/1"', default: '"16/9"', description: 'Seitenverhältnis' },
        ]}
      >
        <DiagramSlot caption="16/9 Platzhalter" aspectRatio="16/9" className="max-w-md" />
        <DiagramSlot caption="4/3 Platzhalter" aspectRatio="4/3" className="max-w-xs" />
        <DiagramSlot caption="1/1 Platzhalter" aspectRatio="1/1" className="max-w-xs" />
      </Section>

      <Section
        title="SEOMeta"
        description="Setzt <title>, <meta name='description'>, Open Graph und Twitter Card Tags via react-helmet-async. Kein visuelles Rendering."
        propsRows={[
          { prop: 'title', type: 'string', default: '–', description: 'Seitenspezifischer Titel – wird zu "{title} | gjo-se.com" formatiert (Pflicht)' },
          { prop: 'description', type: 'string', default: '–', description: 'Kurzbeschreibung der Seite, max. 160 Zeichen empfohlen (Pflicht)' },
          { prop: 'ogImage', type: 'string', default: 'undefined', description: 'Optionales Open-Graph-Bild (absolute URL)' },
          { prop: 'ogType', type: 'string', default: '"website"', description: 'Open-Graph-Typ' },
        ]}
      >
        <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
          <p className="font-medium text-gray-700">SEOMeta – kein visuelles Rendering</p>
          <p className="mt-1">Schreibt Tags in den <code className="rounded bg-gray-200 px-1">&lt;head&gt;</code> des Dokuments.</p>
          <p className="mt-1 font-mono text-xs text-blue-700">{'<SEOMeta title="Startseite" description="..." />'}</p>
          <SEOMeta title="Atoms Dev-Showcase" description="Übersicht aller Atom-Komponenten für gjo-se.com." />
        </div>
      </Section>
    </div>
  )
}
