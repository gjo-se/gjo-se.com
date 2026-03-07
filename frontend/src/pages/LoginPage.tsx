import { useNavigate } from 'react-router-dom'
import SEOMeta from '../components/atoms/SEOMeta'
import AuthForm from '../components/organisms/AuthForm'

/**
 * LoginPage – Anmeldeseite mit AuthForm.
 * Wird über AuthLayout im Router eingebunden.
 * Nach erfolgreichem Login: Redirect zu /me.
 */
export default function LoginPage() {
  const navigate = useNavigate()

  return (
    <>
      <SEOMeta title="Anmelden" description="Melde dich bei gjo-se.com an." />
      <AuthForm mode="login" onSuccess={() => navigate('/me')} />
    </>
  )
}
