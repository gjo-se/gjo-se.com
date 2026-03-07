import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import FormField from '../../molecules/FormField'
import Text from '../../atoms/Text'
import { useAuth } from '../../../features/auth'

/** Modus des Formulars: Login oder Registrierung. */
export type AuthFormMode = 'login' | 'register'

export interface AuthFormProps {
  /** Formular-Modus */
  mode: AuthFormMode
  /** Wird nach erfolgreichem Login/Register aufgerufen. */
  onSuccess?: () => void
}

/**
 * AuthForm – Login- oder Registrierungsformular.
 *
 * Nutzt `useAuth()` aus `features/auth` für State-Management.
 * Fehlermeldungen sind generisch – kein Durchreichen von Backend-Rohfehlern.
 *
 * @example
 * <AuthForm mode="login" onSuccess={() => navigate('/me')} />
 */
export default function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const { login, register } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    // Client-seitige Validierung nur im Register-Modus
    if (mode === 'register') {
      if (password.length < 8) {
        setError('Das Passwort muss mindestens 8 Zeichen lang sein.')
        return
      }
      if (password !== passwordConfirm) {
        setError('Die Passwörter stimmen nicht überein.')
        return
      }
    }

    setIsLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
        onSuccess?.()
      } else {
        await register(email, name, password)
        setSuccessMessage(
          'Registrierung erfolgreich. Bitte prüfe deine E-Mails zur Bestätigung.',
        )
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (mode === 'login') {
          if (status === 403) {
            setError('Bitte bestätige zuerst deine E-Mail-Adresse.')
          } else {
            // 401 und alle anderen → generische Meldung (kein User-Enumeration)
            setError('E-Mail oder Passwort falsch.')
          }
        } else {
          if (status === 400) {
            setError('Diese E-Mail-Adresse ist bereits registriert.')
          } else {
            setError('Registrierung fehlgeschlagen. Bitte versuche es erneut.')
          }
        }
      } else {
        setError('Ein unbekannter Fehler ist aufgetreten.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Text as="h2" variant="subheading" weight="semibold">
        {mode === 'login' ? 'Anmelden' : 'Registrieren'}
      </Text>

      {/* Fehlermeldung */}
      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Erfolgsmeldung (Register) */}
      {successMessage && (
        <p role="status" className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
          {successMessage}
        </p>
      )}

      {mode === 'register' && (
        <FormField label="Name" required>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Dein Name"
            required
            autoComplete="name"
          />
        </FormField>
      )}

      <FormField label="E-Mail" required>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          required
          autoComplete="email"
        />
      </FormField>

      <FormField label="Passwort" required>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />
      </FormField>

      {mode === 'register' && (
        <FormField label="Passwort wiederholen" required>
          <Input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="new-password"
          />
        </FormField>
      )}

      <Button type="submit" variant="primary" loading={isLoading} disabled={isLoading}>
        {mode === 'login' ? 'Anmelden' : 'Registrieren'}
      </Button>

      {/* Links */}
      <div className="flex flex-col gap-1 text-center text-sm text-gray-500">
        {mode === 'login' ? (
          <>
            <Link to="/register" className="text-blue-600 hover:underline">
              Noch kein Konto? Jetzt registrieren
            </Link>
            <Link to="/forgot-password" className="text-gray-400 hover:underline">
              Passwort vergessen?
            </Link>
          </>
        ) : (
          <Link to="/login" className="text-blue-600 hover:underline">
            Bereits registriert? Jetzt anmelden
          </Link>
        )}
      </div>
    </form>
  )
}
