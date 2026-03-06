import { Outlet } from 'react-router-dom'

/**
 * ProjectDetailLayout – Erweitertes Layout für Projekt-Detailseiten.
 * Erbt die DefaultLayout-Struktur und bietet einen optionalen DiagramSlot.
 * Wird in Phase 2f vollständig ausgebaut.
 *
 * @example
 * { element: <ProjectDetailLayout />, children: [{ path: '/portfolio/:id', element: <ProjectDetailPage /> }] }
 */
export default function ProjectDetailLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <p className="text-sm text-gray-400">Header – wird in Phase 2b implementiert</p>
      </header>
      <main className="flex-1 px-6 py-8">
        <Outlet />
        <aside className="mt-8 rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-400">
          DiagramSlot – wird in Phase 2f implementiert
        </aside>
      </main>
      <footer className="border-t border-gray-200 bg-white px-6 py-4">
        <p className="text-sm text-gray-400">Footer – wird in Phase 2b implementiert</p>
      </footer>
    </div>
  )
}
