import PageHeader from '../components/organisms/PageHeader'
import Text from '../components/atoms/Text'
import Divider from '../components/atoms/Divider'
import SEOMeta from '../components/atoms/SEOMeta'

/**
 * DatenschutzPage – Datenschutzerklärung (Platzhalter).
 */
export default function DatenschutzPage() {
  return (
    <div>
      <SEOMeta
        title="Datenschutz"
        description="Datenschutzerklärung gemäß DSGVO."
      />
      <PageHeader
        title="Datenschutzerklärung"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Datenschutz' }]}
      />
      <div className="max-w-2xl">
        <Text as="h2" variant="subheading" weight="semibold" className="mb-3 text-gray-900">
          1. Datenschutz auf einen Blick
        </Text>
        <Text variant="body" className="mb-6 text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris.
        </Text>

        <Divider className="my-6" />

        <Text as="h2" variant="subheading" weight="semibold" className="mb-3 text-gray-900">
          2. Verantwortlicher
        </Text>
        <Text variant="body" className="mb-6 text-gray-600">
          Gregory Erdmann, Musterstraße 1, 12345 Musterstadt<br />
          E-Mail: hi@gjo-se.com
        </Text>

        <Divider className="my-6" />

        <Text as="h2" variant="subheading" weight="semibold" className="mb-3 text-gray-900">
          3. Erhebung und Speicherung personenbezogener Daten
        </Text>
        <Text variant="body" className="text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          Excepteur sint occaecat cupidatat non proident.
        </Text>
      </div>
    </div>
  )
}
