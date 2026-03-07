import SEOMeta from '../components/atoms/SEOMeta'
import AuthForm from '../components/organisms/AuthForm'

/**
 * RegisterPage – Registrierungsseite mit AuthForm.
 * Wird über AuthLayout im Router eingebunden.
 * Nach Erfolg: Erfolgsmeldung (kein auto-login – Double Opt-In in Phase 2i).
 */
export default function RegisterPage() {
  return (
    <>
      <SEOMeta title="Registrieren" description="Neuen Account anlegen bei gjo-se.com." />
      <AuthForm mode="register" />
    </>
  )
}
