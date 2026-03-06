import { NavLink, Outlet } from 'react-router-dom'

const SHOWCASE_LINKS = [
  { to: '/dev/atoms', label: '⚛️ Atoms' },
  { to: '/dev/molecules', label: '🧬 Molecules' },
  { to: '/dev/organisms', label: '🦠 Organisms' },
] as const

/**
 * DevLayout – Minimales Layout für Showcase-Seiten (nur dev).
 * Zeigt eine horizontale Navigationsleiste mit Links zu allen Showcase-Seiten.
 * Nur bei import.meta.env.DEV sichtbar – in Production nicht enthalten.
 *
 * @example
 * // In router.tsx (nur wenn import.meta.env.DEV):
 * { element: <DevLayout />, children: [{ path: '/dev/atoms', element: <AtomsShowcase /> }] }
 */
export default function DevLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <nav className="border-b border-yellow-300 bg-yellow-50 px-6 py-3">
        <div className="flex items-center gap-6">
          <span className="text-xs font-semibold uppercase tracking-widest text-yellow-700">
            🛠 Dev Showcase
          </span>
          <div className="flex gap-4">
            {SHOWCASE_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  [
                    'rounded px-3 py-1 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-yellow-300 text-yellow-900'
                      : 'text-yellow-700 hover:bg-yellow-100',
                  ].join(' ')
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}
