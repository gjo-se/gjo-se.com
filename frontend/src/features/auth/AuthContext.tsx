import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'
import type { InternalAxiosRequestConfig } from 'axios'
import api from '../../services/api'
import {
  getMeRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
} from './api'
import type { UserOut } from './api'

/** Wert des Auth-Contexts – wird von `useAuth` zurückgegeben. */
interface AuthContextValue {
  user: UserOut | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, name: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

/** @internal – nur für `useAuth` exportiert */
export { AuthContext }

/** Props für den AuthProvider. */
interface AuthProviderProps {
  children: ReactNode
}

/**
 * AuthProvider – stellt den Auth-Context für die gesamte App bereit.
 *
 * Beim Mount wird `getMeRequest()` aufgerufen um den aktuellen User zu laden.
 * Ein 401-Interceptor auf der axios-Instanz ruft automatisch `logout()` auf.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserOut | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Ref auf logout – verhindert stale closure im Interceptor
  const logoutRef = useRef<() => Promise<void>>(async () => {})

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } catch {
      // Cookie ggf. schon abgelaufen – ignorieren
    } finally {
      setUser(null)
    }
  }, [])

  // Ref aktuell halten
  useEffect(() => {
    logoutRef.current = logout
  }, [logout])

  // 401-Interceptor einmalig registrieren
  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => response,
      async (error: { config: InternalAxiosRequestConfig; response?: { status: number } }) => {
        // Kein Loop: /auth/me und /auth/login selbst nicht abfangen
        const url = error.config?.url ?? ''
        const isAuthEndpoint =
          url.includes('/auth/login') || url.includes('/auth/me')

        if (error.response?.status === 401 && !isAuthEndpoint) {
          await logoutRef.current()
        }
        return Promise.reject(error)
      },
    )

    return () => {
      api.interceptors.response.eject(interceptorId)
    }
  }, [])

  // Beim Mount: Session wiederherstellen
  useEffect(() => {
    getMeRequest()
      .then((userData) => setUser(userData))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginRequest(email, password)
    setUser(response.user)
  }, [])

  const register = useCallback(
    async (email: string, name: string, password: string) => {
      await registerRequest(email, name, password)
      // Kein auto-login – User muss E-Mail bestätigen (Phase 2i)
    },
    [],
  )

  const value = useMemo(
    () => ({ user, isLoading, login, logout, register }),
    [user, isLoading, login, logout, register],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
