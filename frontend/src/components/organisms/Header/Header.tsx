import { Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import NavLink from '../../molecules/NavLink'
import ThemeToggle from '../../molecules/ThemeToggle'
import Button from '../../atoms/Button'
import Text from '../../atoms/Text'
import { cn } from '../../../lib/utils'
import { useAuth } from '../../../features/auth'

export interface HeaderNavItem {
  label: string
  to: string
}

export interface HeaderProps {
  /** Logo-Text oder URL */
  logo?: string
  /** Navigationseinträge */
  navItems?: HeaderNavItem[]
  /** Dark-Mode aktiv */
  isDark?: boolean
  /** Callback für Theme-Toggle */
  onThemeToggle?: () => void
  /** Callback für Mobile-Nav öffnen */
  onMenuOpen?: () => void
  /** Zusätzliche CSS-Klassen */
  className?: string
}

/**
 * Header – Haupt-Navigation mit Logo, NavLinks, ThemeToggle und Auth-Status.
 *
 * @example
 * <Header logo="gjo-se.com" navItems={[{ label: 'Portfolio', to: '/portfolio' }]} />
 */
export default function Header({
  logo = 'gjo-se.com',
  navItems = [],
  isDark = false,
  onThemeToggle,
  onMenuOpen,
  className,
}: HeaderProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-sm',
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Text as="span" variant="subheading" weight="bold" className="text-gray-900">
          {logo}
        </Text>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} label={item.label} />
          ))}
        </nav>

        {/* Rechte Seite */}
        <div className="flex items-center gap-2">
          {onThemeToggle && (
            <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
          )}

          {/* Auth-Status */}
          {user !== null ? (
            <>
              <NavLink to="/me" label="Dashboard" />
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Abmelden
              </Button>
            </>
          ) : (
            <NavLink to="/login" label="Anmelden" />
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuOpen}
            aria-label="Menü öffnen"
            className="md:hidden"
          >
            <Menu size={20} aria-hidden />
          </Button>
        </div>
      </div>
    </header>
  )
}
