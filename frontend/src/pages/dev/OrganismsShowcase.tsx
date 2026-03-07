import { useState } from 'react'
import Header from '../../components/organisms/Header'
import Footer from '../../components/organisms/Footer'
import HeroSection from '../../components/organisms/HeroSection'
import ProjectGrid from '../../components/organisms/ProjectGrid'
import SkillGrid from '../../components/organisms/SkillGrid'
import Timeline from '../../components/organisms/Timeline'
import MobileNav from '../../components/organisms/MobileNav'
import AuthForm from '../../components/organisms/AuthForm'
import ContactSection from '../../components/organisms/ContactSection'
import PageHeader from '../../components/organisms/PageHeader'
import ErrorBoundary from '../../components/organisms/ErrorBoundary'
import CookieBanner from '../../components/organisms/CookieBanner'
import Badge from '../../components/atoms/Badge'
import Button from '../../components/atoms/Button'

// ---------------------------------------------------------------------------
// Mock-Daten
// ---------------------------------------------------------------------------
const MOCK_NAV = [{ label: 'Home', to: '/' }, { label: 'Portfolio', to: '/portfolio' }, { label: 'About', to: '/about' }]
const MOCK_PROJECTS = [
  { title: 'gjo-se.com', description: 'Persönliche Portfolio-Website', tags: ['React', 'FastAPI'], href: '/portfolio/gjo-se' },
  { title: 'Projekt B', description: 'E-Commerce Plattform', tags: ['Vue', 'Python'], href: '/portfolio/b' },
  { title: 'Projekt C', tags: ['React', 'Docker'] },
]
const MOCK_SKILLS = [
  { name: 'React', level: 'expert' as const },
  { name: 'TypeScript', level: 'advanced' as const },
  { name: 'Python', level: 'advanced' as const },
  { name: 'Docker', level: 'intermediate' as const },
]
const MOCK_TIMELINE = [
  { date: '2022 – heute', title: 'Senior Developer', badge: 'Entrados GmbH', description: 'React, FastAPI, Architecture' },
  { date: '2019 – 2022', title: 'Frontend Developer', badge: 'Agentur AG', description: 'Vue.js, TYPO3' },
  { date: '2017 – 2019', title: 'Junior Developer', description: 'HTML, CSS, jQuery', isLast: true },
]
const MOCK_SOCIAL = [
  { platform: 'github' as const, href: 'https://github.com/gjo-se' },
  { platform: 'linkedin' as const, href: 'https://linkedin.com' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function StubBadge() {
  return (
    <div className="mb-3 inline-flex rounded border border-dashed border-yellow-400 bg-yellow-50 px-2 py-0.5 text-xs text-yellow-700">
      Stub – wird in Phase 2b/2c ausgebaut
    </div>
  )
}

function OrgSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <div className="mb-3 flex items-center gap-3">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <Badge variant="warning" size="sm">Organism</Badge>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200">
        {children}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// OrganismsShowcase
// ---------------------------------------------------------------------------

/**
 * OrganismsShowcase – Dev-only Übersichtsseite für alle Organism-Komponenten.
 * Nur sichtbar bei import.meta.env.DEV.
 */
export default function OrganismsShowcase() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [cookieVisible, setCookieVisible] = useState(true)
  const [isDark, setIsDark] = useState(false)

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">🦠 Organisms</h1>
      <p className="mb-10 text-gray-500">Eigenständige UI-Abschnitte mit eigenem State und Logik.</p>

      {/* Header */}
      <OrgSection title="Header">
        <StubBadge />
        <Header navItems={MOCK_NAV} isDark={isDark} onThemeToggle={() => setIsDark(d => !d)} onMenuOpen={() => setMobileNavOpen(true)} />
      </OrgSection>

      {/* Footer */}
      <OrgSection title="Footer">
        <StubBadge />
        <Footer links={[{ label: 'Impressum', href: '/impressum' }, { label: 'Datenschutz', href: '/datenschutz' }]} socialLinks={MOCK_SOCIAL} />
      </OrgSection>

      {/* HeroSection */}
      <OrgSection title="HeroSection">
        <StubBadge />
        <HeroSection headline="Hallo, ich bin Gregory." subline="Senior Developer & Software Architect." ctaLabel="Portfolio ansehen" ctaHref="/portfolio" />
      </OrgSection>

      {/* ProjectGrid */}
      <OrgSection title="ProjectGrid">
        <StubBadge />
        <div className="p-4">
          <ProjectGrid projects={MOCK_PROJECTS} filters={['React', 'Vue', 'Docker']} />
        </div>
      </OrgSection>

      {/* SkillGrid */}
      <OrgSection title="SkillGrid">
        <StubBadge />
        <div className="p-4">
          <SkillGrid skills={MOCK_SKILLS} />
        </div>
      </OrgSection>

      {/* Timeline */}
      <OrgSection title="Timeline">
        <StubBadge />
        <div className="p-4">
          <Timeline items={MOCK_TIMELINE} />
        </div>
      </OrgSection>

      {/* MobileNav */}
      <OrgSection title="MobileNav">
        <StubBadge />
        <div className="p-4">
          <Button variant="secondary" size="sm" onClick={() => setMobileNavOpen(true)}>MobileNav öffnen</Button>
          <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} navItems={MOCK_NAV} />
        </div>
      </OrgSection>

      {/* AuthForm */}
      <OrgSection title="AuthForm">
        <StubBadge />
        <div className="grid gap-6 p-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-xs text-gray-400">mode: login</p>
            <AuthForm mode="login" onSuccess={() => {}} />
          </div>
          <div>
            <p className="mb-2 text-xs text-gray-400">mode: register</p>
            <AuthForm mode="register" onSuccess={() => {}} />
          </div>
        </div>
      </OrgSection>

      {/* ContactSection */}
      <OrgSection title="ContactSection">
        <StubBadge />
        <ContactSection email="hi@gjo-se.com" socialLinks={MOCK_SOCIAL} />
      </OrgSection>

      {/* PageHeader */}
      <OrgSection title="PageHeader">
        <StubBadge />
        <div className="p-4">
          <PageHeader
            title="Portfolio"
            subtitle="Ausgewählte Projekte und Fallstudien."
            breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Portfolio' }]}
          />
        </div>
      </OrgSection>

      {/* ErrorBoundary */}
      <OrgSection title="ErrorBoundary">
        <StubBadge />
        <div className="p-4">
          <ErrorBoundary>
            <p className="text-sm text-gray-600">Kein Fehler – Kinder werden normal gerendert.</p>
          </ErrorBoundary>
        </div>
      </OrgSection>

      {/* CookieBanner */}
      <OrgSection title="CookieBanner">
        <StubBadge />
        <div className="relative min-h-24 p-4">
          {cookieVisible ? (
            <CookieBanner isVisible onAccept={() => setCookieVisible(false)} onDecline={() => setCookieVisible(false)} className="relative bottom-auto left-auto right-auto" />
          ) : (
            <Button variant="secondary" size="sm" onClick={() => setCookieVisible(true)}>CookieBanner wieder anzeigen</Button>
          )}
        </div>
      </OrgSection>
    </div>
  )
}
