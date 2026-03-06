import { NavLink as RouterNavLink } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../../lib/utils'

export interface NavLinkProps {
  /** Zielpfad (React Router) */
  to: string
  /** Anzeigetext */
  label: string
  /** Optionales Icon links */
  icon?: LucideIcon
  /** Zusätzliche CSS-Klassen */
  className?: string
}

/**
 * NavLink – React Router Link mit Active-State-Styling.
 *
 * @example
 * <NavLink to="/portfolio" label="Portfolio" />
 * <NavLink to="/about" label="About" icon={User} />
 */
export default function NavLink({ to, label, icon: IconComponent, className }: NavLinkProps) {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
          isActive
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
          className,
        )
      }
    >
      {IconComponent && <IconComponent size={16} aria-hidden />}
      {label}
    </RouterNavLink>
  )
}
