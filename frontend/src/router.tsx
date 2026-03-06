import { createBrowserRouter, Outlet } from 'react-router-dom'

import DefaultLayout from './components/templates/DefaultLayout'
import AuthLayout from './components/templates/AuthLayout'
import DevLayout from './components/templates/DevLayout'

import HomePage from './pages/HomePage'
import PortfolioPage from './pages/PortfolioPage'
import TechStackPage from './pages/TechStackPage'
import AboutPage from './pages/AboutPage'
import ImpressumPage from './pages/ImpressumPage'
import DatenschutzPage from './pages/DatenschutzPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MePage from './pages/MePage'
import NotFoundPage from './pages/NotFoundPage'

import AtomsShowcase from './pages/dev/AtomsShowcase'
import MoleculesShowcase from './pages/dev/MoleculesShowcase'
import OrganismsShowcase from './pages/dev/OrganismsShowcase'

/**
 * ProtectedRoute – Platzhalter für Auth-Guard.
 * Wird in Phase 2h mit echtem Auth-Context ausgebaut.
 */
function ProtectedRoute() {
  // TODO #67 Phase 2h: Auth-Check hier einbauen (redirect to /login wenn nicht eingeloggt)
  return <Outlet />
}

const devRoutes = import.meta.env.DEV
  ? [
      {
        element: <DevLayout />,
        children: [
          { path: '/dev/atoms', element: <AtomsShowcase /> },
          { path: '/dev/molecules', element: <MoleculesShowcase /> },
          { path: '/dev/organisms', element: <OrganismsShowcase /> },
        ],
      },
    ]
  : []

/**
 * router – Zentrale React Router v6 Konfiguration.
 * Alle Routen sind hier registriert.
 * Dev-Routen (/dev/*) sind nur bei import.meta.env.DEV aktiv.
 */
export const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/portfolio', element: <PortfolioPage /> },
      { path: '/tech-stack', element: <TechStackPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/impressum', element: <ImpressumPage /> },
      { path: '/datenschutz', element: <DatenschutzPage /> },
      {
        element: <ProtectedRoute />,
        children: [{ path: '/me', element: <MePage /> }],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  ...devRoutes,
])
