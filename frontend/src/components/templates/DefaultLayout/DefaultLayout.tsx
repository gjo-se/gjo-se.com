import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../organisms/Header'
import Footer from '../../organisms/Footer'
import MobileNav from '../../organisms/MobileNav'

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
 * DefaultLayout – Haupt-Seitenlayout mit Header, MobileNav, Outlet und Footer.
 * Dark Mode setzt `dark`-Klasse auf <html> für Tailwind dark:-Varianten.
 *
 * @example
 * { element: <DefaultLayout />, children: [...] }
 */
export default function DefaultLayout() {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem('theme') === 'dark'
      || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches),
  )
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // dark-Klasse auf <html> + localStorage synchronisieren
  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        navItems={NAV_ITEMS}
        isDark={isDark}
        onThemeToggle={() => setIsDark((d) => !d)}
        onMenuOpen={() => setMobileNavOpen(true)}
      />
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        navItems={NAV_ITEMS}
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
