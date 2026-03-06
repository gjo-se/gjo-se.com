# Research: Phase 2a – Atomic Design & Showcase-Konzept

> Erstellt: 2026-03-06
> Rolle: REX
> Kontext: gjo-se.com – React / TypeScript / Tailwind CSS

---

## 1. Vollständige Komponentenliste

### Atoms (kleinste Einheit, kein eigener State)

| Komponente | Beschreibung | Status |
|---|---|---|
| `Button` | Primary / Secondary / Ghost / Destructive – alle Varianten | geplant |
| `Badge` | Status-Labels (z.B. "New", "Beta") | geplant |
| `Icon` | SVG-Wrapper (Lucide / Heroicons) | geplant |
| `Tag` | Tech-Labels (z.B. "React", "Python") | geplant |
| `Avatar` | Bild-Kreis mit Fallback-Initialen | geplant |
| `Spinner` | Lade-Indikator (Kreis-Animation) | geplant |
| `Text` | Typografie-Atom (Heading, Paragraph, Label, Caption) | **neu** |
| `Link` | Styled `<a>` / React Router `<Link>` Wrapper | **neu** |
| `Divider` | Trennlinie (horizontal / vertikal) | **neu** |
| `Skeleton` | Lade-Platzhalter (Rechteck / Kreis) | **neu** |
| `Input` | Text-Input (unkontrolliert, Base) | **neu** |
| `Textarea` | Mehrzeiliges Input-Atom | **neu** |
| `Checkbox` | Styled Checkbox | **neu** |
| `Tooltip` | Hover-Info-Overlay | **neu** |
| `Chip` | Kompakte interaktive Tags (z.B. Filter) | **neu** |

### Molecules (Kombination aus Atoms)

| Komponente | Beschreibung | Status |
|---|---|---|
| `ProjectCard` | Thumbnail + Titel + Tags + Link | geplant |
| `SkillCard` | Icon + Name + Level-Badge | geplant |
| `NavLink` | Router-Link mit Active-State | geplant |
| `ThemeToggle` | Dark/Light Switch Button | geplant |
| `SearchBar` | Input + Icon + Clear-Button | geplant |
| `FormField` | Label + Input + Fehlermeldung | **neu** |
| `Toast` | Kurze Feedback-Meldung (Erfolg / Fehler / Info) | **neu** |
| `Modal` | Dialog-Overlay mit Backdrop | **neu** |
| `Breadcrumb` | Seitenpfad-Navigation | **neu** |
| `SocialLink` | Icon + Link (GitHub, LinkedIn etc.) | **neu** |
| `TagGroup` | Mehrere `Tag`-Atoms als Gruppe | **neu** |
| `TimelineItem` | Einzelner Eintrag in einer Timeline | **neu** |
| `FilterChip` | `Chip` mit aktivem Toggle-State | **neu** |
| `AvatarWithName` | `Avatar` + Name + Rolle | **neu** |

### Organisms (eigenständige UI-Abschnitte mit eigenem State / Logik)

| Komponente | Beschreibung | Status |
|---|---|---|
| `Header` | Logo + Nav + ThemeToggle + Auth-Status | geplant |
| `Footer` | Copyright + Links + Social | geplant |
| `HeroSection` | Headline + Subline + CTA | geplant |
| `ProjectGrid` | Grid aus `ProjectCard`s + Filter | geplant |
| `SkillGrid` | Grid aus `SkillCard`s nach Kategorie | geplant |
| `Timeline` | Liste aus `TimelineItem`s (CV) | geplant |
| `MobileNav` | Slide-in Drawer-Navigation | **neu** |
| `AuthForm` | Login- oder Register-Formular | **neu** |
| `ContactSection` | Kontaktbereich mit CTA + Links | **neu** |
| `PageHeader` | Seiten-Titel + Untertitel + Breadcrumb | **neu** |
| `ErrorBoundary` | React Error Boundary mit Fallback-UI | **neu** |
| `ChatbotWidget` | Floating CTA + Slide-in Panel | **neu** (Phase 2i) |
| `CookieBanner` | DSGVO Cookie-Hinweis | **neu** |

### Templates (Layouts ohne Inhalt)

| Komponente | Beschreibung | Status |
|---|---|---|
| `DefaultLayout` | Header + Outlet + Footer | geplant |
| `AuthLayout` | Zentriertes Card-Layout (kein Header/Footer) | geplant |
| `ProjectDetailLayout` | Erweitertes Layout mit DiagramSlot | geplant |
| `DevLayout` | Minimales Layout für Showcase-Seiten (Dev only) | **neu** |

---

## 2. TYPO3 ContentElements → React Atomic Design Analogie

### Gemeinsamkeiten

| TYPO3 Konzept | React / Atomic Äquivalent | Erläuterung |
|---|---|---|
| **Content Element (CE)** | **Organism** | Beides sind eigenständige, wiederverwendbare UI-Blöcke mit definierter Struktur |
| **CE: Text** | `Text` Atom + `PageHeader` Organism | Reduzierbar auf kleinste Einheit, aber auch als Block nutzbar |
| **CE: Image** | `Avatar`, `DiagramSlot` | Medien-Inhaltsblöcke |
| **CE: Textpic** | `HeroSection` | Text + Bild kombiniert als benannte Einheit |
| **CE: HTML** | Freie JSX-Komposition | Rohes Template |
| **TypoScript / FlexForm** | `Props` Interface | Konfiguration des Elements von außen |
| **Page Template** | `Template` (Atomic Layer) | Definiert das Seiten-Gerüst ohne konkreten Inhalt |
| **Plugin** | `Organism` mit State / API | Eigenständige, datengetriebene Einheit |

