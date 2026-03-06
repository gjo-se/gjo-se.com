import { useState } from 'react'
import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import FormField from '../../molecules/FormField'
import Text from '../../atoms/Text'

export type AuthFormMode = 'login' | 'register'

export interface AuthFormData {
  email: string
  password: string
  name?: string
}

export interface AuthFormProps {
  mode: AuthFormMode
  onSubmit: (data: AuthFormData) => void
  isLoading?: boolean
  error?: string
  className?: string
}

/** AuthForm – Login- oder Registrierungsformular. Stub – wird in Phase 2h ausgebaut. */
export default function AuthForm({ mode, onSubmit, isLoading, error, className }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  return (
    <form
      className={`flex flex-col gap-4 ${className ?? ''}`}
      onSubmit={e => { e.preventDefault(); onSubmit({ email, password, name }) }}
    >
      <Text as="h2" variant="subheading" weight="semibold">
        {mode === 'login' ? 'Anmelden' : 'Registrieren'}
      </Text>
      {mode === 'register' && (
        <FormField label="Name">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Dein Name" />
        </FormField>
      )}
      <FormField label="E-Mail" required>
        <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" />
      </FormField>
      <FormField label="Passwort" required error={error}>
        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
      </FormField>
      <Button type="submit" variant="primary" loading={isLoading}>
        {mode === 'login' ? 'Anmelden' : 'Registrieren'}
      </Button>
    </form>
  )
}
