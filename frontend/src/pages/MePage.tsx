import SEOMeta from '../components/atoms/SEOMeta'

/**
 * MePage – Platzhalter-Seite.
 * Wird in Phase 2c mit Inhalt befüllt.
 */
export default function MePage() {
  return (
    <div className="py-8">
      <SEOMeta title="Dashboard" description="Dein persönlicher Bereich auf gjo-se.com." />
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      <p className="mt-2 text-sm text-gray-400">Inhalt folgt in Phase 2c.</p>
    </div>
  )
}
