/**
 * Public API des auth-Feature-Moduls.
 *
 * Alle Imports von außen laufen über diesen Einstiegspunkt –
 * nie direkt aus den internen Dateien.
 *
 * @example
 * import { AuthProvider, useAuth, ProtectedRoute } from './features/auth'
 */
export { AuthProvider } from './AuthContext'
export { useAuth } from './useAuth'
export { ProtectedRoute } from './ProtectedRoute'
export type { UserOut, LoginResponse } from './api'
