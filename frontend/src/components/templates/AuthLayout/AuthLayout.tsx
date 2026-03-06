import { Outlet } from 'react-router-dom'

/**
 * AuthLayout – Zentriertes Card-Layout für Login/Register.
 * Kein Header/Footer – fokussiertes Auth-Erlebnis.
 *
 * @example
 * // In router.tsx:
 * { element: <AuthLayout />, children: [{ path: '/login', element: <LoginPage /> }] }
 */
export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <Outlet />
      </div>
    </div>
  )
}
