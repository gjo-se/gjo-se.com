import { useParams, Navigate } from 'react-router-dom'
import PageHeader from '../components/organisms/PageHeader'
import ProjectDetailLayout from '../components/templates/ProjectDetailLayout'
import type { ProjectDetailData } from '../components/templates/ProjectDetailLayout'

// ---------------------------------------------------------------------------
// Mock-Daten – wird in einer späteren Phase durch API-Calls ersetzt
// ---------------------------------------------------------------------------
const PROJECTS: Record<string, ProjectDetailData> = {
  'gjo-se': {
    title: 'gjo-se.com',
    tags: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'Docker'],
    githubUrl: 'https://github.com/gjo-se/gjo-se.com',
    context:
      'Persönliche Portfolio-Website als Fullstack-Projekt – gebaut um moderne Web-Technologien in einem realen Produktionskontext zu demonstrieren. Das Projekt dient gleichzeitig als lebendiges Showcase für zukünftige Auftraggeber.',
    problem:
      'Eine statische HTML-Seite reicht nicht mehr aus um Interaktivität, Auth und dynamische Inhalte zu unterstützen. Gesucht war ein skalierbarer Ansatz der Frontend und Backend sauber trennt und vollständig containerisiert ist.',
    solution:
      'React (TypeScript) als SPA-Frontend, FastAPI als REST-Backend, PostgreSQL als Datenbank – alles containerisiert mit Docker Compose. CI/CD via GitHub Actions, pre-commit Hooks für Code-Qualität.',
    diagramCaption: 'Fullstack-Architektur: React → FastAPI → PostgreSQL',
    codeExample: {
      language: 'typescript',
      filename: 'src/router.tsx',
      code: `import { createBrowserRouter } from 'react-router-dom'
import DefaultLayout from './components/templates/DefaultLayout'
import HomePage from './pages/HomePage'
import ProjectDetailPage from './pages/ProjectDetailPage'

export const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/portfolio/:slug', element: <ProjectDetailPage /> },
    ],
  },
])`,
    },
    results:
      'Vollständig containerisiertes Fullstack-Projekt mit CI/CD-Pipeline, automatischen Tests und reproduzierbaren Docker-Builds. Läuft lokal identisch wie in der Produktion.',
    learnings:
      'Docker Layer-Caching ist sensibel gegenüber package-lock.json-Änderungen. pre-commit Hooks müssen mit tsc -p tsconfig.app.json arbeiten um wirklich alle Fehler zu fangen.',
    relatedProjects: [
      { title: 'Projekt B', description: 'E-Commerce Plattform', tags: ['Vue', 'Python'], href: '/portfolio/projekt-b' },
      { title: 'Projekt C', description: 'Microservice-Architektur', tags: ['Docker', 'GitHub Actions'], href: '/portfolio/projekt-c' },
      { title: 'Projekt D', description: 'Mobile-first Web-App', tags: ['React', 'PWA'], href: '/portfolio/projekt-d' },
    ],
  },

  'projekt-b': {
    title: 'Projekt B',
    tags: ['Vue', 'Python', 'PostgreSQL', 'REST'],
    githubUrl: 'https://github.com/gjo-se/projekt-b',
    context:
      'E-Commerce Plattform für einen mittelständischen Einzelhändler – Anforderung war eine skalierbare Lösung die sowohl B2C als auch B2B-Kunden bedient.',
    problem:
      'Das bestehende System war ein monolithisches PHP-Konstrukt das bei >100 gleichzeitigen Nutzern in die Knie ging. Migration auf modernes Stack nötig ohne Betriebsunterbrechung.',
    solution:
      'Backend auf Python/FastAPI migriert, Vue.js Frontend als SPA. REST API mit klarer Versionierung. PostgreSQL als Hauptdatenbank mit Read-Replicas für Reports.',
    codeExample: {
      language: 'python',
      filename: 'app/api/v1/products.py',
      code: `from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_session
from app.schemas.product import ProductResponse, ProductList

router = APIRouter(prefix="/products", tags=["products"])

@router.get("/", response_model=ProductList)
async def list_products(
    session: AsyncSession = Depends(get_session),
    skip: int = 0,
    limit: int = 20,
) -> ProductList:
    """Gibt eine paginierte Produktliste zurück."""
    products = await product_service.get_all(session, skip=skip, limit=limit)
    return ProductList(items=products, total=len(products))`,
    },
    results:
      'Response-Zeit von durchschnittlich 2.1s auf 180ms reduziert. System skaliert jetzt problemlos auf 1.000 gleichzeitige Nutzer.',
    learnings:
      'Read-Replicas für PostgreSQL lösen 80% der Performance-Probleme. Vue 3 Composition API macht große Codebases deutlich wartbarer als Options API.',
    relatedProjects: [
      { title: 'gjo-se.com', description: 'Portfolio Website', tags: ['React', 'FastAPI'], href: '/portfolio/gjo-se' },
      { title: 'Projekt E', description: 'Developer Tooling', tags: ['Python', 'FastAPI'], href: '/portfolio/projekt-e' },
      { title: 'Projekt F', description: 'Daten-Dashboard', tags: ['React', 'TypeScript'], href: '/portfolio/projekt-f' },
    ],
  },

  'projekt-c': {
    title: 'Projekt C',
    tags: ['Docker', 'GitHub Actions', 'pytest', 'CI/CD'],
    githubUrl: 'https://github.com/gjo-se/projekt-c',
    context:
      'Microservice-Architektur für eine interne Plattform – 6 Services die unabhängig deployed werden können. Gefordert war eine vollautomatisierte CI/CD-Pipeline mit Zero-Downtime-Deployment.',
    problem:
      'Manuelles Deployment war fehleranfällig und dauerte 45 Minuten. Kein automatisiertes Testing, keine Rollback-Strategie. Bei einem fehlerhaften Deploy war die gesamte Plattform betroffen.',
    solution:
      'GitHub Actions Pipeline mit parallelisierten Tests, Docker-Layer-Caching und automatischem Rollback bei Healthcheck-Fehler. Jeder Service hat eigene Test-Suite mit pytest.',
    codeExample: {
      language: 'yaml',
      filename: '.github/workflows/ci.yml',
      code: `name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: testdb
          POSTGRES_USER: testuser
          POSTGRES_PASSWORD: testpass
        options: >-
          --health-cmd pg_isready
          --health-interval 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install uv && uv sync
      - run: uv run pytest --tb=short -q`,
    },
    results:
      'Deployment-Zeit von 45 Minuten auf 8 Minuten reduziert. Zero-Downtime durch Blue/Green-Deployment. Automatisches Rollback verhinderte 3 kritische Produktions-Incidents.',
    learnings:
      'GitHub Actions Matrix-Builds sparen enorm Zeit. Docker Layer-Caching ist entscheidend für schnelle CI-Zeiten. Healthchecks müssen auch im Staging getestet werden.',
    relatedProjects: [
      { title: 'gjo-se.com', description: 'Portfolio Website', tags: ['React', 'FastAPI'], href: '/portfolio/gjo-se' },
      { title: 'Projekt B', description: 'E-Commerce Plattform', tags: ['Vue', 'Python'], href: '/portfolio/projekt-b' },
      { title: 'Projekt D', description: 'Mobile-first Web-App', tags: ['React', 'PWA'], href: '/portfolio/projekt-d' },
    ],
  },

  'projekt-d': {
    title: 'Projekt D',
    tags: ['React', 'PWA', 'TypeScript', 'IndexedDB'],
    githubUrl: 'https://github.com/gjo-se/projekt-d',
    context:
      'Mobile-first Web-App für Außendienstmitarbeiter die auch ohne Internetverbindung arbeiten müssen. Push-Notifications für neue Aufträge, Offline-Datensynchronisation bei Wiederverbindung.',
    problem:
      'Native Apps für iOS und Android zu entwickeln und zu warten war zu kostspielig. Eine PWA sollte die gleiche User Experience bieten bei einem Bruchteil der Entwicklungskosten.',
    solution:
      'React PWA mit Service Worker für Offline-Caching, IndexedDB für lokale Datenhaltung, Background Sync API für verzögerte Synchronisation und Web Push API für Benachrichtigungen.',
    codeExample: {
      language: 'typescript',
      filename: 'src/hooks/useOfflineSync.ts',
      code: `import { useEffect, useState } from 'react'
import { openDB } from 'idb'

interface SyncQueueItem {
  id: string
  endpoint: string
  payload: unknown
  timestamp: number
}

export function useOfflineSync() {
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    async function syncPendingRequests() {
      const db = await openDB('sync-queue', 1)
      const pending = await db.getAll('requests')
      setPendingCount(pending.length)

      if (navigator.onLine && pending.length > 0) {
        for (const item of pending as SyncQueueItem[]) {
          await fetch(item.endpoint, {
            method: 'POST',
            body: JSON.stringify(item.payload),
          })
          await db.delete('requests', item.id)
        }
      }
    }

    window.addEventListener('online', syncPendingRequests)
    return () => window.removeEventListener('online', syncPendingRequests)
  }, [])

  return { pendingCount }
}`,
    },
    results:
      'App funktioniert vollständig offline. Push-Notification-Opt-In-Rate von 78%. Außendienstmitarbeiter können 4h ohne Verbindung arbeiten, alle Daten werden nahtlos synchronisiert.',
    learnings:
      'IndexedDB-Abstraktion via `idb` ist unerlässlich – direktes IndexedDB-API ist zu verbose. Background Sync API ist noch nicht in allen Browsern verfügbar – Fallback nötig.',
    relatedProjects: [
      { title: 'gjo-se.com', description: 'Portfolio Website', tags: ['React', 'FastAPI'], href: '/portfolio/gjo-se' },
      { title: 'Projekt F', description: 'Daten-Dashboard', tags: ['React', 'TypeScript'], href: '/portfolio/projekt-f' },
      { title: 'Projekt E', description: 'Developer Tooling', tags: ['Python', 'FastAPI'], href: '/portfolio/projekt-e' },
    ],
  },

  'projekt-e': {
    title: 'Projekt E',
    tags: ['Python', 'FastAPI', 'React', 'CLI'],
    githubUrl: 'https://github.com/gjo-se/projekt-e',
    context:
      'Interne Tooling-Plattform für ein 12-köpfiges Entwickler-Team – Automatisierung von wiederkehrenden Aufgaben: Deployment-Status, Log-Analyse, Feature-Flag-Management.',
    problem:
      'Jedes Team-Mitglied hatte seine eigenen Shell-Skripte. Keine zentrale Übersicht über Deployment-Status, Logs mussten manuell in mehreren Tools gesucht werden.',
    solution:
      'Einheitliches CLI-Tool in Python (Click + Rich) mit Web-Dashboard in React. FastAPI Backend als API-Gateway zu den verschiedenen Infrastruktur-Services.',
    codeExample: {
      language: 'python',
      filename: 'cli/commands/deploy.py',
      code: `import click
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn
from app.services.deployment import DeploymentService

console = Console()

@click.command()
@click.argument("service")
@click.option("--env", default="staging", help="Ziel-Umgebung")
@click.option("--dry-run", is_flag=True, help="Nur simulieren")
def deploy(service: str, env: str, dry_run: bool) -> None:
    """Deployed einen Service in die angegebene Umgebung."""
    if dry_run:
        console.print(f"[yellow]DRY RUN:[/] {service} → {env}")
        return

    with Progress(SpinnerColumn(), TextColumn("{task.description}")) as progress:
        task = progress.add_task(f"Deploying {service}...", total=None)
        result = DeploymentService().deploy(service=service, environment=env)
        progress.update(task, completed=True)

    console.print(f"[green]✓[/] {service} deployed to {env} (v{result.version})")`,
    },
    results:
      'Team spart durchschnittlich 2h/Woche. Deployment-Fehler durch fehlende Koordination um 60% reduziert. Onboarding neuer Entwickler dauert jetzt 1 Tag statt 3.',
    learnings:
      'Rich (Python) macht CLI-Tools erheblich nutzerfreundlicher. Ein einheitliches Tooling-Interface erhöht die Team-Produktivität mehr als einzelne Optimierungen.',
    relatedProjects: [
      { title: 'Projekt B', description: 'E-Commerce Plattform', tags: ['Vue', 'Python'], href: '/portfolio/projekt-b' },
      { title: 'Projekt C', description: 'Microservice CI/CD', tags: ['Docker', 'GitHub Actions'], href: '/portfolio/projekt-c' },
      { title: 'gjo-se.com', description: 'Portfolio Website', tags: ['React', 'FastAPI'], href: '/portfolio/gjo-se' },
    ],
  },

  'projekt-f': {
    title: 'Projekt F',
    tags: ['React', 'TypeScript', 'PostgreSQL', 'Recharts'],
    githubUrl: 'https://github.com/gjo-se/projekt-f',
    demoUrl: 'https://demo.gjo-se.com/projekt-f',
    context:
      'Daten-Dashboard für einen E-Commerce-Kunden – Echtzeit-Übersicht über Umsatz, Conversion-Rate und Warenkorb-Abbrüche. Daten aus 3 verschiedenen Quellen aggregiert.',
    problem:
      'Reporting lief bisher über wöchentliche Excel-Exports. Keine Echtzeit-Sicht, keine Drill-Down-Möglichkeit. Business-Entscheidungen wurden auf Basis von 7 Tage alten Daten getroffen.',
    solution:
      'React-Dashboard mit Recharts für Visualisierung, WebSocket-Verbindung für Echtzeit-Updates, PostgreSQL mit materialized Views für aggregierte KPIs.',
    codeExample: {
      language: 'typescript',
      filename: 'src/hooks/useRealtimeKPIs.ts',
      code: `import { useEffect, useState, useRef } from 'react'

interface KPIData {
  revenue: number
  orders: number
  conversionRate: number
  timestamp: string
}

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8000/ws/kpis'

export function useRealtimeKPIs() {
  const [kpis, setKpis] = useState<KPIData | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    wsRef.current = new WebSocket(WS_URL)

    wsRef.current.onopen = () => setIsConnected(true)
    wsRef.current.onclose = () => setIsConnected(false)
    wsRef.current.onmessage = (event: MessageEvent<string>) => {
      const data = JSON.parse(event.data) as KPIData
      setKpis(data)
    }

    return () => wsRef.current?.close()
  }, [])

  return { kpis, isConnected }
}`,
    },
    results:
      'Entscheidungslatenz von 7 Tagen auf Echtzeit reduziert. Conversion-Rate um 12% verbessert durch schnellere Reaktion auf Warenkorb-Abbruch-Muster.',
    learnings:
      'PostgreSQL materialized Views mit REFRESH CONCURRENTLY sind entscheidend für Dashboard-Performance. WebSocket-Reconnect-Logik muss von Anfang an eingeplant werden.',
    relatedProjects: [
      { title: 'Projekt B', description: 'E-Commerce Plattform', tags: ['Vue', 'Python'], href: '/portfolio/projekt-b' },
      { title: 'Projekt D', description: 'Mobile-first Web-App', tags: ['React', 'PWA'], href: '/portfolio/projekt-d' },
      { title: 'gjo-se.com', description: 'Portfolio Website', tags: ['React', 'FastAPI'], href: '/portfolio/gjo-se' },
    ],
  },
}

/**
 * ProjectDetailPage – Generische Detailseite für Projekte.
 * Liest Slug aus URL-Params, lädt Mock-Daten und rendert ProjectDetailLayout.
 * Unbekannte Slugs werden auf NotFoundPage weitergeleitet.
 */
export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  const project = slug ? PROJECTS[slug] : undefined

  if (!project) {
    return <Navigate to="/404" replace />
  }

  return (
    <div>
      <PageHeader
        title={project.title}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Portfolio', to: '/portfolio' },
          { label: project.title },
        ]}
        className="mb-10"
      />
      <ProjectDetailLayout data={project} />
    </div>
  )
}
