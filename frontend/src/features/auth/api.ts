import api from '../../services/api'

/** Öffentliche Benutzerdaten – niemals Passwort-Hash einschließen. */
export interface UserOut {
  id: number
  email: string
  name: string
  role: string
  is_active: boolean
}

/** Response-Body für erfolgreichen Login. */
export interface LoginResponse {
  message: string
  user: UserOut
}

/**
 * Sendet Login-Credentials und gibt den Response zurück.
 * Das JWT wird vom Backend als httpOnly Cookie gesetzt.
 */
export async function loginRequest(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', {
    email,
    password,
  })
  return response.data
}

/**
 * Registriert einen neuen Benutzer.
 * Kein auto-login – der Account ist bis zur E-Mail-Bestätigung inaktiv (Phase 2i).
 */
export async function registerRequest(
  email: string,
  name: string,
  password: string,
): Promise<UserOut> {
  const response = await api.post<UserOut>('/auth/register', {
    email,
    name,
    password,
  })
  return response.data
}

/** Löscht das JWT-Cookie auf dem Server. */
export async function logoutRequest(): Promise<void> {
  await api.post('/auth/logout')
}

/**
 * Gibt die Daten des aktuell eingeloggten Benutzers zurück.
 * Wirft einen 401-Fehler wenn kein gültiges Cookie vorhanden ist.
 */
export async function getMeRequest(): Promise<UserOut> {
  const response = await api.get<UserOut>('/auth/me')
  return response.data
}
