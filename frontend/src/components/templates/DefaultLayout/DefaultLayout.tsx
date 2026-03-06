import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../organisms/Header'
import Footer from '../../organisms/Footer'

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Tech Stack', to: '/tech-stack' },
  { label: 'About', to: '/about' },
]

const FOOTER_LINKS = [
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
]

const SOCIAL_LINKS = [
  { platform: 'github' as const, href: 'https://github.com/gjo-se' },
  { platform: 'linkedin' as const, href: 'https://linkedin.com/in/gregory-erdmann' },
]

/**
 * DefaultLayout – Haupt-Seitenlayout mit Header, Outlet und Footer.
 * Wird in Phase 2b weiter ausgebaut (MobileNav, Auth-Status, Dark Mode).
 *
 * @example
 * { element: <DefaultLayout />, children: [...] }
 */
export default function DefaultLayout() {
  const [isDark, setIsDark] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        navItems={NAV_ITEMS}
        isDark={isDark}
        onThemeToggle={() => setIsDark((d) => !d)}
      />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Outlet />
        </div>
      </main>
      <Footer links={FOOTER_LINKS} socialLinks={SOCIAL_LINKS} />
    </div>
  )
}
