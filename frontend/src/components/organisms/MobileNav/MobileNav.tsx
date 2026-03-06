import { X } from 'lucide-react'
import { NavLink as RouterNavLink } from 'react-router-dom'
import Button from '../../atoms/Button'
import { cn } from '../../../lib/utils'

export interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
  navItems: { label: string; to: string }[]
  className?: string
}

/** MobileNav – Slide-in Drawer-Navigation für mobile Ansicht. Stub – wird in Phase 2b ausgebaut. */
export default function MobileNav({ isOpen, onClose, navItems, className }: MobileNavProps) {
  if (!isOpen) return null
  return (
    <div className={cn('fixed inset-0 z-50', className)}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <span className="font-semibold text-gray-900">Menü</span>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Menü schließen" className="h-8 w-8 p-0">
            <X size={16} aria-hidden />
          </Button>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map(item => (
            <RouterNavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100',
                )
              }
            >
              {item.label}
            </RouterNavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