### Unterschiede

| Aspekt | TYPO3 | React Atomic Design |
|---|---|---|
| **Datenhaltung** | Content in Datenbank (tt_content), per TypoScript gerendert | State in Komponente oder via Props / Context |
| **Komposition** | Redakteur wählt CE im Backend-UI aus | Entwickler komponiert JSX im Code |
| **Granularität** | CE ist meistens auf Organism-Ebene | Atomic Design unterscheidet 5 Ebenen (Atom → Page) |
| **Wiederverwendung** | CE per Referenz (z.B. „Inhalt aus Seite X") | Komponenten-Import + Props |
| **Zustand** | Kein React-State – CEs sind statisch gerendert | Atoms / Molecules können zustandslos oder -behaftet sein |

### Fazit

TYPO3 Content Elements entsprechen am ehesten **Organisms** in Atomic Design: Sie sind die kleinste
_eigenständig verwendbare und konfigurierbare_ Einheit auf einer Seite. Die feingranulare Unterteilung
in Atoms und Molecules existiert in TYPO3 nicht explizit – dort ist das „Atom" einfach Teil des
CE-Renderings (z.B. ein Button innerhalb eines CE:Textpic).

**Kurzformel:**
> TYPO3 CE ≈ React Organism – beides ist der „Baustein", den man auf eine Seite zieht.
> Atoms und Molecules sind die internen Bestandteile des CEs, die in TYPO3 nicht einzeln zugänglich sind.

---

## 3. Showcase-Seiten – Konzept

### Zweck

Die Showcase-Seiten dienen als internes Dev-Tool:
- Alle Komponenten einer Ebene auf einer Seite sichtbar
- Verschiedene Zustände (Loading, Error, Varianten) direkt vergleichbar
- Kein externes Tool notwendig (kein Storybook in Phase 2a)
- Basis für spätere Storybook-Migration in Phase 2j

### Struktur jeder Showcase-Seite

```
DevLayout
  ├── DevPageHeader (Titel + Beschreibung der Ebene)
  └── ComponentSection[]  (je Komponente ein Block)
        ├── Sektions-Titel (Komponentenname)
        ├── Kurzbeschreibung + Props-Tabelle
        └── ComponentPreview (heller + dunkler Background)
              └── Varianten der Komponente nebeneinander
```

### Dateipfade

```
src/
├── pages/
│   └── dev/
│       ├── AtomsShowcase.tsx
│       ├── MoleculesShowcase.tsx
│       └── OrganismsShowcase.tsx
└── components/
    └── templates/
        └── DevLayout/
            └── DevLayout.tsx
```

### Routing – Guard via `import.meta.env.DEV`

```typescript
// src/router.tsx
const devRoutes = import.meta.env.DEV
  ? [
      {
        element: <DevLayout />,
        children: [
          { path: '/dev/atoms',     element: <AtomsShowcase /> },
          { path: '/dev/molecules', element: <MoleculesShowcase /> },
          { path: '/dev/organisms', element: <OrganismsShowcase /> },
        ],
      },
    ]
  : []

export const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      { path: '/',            element: <HomePage /> },
      { path: '/portfolio',   element: <PortfolioPage /> },
      { path: '/tech-stack',  element: <TechStackPage /> },
      { path: '/about',       element: <AboutPage /> },
      { path: '/impressum',   element: <ImpressumPage /> },
      { path: '/datenschutz', element: <DatenschutzPage /> },
      { path: '*',            element: <NotFoundPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login',    element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  ...devRoutes,
])
```

**Warum `import.meta.env.DEV`?**
- In `npm run dev` → `DEV = true` → Routes registriert
- In `npm run build` → `DEV = false` → Routes nicht registriert, Vite-Tree-Shaking entfernt den Code vollständig
- **Kein Prod-Leak** – die Showcase-Seiten sind im Production-Build nicht vorhanden
- Alternativ: Feature-Flag `VITE_SHOW_DEV_TOOLS=true` in `.env.local` für mehr Kontrolle (z.B. auch in Staging sichtbar)

---

## 4. Vollständige Sitemap inkl. Dev-Routen

| Seite | Route | Layout | Auth | Env |
|---|---|---|---|---|
| Home | `/` | DefaultLayout | public | all |
| Portfolio | `/portfolio` | DefaultLayout | public | all |
| Tech Stack | `/tech-stack` | DefaultLayout | public | all |
| About / CV | `/about` | DefaultLayout | public | all |
| Impressum | `/impressum` | DefaultLayout | public | all |
| Datenschutz | `/datenschutz` | DefaultLayout | public | all |
| Login | `/login` | AuthLayout | public | all |
| Register | `/register` | AuthLayout | public | all |
| Dashboard | `/me` | DefaultLayout | **protected** | all |
| 404 | `*` | DefaultLayout | public | all |
| **Atoms Showcase** | `/dev/atoms` | DevLayout | public | **dev only** |
| **Molecules Showcase** | `/dev/molecules` | DevLayout | public | **dev only** |
| **Organisms Showcase** | `/dev/organisms` | DevLayout | public | **dev only** |

---

## 5. Offene Entscheidungen

| # | Frage | Empfehlung |
|---|---|---|
| 1 | Showcase Guard | `import.meta.env.DEV` – zero-config, kein Prod-Leak |
| 2 | Showcase Umfang in 2a | Funktionierende Basis-Implementierungen (kein `pass`/TODO) |
| 3 | `react-router-dom` Version | v6 (stable, bereits im Einsatz) |
| 4 | Icon-Bibliothek | Lucide React (`lucide-react`) – lightweight, TypeScript-native |
