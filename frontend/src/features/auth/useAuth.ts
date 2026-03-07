import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import type { UserOut } from './api'

/** Wert des Auth-Contexts. */
interface AuthContextValue {
  user: UserOut | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, name: string, password: string) => Promise<void>
}

/**
 * Gibt den aktuellen Auth-Context zurück.
 *
 * @throws {Error} wenn außerhalb von `AuthProvider` verwendet.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
