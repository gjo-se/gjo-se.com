import { Outlet } from 'react-router-dom'

/**
 * DefaultLayout – Haupt-Seitenlayout.
 * Enthält Header-Platzhalter, Hauptinhalt (Outlet) und Footer-Platzhalter.
 * Wird in Phase 2b mit echten Header/Footer-Organisms befüllt.
 *
 * @example
 * // In router.tsx:
 * { element: <DefaultLayout />, children: [...] }
 */
export default function DefaultLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <p className="text-sm text-gray-400">Header – wird in Phase 2b implementiert</p>
      </header>
      <main className="flex-1 px-6 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 bg-white px-6 py-4">
        <p className="text-sm text-gray-400">Footer – wird in Phase 2b implementiert</p>
      </footer>
    </div>
  )
}
