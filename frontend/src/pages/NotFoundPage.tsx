import { useNavigate } from 'react-router-dom'
import Button from '../components/atoms/Button'
import Text from '../components/atoms/Text'
import SEOMeta from '../components/atoms/SEOMeta'

/**
 * NotFoundPage – 404-Seite mit sprechender Fehlermeldung und Link zur Startseite.
 */
export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <SEOMeta title="Seite nicht gefunden" description="Diese Seite existiert leider nicht." />
      <Text as="h1" variant="heading" weight="bold" className="text-7xl text-gray-200">
        404
      </Text>
      <Text as="h2" variant="subheading" weight="semibold" className="text-gray-900">
        Seite nicht gefunden
      </Text>
      <Text variant="body" className="max-w-md text-gray-500">
        Die gesuchte Seite existiert nicht oder wurde verschoben.
        Bitte prüfe die URL oder kehre zur Startseite zurück.
      </Text>
      <Button
        variant="primary"
        size="md"
        onClick={() => navigate('/')}
      >
        → Zurück zur Startseite
      </Button>
    </div>
  )
}
