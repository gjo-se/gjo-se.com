# Blueprint: Phase 2 – Informationsarchitektur

> Projekt: gjo-se.com
> Erstellt: 2026-03-05
> Umstrukturiert: 2026-03-05
> Rolle: REX

---

## Ziel

Zwei parallele Ziele:

1. **gjo-se.com als konkretes Produkt** – die persönliche SWE/Architekt-Website mit Portfolio, CV, Tech Stack, Impressum.
2. **Wiederverwendbarer Bausatz** – jede Entscheidung (Komponente, Layout, Auth-Flow) so treffen, dass sie in künftigen Projekten als Startpunkt dient.

> **Prinzip:** Von außen nach innen, von grob nach fein.
> Erst die Struktur, dann die Inhalte, dann die Interaktion.

---

## Umsetzungsreihenfolge (Übersicht)

| Phase  | Inhalt                                                       | Abhängigkeit | Tickets              |
|--------|--------------------------------------------------------------|---|----------------------|
| **2a** | Atomic Design Ordnerstruktur + React Router Setup     | – | #66-68 ✅             |
| **2b** | DefaultLayout: Header, Footer, Navigation (Desktop + Mobile) | 2a | ✅ (in #68 umgesetzt) |
| **2c** | Alle Seiten als leere Shells mit Lorem Ipsum + Routing       | 2b | #77                  |
| **2d** | Dark Mode + ThemeToggle                                      | 2b | ✅ (in 2b integriert) |
| **2e** | Responsive Design prüfen (Mobile-First, alle Breakpoints)    | 2c, 2d | ✅ (geprüft + HeroSection nachgebessert) |
| **2f** | Projekt-Detail-Template (DiagramSlot, CodeBlock) + Detailseiten alle 6 Projekte | 2c | #80 |
| **2g** | SEO / Meta-Tags (`react-helmet-async`)                       | 2c | #82 |
| **2h** | Auth-Flow (Context, Guards, Login/Register)                  | 2c |
| **2i** | Storybook + E2E Tests (Playwright)                           | 2h |

---

## Phase 2a – Atomic Design Ordnerstruktur + React Router Setup

**Abhängigkeit:** –

> **Research:** → [`docs/research/phase2a-atomic-design-research.md`](phase2a-atomic-design-research.md)

### Konzept: Atomic Design vs. TYPO3 ContentElements

TYPO3 Content Elements entsprechen in React **Organisms** – beide sind die kleinste eigenständig
verwendbare Einheit auf einer Seite. Atoms und Molecules sind deren interne Bausteine.

> TYPO3 CE ≈ React Organism | Props Interface ≈ FlexForm / TypoScript

### Ordnerstruktur

```
src/
├── components/
│   ├── atoms/           ← kleinste Einheit, kein eigener State
│   │   ├── Button/
│   │   ├── Badge/
│   │   ├── Icon/
│   │   ├── Tag/
│   │   ├── Avatar/
│   │   ├── Spinner/
│   │   ├── Text/        ← neu
│   │   ├── Link/        ← neu
│   │   ├── Divider/     ← neu
│   │   ├── Skeleton/    ← neu
│   │   ├── Input/       ← neu
│   │   ├── Textarea/    ← neu
│   │   ├── Checkbox/    ← neu
│   │   ├── Tooltip/     ← neu
│   │   └── Chip/        ← neu
│   ├── molecules/       ← Kombination aus Atoms
│   │   ├── ProjectCard/
│   │   ├── SkillCard/
│   │   ├── NavLink/
│   │   ├── ThemeToggle/
│   │   ├── SearchBar/
│   │   ├── FormField/   ← neu
│   │   ├── Toast/       ← neu
│   │   ├── Modal/       ← neu
│   │   ├── Breadcrumb/  ← neu
│   │   ├── SocialLink/  ← neu
│   │   ├── TagGroup/    ← neu
│   │   ├── TimelineItem/ ← neu
│   │   ├── FilterChip/  ← neu
│   │   └── AvatarWithName/ ← neu
│   ├── organisms/       ← eigenständige UI-Abschnitte
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── HeroSection/
│   │   ├── ProjectGrid/
│   │   ├── SkillGrid/
│   │   ├── Timeline/
│   │   ├── MobileNav/   ← neu
│   │   ├── AuthForm/    ← neu
│   │   ├── ContactSection/ ← neu
│   │   ├── PageHeader/  ← neu
│   │   ├── ErrorBoundary/ ← neu
│   │   └── CookieBanner/ ← neu
│   └── templates/       ← Seitenlayouts (ohne Inhalt)
│       ├── DefaultLayout/
│       ├── AuthLayout/
│       ├── ProjectDetailLayout/
│       └── DevLayout/   ← neu (nur dev)
├── pages/               ← Seiten (routen zu Templates + Organisms)
│   └── dev/             ← Showcase-Seiten (nur dev)
│       ├── AtomsShowcase.tsx
│       ├── MoleculesShowcase.tsx
│       └── OrganismsShowcase.tsx
├── hooks/               ← Custom React Hooks
└── services/            ← API-Calls, Auth-Logik
```

### Showcase-Seiten (Dev only)

Jede Ebene (Atoms, Molecules, Organisms) hat eine eigene Übersichtsseite.
Die Seiten sind nur im Dev-Build erreichbar (`import.meta.env.DEV`).
In Production werden sie durch Vite-Tree-Shaking vollständig entfernt – kein Prod-Leak.

| Route | Seite | Beschreibung |
|---|---|---|
| `/dev/atoms` | `AtomsShowcase` | Alle Atoms mit allen Varianten |
| `/dev/molecules` | `MoleculesShowcase` | Alle Molecules mit allen Zuständen |
| `/dev/organisms` | `OrganismsShowcase` | Alle Organisms mit Mock-Daten |

Jede Showcase-Seite folgt diesem Aufbau:
```
DevLayout
  ├── Seitentitel + Beschreibung der Ebene
  └── ComponentSection (je Komponente)
        ├── Name + Kurzbeschreibung
        ├── Props-Tabelle
        └── ComponentPreview (hell + dunkel)
              └── Alle Varianten nebeneinander
```

### Sitemap – Routen-Übersicht (vollständig)

| Seite | Zweck | Route | Auth | Env |
|---|---|---|---|---|
| Home | Value Proposition, Hero, CTA | `/` | public | all |
| Portfolio | Projektübersicht | `/portfolio` | public | all |
| Tech Stack | Skills-Visualisierung | `/tech-stack` | public | all |
| About / CV | Biografie + Erfahrung | `/about` | public | all |
| Impressum | Rechtliches (Pflicht DE) | `/impressum` | public | all |
| Datenschutz | DSGVO (Pflicht DE) | `/datenschutz` | public | all |
| Login | Auth-Einstieg | `/login` | public | all |
| Register | Registrierung | `/register` | public | all |
| Dashboard | Geschützter Bereich | `/me` | **protected** | all |
| 404 | Not Found | `*` | public | all |
| Atoms Showcase | Atom-Komponenten (Dev) | `/dev/atoms` | public | **dev only** |
| Molecules Showcase | Molecule-Komponenten (Dev) | `/dev/molecules` | public | **dev only** |
| Organisms Showcase | Organism-Komponenten (Dev) | `/dev/organisms` | public | **dev only** |

---

## Phase 2b – DefaultLayout: Header, Footer, Navigation

**Abhängigkeit:** 2a

### Header
- Logo (links)
- Navigation (mitte/rechts, Desktop: horizontal, Mobile: Burger-Menü)
- ThemeToggle (Dark/Light)
- Auth-Status (Avatar / Login-Button, wenn Auth aktiv)
- `sticky` – bleibt beim Scrollen oben

### Footer
- Copyright
- Navigation (sekundär: Impressum, Datenschutz)
- Social Links (GitHub, LinkedIn)
- Optional: Newsletter / Kontakt

### Navigation
- Desktop: horizontale Leiste im Header (`hidden md:flex`)
- Mobile: Slide-in Drawer (`md:hidden`, Hamburger-Icon)
- Active-State: React Router `NavLink`
- Accessibility: Keyboard-Navigation, ARIA-Labels

---

## Phase 2c – Alle Seiten als leere Shells + Routing

**Abhängigkeit:** 2b

### Informationsarchitektur je Seite

#### Home `/`
```
Hero
  ├── Headline (Value Proposition)
  ├── Subline
  └── CTA-Button (→ Portfolio)
Highlights
  ├── Kurzübersicht: 3–4 Projekte als Cards
  └── Link → Portfolio
Skills-Teaser
  └── Link → Tech Stack
Kontakt-Teaser / Footer-CTA
```

#### Portfolio `/portfolio`
```
Filter-Leiste (Technologie / Kategorie)
Projekt-Grid
  └── ProjectCard
        ├── Thumbnail
        ├── Titel + Kurzbeschreibung
        ├── Tags (Tech Stack)
        └── Link → Detail
```

#### Tech Stack `/tech-stack`
```
Skill-Kategorien (Backend / Frontend / Infra / Tools)
  └── SkillCard
        ├── Icon + Name
        ├── Erfahrungslevel (Bar / Badge)
        └── Tooltip / Detail
```

#### About / CV `/about`
```
Portrait + Kurzbiografie
Erfahrung (Timeline)
Ausbildung (Timeline)
Soft Skills
Download CV (PDF)
Kontakt-Button
```

#### Impressum / Datenschutz
```
Statischer Text-Content (Platzhalter)
```

#### 404
```
Fehlermeldung + Link → Home
```

### Content-Elemente Bausatz

| Element | Beschreibung | Komponente |
|---|---|---|
| Hero Section | Headline + CTA | `HeroSection` |
| Project Card | Thumbnail + Titel + Tags | `ProjectCard` |
| Skill Card | Icon + Name + Level | `SkillCard` |
| Timeline | Erfahrung / Ausbildung | `Timeline` |
| Tag / Badge | Tech-Labels | `Tag`, `Badge` |
| Toast / Notification | Feedback-Meldungen | `Toast` |
| Modal | Overlay-Dialoge | `Modal` |
| Skeleton Loader | Ladezustand | `Skeleton` |

---

## Phase 2d – Dark Mode + ThemeToggle

**Abhängigkeit:** 2b

- Tailwind `darkMode: 'class'` – CSS-Klasse `dark` auf `<html>`
- `ThemeToggle`-Komponente setzt `localStorage`-Wert + `dark`-Klasse
- Initialisierung in `main.tsx` vor dem ersten Render (kein Flicker)
- Farbpalette: Tailwind `dark:` Varianten (`dark:bg-gray-900`, `dark:text-white`)
- System-Preference als Fallback: `prefers-color-scheme`

---

## Phase 2e – Responsive Design (Mobile-First)

**Abhängigkeit:** 2c, 2d

| Breakpoint | Tailwind | Ziel |
|---|---|---|
| `< 640px` | (default) | Mobile – 1 Spalte |
| `sm: 640px` | `sm:` | Große Phones |
| `md: 768px` | `md:` | Tablet – 2 Spalten |
| `lg: 1024px` | `lg:` | Desktop – 3 Spalten |
| `xl: 1280px` | `xl:` | Wide Desktop |

- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Navigation: `hidden md:flex` / `md:hidden`
- Schriftgrößen: `text-2xl md:text-4xl lg:text-5xl`
- Bilder: `w-full object-cover`

---

## Phase 2f – Projekt-Detail-Template

**Abhängigkeit:** 2c

### Wireframe

```
┌─────────────────────────────────────────┐
│ Header (sticky)                          │
├─────────────────────────────────────────┤
│ Hero: Titel | Tags | GitHub / Demo Links │
├─────────────────────────────────────────┤
│ Kontext & Problem (Text)                 │
├──────────────────────┬──────────────────┤
│ Lösung (Text)        │ Diagramm-Slot    │
├──────────────────────┴──────────────────┤
│ Code-Highlight (Syntax-Highlighted Block)│
├─────────────────────────────────────────┤
│ Ergebnis & Learnings                    │
├─────────────────────────────────────────┤
│ Related Projects (Cards, 3er Grid)      │
├─────────────────────────────────────────┤
│ Footer                                  │
└─────────────────────────────────────────┘
```

### Spezial-Komponenten

| Element | Beschreibung | Komponente |
|---|---|---|
| Code Block | Syntax Highlighting | `CodeBlock` (Shiki / Prism) |
| Diagram Slot | Mermaid / SVG / Bild | `DiagramSlot` |

---

## Phase 2g – SEO / Meta-Tags

**Abhängigkeit:** 2c

- `react-helmet-async` – Title, Description, OG-Tags je Seite
- Jede Seite bekommt eigene `<title>` und `<meta description>`
- OG-Tags für Social Sharing (Twitter Card, Open Graph)

---

## Phase 2h – Auth-Flow

**Abhängigkeit:** 2c

### Frontend-Elemente

| Element | Beschreibung |
|---|---|
| `AuthContext` | React Context mit `user`, `login()`, `logout()` |
| `useAuth()` | Custom Hook für Auth-Zugriff in Komponenten |
| `RequireAuth` | Route-Guard (Redirect → `/login` wenn nicht eingeloggt) |
| `AuthLayout` | Eigenes Layout für Login/Register-Seiten |
| Login-Seite | Email + Passwort, Fehlerbehandlung |
| Register-Seite | Name + Email + Passwort + Bestätigung |
| Token-Handling | JWT in `httpOnly`-Cookie (sicher) oder `localStorage` |
| Axios Interceptor | Token automatisch in alle API-Requests |

### Backend-Gegenstück (FastAPI)

- `POST /api/v1/auth/login` → JWT zurückgeben
- `POST /api/v1/auth/register`
- `GET /api/v1/auth/me` → aktueller User

---

## Phase 2i – Storybook + E2E Tests (Playwright)

**Abhängigkeit:** 2h

- **Storybook:** Komponenten-Dokumentation und visuelle Tests aller Atoms, Molecules, Organisms
- **Playwright:** E2E Tests für kritische User Flows (Navigation, Login, Auth Guard)

---

## Offen – Noch nicht eingeplant

| Thema | Beschreibung | Priorität |
|---|---|---|
| **Error Boundary** | React Error Boundary – verhindert kompletten App-Crash | hoch |
| **Loading States** | Skeleton Loader + Suspense für Daten-fetching | mittel |
| **Accessibility (a11y)** | ARIA-Labels, Keyboard-Navigation, WCAG AA | mittel |
| **Cookie Banner** | DSGVO-konform – nur wenn Tracking/Analytics aktiv | mittel |
| **Analytics** | Privacy-first (Plausible, Umami) | niedrig |
| **i18n** | `react-i18next` – DE/EN als Bausatz-Option | niedrig |


```
1. Sitemap & Seitenbaum          ← Was gibt es?
2. Informationsarchitektur        ← Was steht wo?
