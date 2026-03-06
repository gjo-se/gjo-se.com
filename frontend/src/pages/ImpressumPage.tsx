import PageHeader from '../components/organisms/PageHeader'
import Text from '../components/atoms/Text'

/**
 * ImpressumPage – Rechtliche Angaben (Platzhalter).
 */
export default function ImpressumPage() {
  return (
    <div>
      <PageHeader
        title="Impressum"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Impressum' }]}
      />
      <div className="prose max-w-2xl">
        <Text as="h2" variant="subheading" weight="semibold" className="mb-3 text-gray-900">
          Angaben gemäß § 5 TMG
        </Text>
        <Text variant="body" className="mb-4 text-gray-600">
          Gregory Erdmann<br />
          Musterstraße 1<br />
          12345 Musterstadt
        </Text>
        <Text as="h2" variant="subheading" weight="semibold" className="mb-3 text-gray-900">
          Kontakt
        </Text>
        <Text variant="body" className="mb-4 text-gray-600">
          E-Mail: hi@gjo-se.com
        </Text>
        <Text as="h2" variant="subheading" weight="semibold" className="mb-3 text-gray-900">
          Haftungsausschluss
        </Text>
        <Text variant="body" className="text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Text>
      </div>
    </div>
  )
}
