## Rolle
SAM (Senior Developer)

## Kontext

Phase 2c (Seiten-Shells) und Phase 2e (Responsive Design) sind abgeschlossen.
Die `PortfolioPage` zeigt 6 Mock-Projekte als Cards mit Links auf `/portfolio/<slug>`.
Diese Routen existieren noch nicht – sie liefern aktuell die `NotFoundPage`.

Epic: #65

### Vorhandene Mock-Projekte (aus `PortfolioPage.tsx`)

| Slug | Titel |
|---|---|
| `gjo-se` | gjo-se.com |
| `projekt-b` | Projekt B |
| `projekt-c` | Projekt C |
| `projekt-d` | Projekt D |
| `projekt-e` | Projekt E |
| `projekt-f` | Projekt F |

### Vorhandene Spezial-Komponenten (noch zu erstellen)

Laut Plan Phase 2f werden zwei neue Komponenten benötigt:
- `CodeBlock` – Syntax-Highlighting (Bibliothek: `react-syntax-highlighter` oder `shiki`)
- `DiagramSlot` – Platzhalter für Mermaid / SVG / Bild

## Aufgabe

### 1. `ProjectDetailLayout` vervollständigen

`src/components/templates/ProjectDetailLayout/` existiert als Stub.
Layout-Aufbau gemäß Wireframe aus dem Plan:

```
Header (sticky, bereits via DefaultLayout)
├── Hero: Titel | Tags | GitHub- und Demo-Links
├── Kontext & Problem (Text)
├── Lösung (Text) + Diagramm-Slot (nebeneinander, 2-spaltig ab md:)
├── Code-Highlight (CodeBlock)
├── Ergebnis & Learnings
├── Related Projects (3 Cards, ProjectCard-Grid)
└── Footer (bereits via DefaultLayout)
```

### 2. Neue Atom/Molecule-Komponenten

#### `CodeBlock` (`src/components/atoms/CodeBlock/`)
- Bibliothek: `react-syntax-highlighter` (leichtgewichtig, tree-shakeable)
- Props: `code: string`, `language: string`, `filename?: string`
- Dark/Light-Theme-Support (Tailwind `dark:`-Klasse)
- Copy-to-Clipboard Button

#### `DiagramSlot` (`src/components/atoms/DiagramSlot/`)
- Props: `src?: string`, `alt?: string`, `caption?: string`, `aspectRatio?: '16/9' | '4/3' | '1/1'`
- Zeigt Bild wenn `src` vorhanden, sonst stilisierten Platzhalter
- Responsive: `w-full`

### 3. `ProjectDetailPage` – generische Detailseite

`src/pages/ProjectDetailPage.tsx` – liest Slug aus URL-Params (`useParams`),
lädt Mock-Daten aus einer lokalen Konstante und rendert das `ProjectDetailLayout`.

Mock-Daten-Struktur:
```ts
interface ProjectDetail {
  slug: string
  title: string
  tags: string[]
  githubUrl?: string
  demoUrl?: string
  context: string        // Markdown-ähnlicher Text (plain)
  problem: string
  solution: string
  diagramSrc?: string
  codeExample: { code: string; language: string; filename?: string }
  results: string
  learnings: string
  relatedSlugs: string[]
}
```

### 4. Router erweitern

`src/router.tsx` – Route `/portfolio/:slug` unter `DefaultLayout` registrieren,
die `ProjectDetailPage` rendert.

### 5. Alle 6 Projekt-Detailseiten mit Mock-Daten befüllen

Je Projekt einen Eintrag in der Mock-Daten-Konstante anlegen. Inhalte als
sinnvoller Lorem-Ipsum-Platzhalter der die finale Struktur widerspiegelt.

| Slug | Code-Beispiel Sprache |
|---|---|
| `gjo-se` | `typescript` |
| `projekt-b` | `python` |
| `projekt-c` | `yaml` (GitHub Actions) |
| `projekt-d` | `typescript` |
| `projekt-e` | `python` |
| `projekt-f` | `typescript` |

## Akzeptanzkriterien

- [ ] `CodeBlock` Atom implementiert mit Syntax-Highlighting + Copy-Button
- [ ] `DiagramSlot` Atom implementiert mit Bild/Platzhalter + Caption
- [ ] `ProjectDetailPage` rendert korrekt für alle 6 Slugs
- [ ] `/portfolio/gjo-se`, `/portfolio/projekt-b` ... `/portfolio/projekt-f` erreichbar
- [ ] Unbekannter Slug zeigt `NotFoundPage` (kein Hard-Crash)
- [ ] Related Projects zeigen 3 `ProjectCards` mit korrekten Links
- [ ] Responsive: 2-spaltig ab `md:` für Lösung + Diagramm
- [ ] `npm run build` läuft ohne Fehler durch
- [ ] `CodeBlock` und `DiagramSlot` in `AtomsShowcase` eingetragen

## Constraints

- Kein `any` – alle Interfaces vollständig typisiert
- Kein Inline-Style – ausschließlich Tailwind CSS
- `react-syntax-highlighter` via `npm install react-syntax-highlighter @types/react-syntax-highlighter`
- Keine echten API-Calls – Mock-Daten als `const` in `ProjectDetailPage.tsx`
- Kein `console.log()` im finalen Code
