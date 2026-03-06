import { Outlet } from 'react-router-dom'

/**
 * ProtectedRoute – Platzhalter für Auth-Guard.
 * Wird in Phase 2h mit echtem Auth-Context ausgebaut.
 */
export default function ProtectedRoute() {
  // TODO #67 Phase 2h: Auth-Check hier einbauen (redirect to /login wenn nicht eingeloggt)
  return <Outlet />
}
