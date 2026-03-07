import { useNavigate } from 'react-router-dom'
import SEOMeta from '../components/atoms/SEOMeta'
import { useAuth } from '../features/auth'
import Button from '../components/atoms/Button'
import Text from '../components/atoms/Text'

/**
 * MePage – Persönlicher Dashboard-Bereich.
 * Durch ProtectedRoute geschützt – nur für eingeloggte User erreichbar.
 */
export default function MePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div className="py-8">
      <SEOMeta title="Dashboard" description="Dein persönlicher Bereich auf gjo-se.com." />
      <div className="mx-auto max-w-xl">
        <Text as="h1" variant="heading" weight="bold" className="mb-6">
          Willkommen, {user?.name}
        </Text>
        <dl className="mb-8 space-y-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex gap-2">
            <dt className="w-24 font-medium text-gray-500">Name</dt>
            <dd className="text-gray-900">{user?.name}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 font-medium text-gray-500">E-Mail</dt>
            <dd className="text-gray-900">{user?.email}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-24 font-medium text-gray-500">Rolle</dt>
            <dd className="text-gray-900">{user?.role}</dd>
          </div>
        </dl>
        <Button variant="destructive" onClick={handleLogout}>
          Abmelden
        </Button>
      </div>
    </div>
  )
}
