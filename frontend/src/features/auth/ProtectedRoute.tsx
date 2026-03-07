import { Navigate, Outlet } from 'react-router-dom'
import Spinner from '../../components/atoms/Spinner'
import { useAuth } from './useAuth'

/**
 * ProtectedRoute – Route-Guard für authentifizierte Bereiche.
 *
 * - `isLoading=true` → Spinner zentriert anzeigen
 * - `user !== null` → `<Outlet />` rendern
 * - `user === null` → Redirect zu `/login`
 */
export function ProtectedRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (user === null) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
