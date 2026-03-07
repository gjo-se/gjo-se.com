# Auth-Flow – Vollständigkeit & Erweiterungspotenzial

> Dieses Dokument ist kein Ticket. Es beschreibt bewusst ausgeklammerte Features
> und dient als Entscheidungshilfe für zukünftige Projekte.

---

## Was nach Phase 2j noch fehlen könnte

### Features für spezifische Anforderungen

| Feature | Prio | Wann relevant |
|---|---|---|
| **OAuth2 / Social Login** | Mittel | Consumer-Projekte mit breiter Zielgruppe – "Login mit Google/GitHub". Library: `authlib` für FastAPI. |
| **Roles & Permissions (RBAC)** | Hoch | Sobald `role: "user" \| "admin"` nicht mehr ausreicht. Permission-System: `can_edit`, `can_delete` etc. |
| **2FA / TOTP** | Niedrig | Sicherheitskritische Projekte (Finanzen, Gesundheit). Library: `pyotp`. |
| **Audit Log** | Niedrig | Compliance-Projekte. Tabelle `auth_events`: wer hat sich wann von wo eingeloggt? |
| **Session-Management UI** | Mittel | Aktive Sessions anzeigen + remote Logout ("Alle anderen Geräte abmelden"). Braucht Refresh Token (implementiert in 2j.1). |
| **Account-Sperrung** | Mittel | Nach X fehlgeschlagenen Login-Versuchen konto sperren. Ergänzt Rate-Limiting. |

### Was bewusst NICHT rein gehört

| Feature | Warum |
|---|---|
| **SSO / SAML** | Enterprise-only, eigener Identity-Server (z.B. Keycloak). Zu komplex für Standard-Projekte. |
| **Magic Links** | Netter Trend (passwortloses Login per E-Mail-Link). Ersetzt aber nicht den Passwort-Flow vollständig. |
| **WebAuthn / Passkeys** | Zukunftstechnologie, aber noch nicht Mainstream-Browser-Erwartung (Stand 2026). |

---

## Vollständigkeits-Bewertung

```
Phase 2h  ████████░░  80%  Basis-Flow (Login, Logout, Register, Me, ProtectedRoute)
Phase 2i  █████████░  90%  + Double Opt-In + Passwort-Reset + E-Mail-Infrastruktur
Phase 2j  ██████████ 100%  + Change PW/Email, Delete, Refresh Token, Rate-Limiting

Für universellen Bausatz (projektübergreifend):
+ OAuth2 Social Login   → nice-to-have (projektabhängig)
+ RBAC                  → projektabhängig
```

---

## Nächster Schritt nach 2j: gjo-auth Modul extrahieren

Nach Abschluss von Phase 2j ist der Auth-Code bereit für Extraktion:

```
gjo-auth/                        ← eigenes Git-Repo (privat)
├── backend/
│   ├── app/
│   │   ├── models/        user.py, email_verification.py, password_reset.py
│   │   ├── schemas/       auth.py
│   │   ├── repositories/  user_repository.py, email_verification_repository.py, password_reset_repository.py
│   │   ├── services/      auth_service.py, email_service.py
│   │   ├── core/          security.py
│   │   └── api/v1/endpoints/auth.py
│   ├── tests/             test_auth.py, test_verify_email.py, test_password_reset.py
│   └── README-auth.md     ← Integrations-Anleitung "30 Minuten Setup"
└── frontend/
    ├── src/
    │   ├── context/       AuthContext.tsx
    │   ├── hooks/         useAuth.ts
    │   ├── services/      api.ts, authService.ts
    │   └── components/    ProtectedRoute.tsx, AuthForm/
    └── pages/             LoginPage, RegisterPage, VerifyEmailPage,
                           ForgotPasswordPage, ResetPasswordPage
```

**Einbinden in neue Projekte:**
```bash
# Option A: Git Subtree (bleibt updatebar)
git subtree add --prefix=backend/app/auth \
  https://github.com/gjo-se/gjo-auth.git main --squash

# Option B: Manuell kopieren (einmalig, dann eigenständig)
cp -r gjo-auth/backend/app/* neues-projekt/backend/app/
cp -r gjo-auth/frontend/src/* neues-projekt/frontend/src/
# Dann: README-auth.md für nötige Anpassungen (Settings, Router) lesen
```
