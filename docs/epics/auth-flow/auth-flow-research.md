# Research: Phase 2h – Auth-Flow (Fullstack)

> Projekt: gjo-se.com
> Erstellt: 2026-03-07
> Rolle: REX

---

## Ziel

Ein vollständiger, sicherer Auth-Flow für gjo-se.com – Frontend (React) und Backend (FastAPI)
arbeiten zusammen. Ziel ist ein wiederverwendbarer Bausatz, der in künftigen Projekten als
Startpunkt dient.

---

## Gesamtbild – Was passiert beim Auth?

```
Browser (React)                     Server (FastAPI)                  DB (PostgreSQL)
──────────────────────────────────────────────────────────────────────────────────────
1. POST /api/v1/auth/login  ──────►  Credentials prüfen
   { email, password }               bcrypt.verify(password, hash)  ◄── users-Tabelle
                             ◄──────  { access_token, token_type }
                                      (JWT, signiert mit SECRET_KEY)

2. Token speichern (httpOnly Cookie)

3. GET /api/v1/auth/me  ──────────►  JWT aus Cookie lesen
   Cookie: access_token=...          JWT verifizieren (Signatur + Ablauf)
                             ◄──────  { id, email, name, role }     ◄── users-Tabelle

4. Geschützte Route im FE:
   AuthContext.user !== null  → Seite rendern
   AuthContext.user === null  → Redirect /login

5. POST /api/v1/auth/logout ──────►  Cookie löschen (Set-Cookie: max-age=0)
                             ◄──────  { message: "logged out" }
```

---

## Entscheidungen

### Token-Speicherung: httpOnly Cookie (nicht localStorage)

| | httpOnly Cookie | localStorage |
|---|---|---|
| XSS-Angriff | ✅ Token nicht auslesbar | ❌ JavaScript kann Token lesen |
| CSRF-Angriff | ⚠️ möglich (mitigierbar) | ✅ kein CSRF |
| Einfachheit | ✅ Browser verwaltet Token | ⚠️ manuelles Anhängen an Requests |
| **Empfehlung** | ✅ **verwenden** | ❌ |

**Mitigation CSRF:** `SameSite=Lax` Cookie-Attribut (Standard in modernen Browsern).
Für erhöhte Sicherheit: CSRF-Token-Header ergänzen.

### JWT vs. Session

| | JWT (stateless) | Session (stateful) |
|---|---|---|
| Server-State | ✅ kein State nötig | ❌ Session in DB/Redis |
| Skalierung | ✅ horizontal skalierbar | ⚠️ Sticky Sessions oder gemeinsamer Store |
| Token-Widerruf | ⚠️ nur via Blacklist-Tabelle | ✅ einfach (Session löschen) |
| **Empfehlung** | ✅ **JWT für dieses Projekt** | – |

**Token-Ablauf:** `access_token` mit kurzer Laufzeit (z.B. 30 Minuten).
Optional: `refresh_token` mit langer Laufzeit (7 Tage) für automatische Verlängerung.
→ Für Phase 2h zunächst **nur access_token** (einfacher Einstieg), refresh_token als spätere Erweiterung.

### Passwort-Hashing: bcrypt via passlib

- `passlib[bcrypt]` ist der Standard in FastAPI-Projekten
- Salted hash, konfigurierbare Work-Faktor-Kosten
- Niemals Klartext-Passwörter speichern

---

## Backend – FastAPI

### Neue Abhängigkeiten

```toml
# pyproject.toml
"python-jose[cryptography]>=3.5.0"   # JWT erstellen + verifizieren
"passlib[bcrypt]>=1.7.4"              # Passwort-Hashing
"python-multipart>=0.0.9"             # Form-Data (OAuth2PasswordRequestForm)
```

### Datenbankmodell: User

```python
# app/models/user.py
class User(BaseModel):
    id: int (PK, autoincrement)
    email: str (unique, not null)
    name: str (not null)
    hashed_password: str (not null)
    is_active: bool (default True)
    role: str (default "user")  # "user" | "admin"
    created_at: datetime
    updated_at: datetime
```

### API-Endpunkte

| Methode | Pfad | Auth | Beschreibung |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | public | Neuen User anlegen |
| `POST` | `/api/v1/auth/login` | public | JWT als httpOnly Cookie setzen |
| `POST` | `/api/v1/auth/logout` | public | Cookie löschen |
| `GET` | `/api/v1/auth/me` | 🔒 JWT | Aktuellen User zurückgeben |

### Ordnerstruktur Backend (neu)

```
app/
├── models/
│   └── user.py              ← SQLAlchemy User-Modell
├── schemas/
│   └── auth.py              ← Pydantic: RegisterRequest, LoginResponse, UserOut
├── repositories/
│   └── user_repository.py   ← DB-Zugriff (get_by_email, create)
├── services/
│   └── auth_service.py      ← Geschäftslogik (verify_password, create_token)
├── api/v1/
│   └── endpoints/
│       └── auth.py          ← FastAPI Router mit den 4 Endpunkten
└── core/
    └── security.py          ← JWT-Funktionen, Passwort-Hashing, get_current_user
```

### Ablauf Register

```
POST /api/v1/auth/register
Body: { email, name, password }

1. email bereits in DB? → 400 "Email already registered"
2. bcrypt.hash(password) → hashed_password
3. User in DB anlegen
4. UserOut zurückgeben (ohne hashed_password!)
```

### Ablauf Login

```
POST /api/v1/auth/login
Body: { email, password }  (application/x-www-form-urlencoded via OAuth2PasswordRequestForm)
  ODER
Body: { email, password }  (application/json – eigener LoginRequest)

1. User in DB suchen (by email)
2. bcrypt.verify(password, hashed_password) → False → 401 "Invalid credentials"
3. JWT erstellen: { sub: user.id, email, role, exp: now + 30min }
4. Response: Set-Cookie: access_token=<jwt>; HttpOnly; SameSite=Lax; Path=/
5. Body: { message: "Login successful", user: UserOut }
```

### Ablauf get_current_user (Dependency)

```python
# app/core/security.py
async def get_current_user(
    token: str = Cookie(None, alias="access_token"),
    db: AsyncSession = Depends(get_db),
) -> User:
    # 1. Token vorhanden?
    # 2. JWT verifizieren (Signatur + Ablauf)
    # 3. User aus DB laden
    # 4. is_active prüfen
    # → gibt User zurück oder wirft 401
```

### Pydantic Schemas

```python
# app/schemas/auth.py

class RegisterRequest(BaseModel):
    email: EmailStr
    name: str
    password: str  # min. 8 Zeichen (Validator)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    name: str
    role: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

class LoginResponse(BaseModel):
    message: str
    user: UserOut
```

---

## Frontend – React

### Neue Abhängigkeiten

```bash
npm install axios          # HTTP-Client mit Cookie-Unterstützung
```

> **Warum Axios statt fetch?**
> `axios` sendet httpOnly Cookies automatisch mit (`withCredentials: true`).
> Mit `fetch` muss `credentials: 'include'` manuell gesetzt werden.
> Axios bietet zusätzlich Interceptors für zentrales Error-Handling (z.B. 401 → Redirect /login).

### Neue Dateien

```
src/
├── services/
│   └── authService.ts         ← API-Calls: login, register, logout, getMe
├── hooks/
│   └── useAuth.ts             ← Custom Hook (liest AuthContext)
└── components/
    ├── atoms/
    │   └── (keine neuen)
    ├── molecules/
    │   └── (keine neuen)
    └── organisms/
        └── AuthForm/           ← bereits vorhanden (Shell) → befüllen
```

> **Kein neuer Context-Ordner** – `AuthContext` kommt als `src/context/AuthContext.tsx`
> (eigener Ordner neben `hooks/` und `services/`).

### AuthContext

```typescript
// src/context/AuthContext.tsx

interface AuthContextValue {
  user: UserOut | null        // null = nicht eingeloggt
  isLoading: boolean          // true = initialer Check läuft noch
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, name: string, password: string) => Promise<void>
}
```

**Initialisierung:**
Beim App-Start ruft `AuthProvider` einmalig `GET /api/v1/auth/me` auf.
- Antwort 200 → `user` setzen (Token im Cookie noch gültig)
- Antwort 401 → `user = null` (nicht eingeloggt oder Token abgelaufen)

Das verhindert, dass eingeloggte User nach einem Page-Reload ausgeloggt werden.

### authService.ts

```typescript
// src/services/authService.ts
// axios-Instanz mit withCredentials: true (sendet httpOnly Cookie automatisch)

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

export const authService = {
  login:    (email, password) => api.post('/auth/login', { email, password }),
  register: (email, name, password) => api.post('/auth/register', { email, name, password }),
  logout:   () => api.post('/auth/logout'),
  getMe:    () => api.get('/auth/me'),
}
```

### RequireAuth (Route Guard)

```typescript
// src/components/ProtectedRoute.tsx  ← bereits vorhanden, anpassen

// Logik:
// isLoading → Spinner zeigen (initialer Auth-Check läuft)
// user !== null → children rendern
// user === null → <Navigate to="/login" replace />
```

### Login-Flow im Browser

```
User öffnet /me (protected)
  └─ RequireAuth prüft AuthContext.user
       ├─ isLoading=true  → Spinner
       ├─ user != null    → /me rendern
       └─ user == null    → Redirect /login

User gibt Credentials ein (LoginPage)
  └─ authService.login(email, password)
       ├─ 200 → AuthContext.setUser(user)  → navigate('/me')
       └─ 401 → Fehlermeldung im Form

User klickt Logout (Header)
  └─ authService.logout()
       └─ AuthContext.setUser(null)  → navigate('/')
```

### VITE_API_URL

In `frontend/.env` (lokal) und `frontend/.env.example`:
```
VITE_API_URL=http://localhost:8000/api/v1
```

---

## CORS – Backend muss Cookies akzeptieren

Bereits in `main.py` konfiguriert:
```python
CORSMiddleware(
    allow_origins=settings.ALLOWED_ORIGINS,  # kein Wildcard "*" bei Cookies!
    allow_credentials=True,                   # ← Pflicht für httpOnly Cookies
    allow_methods=["*"],
    allow_headers=["*"],
)
```

`ALLOWED_ORIGINS` muss in `.env` explizite Origins enthalten (z.B. `http://localhost:5173`).
Kein `"*"` wenn `allow_credentials=True` – das lehnt der Browser ab (CORS-Fehler).

---

## Alembic Migration

Für den `User`-Table wird eine neue Migration benötigt:

```bash
# in backend/
alembic revision --autogenerate -m "add_users_table"
alembic upgrade head
```

---

## Sicherheits-Checkliste

| Punkt | Maßnahme |
|---|---|
| Passwörter | bcrypt-Hash, niemals Klartext |
| JWT Secret | Starkes Secret in `.env` (`SECRET_KEY`), nie im Code |
| Token-Ablauf | `access_token`: 30 Minuten |
| Cookie-Flags | `HttpOnly`, `SameSite=Lax`, in Prod: `Secure` (HTTPS) |
| CORS | Kein Wildcard `*` bei `allow_credentials=True` |
| Error-Messages | Immer generisch bei Auth-Fehlern (kein "User nicht gefunden" vs. "Falsches Passwort") |
| Passwort-Validierung | Minimum 8 Zeichen, Pydantic-Validator im Schema |
| Rate-Limiting | Optional: `slowapi` für Login-Endpunkt (Brute-Force-Schutz) |

---

## State of the Art – Was gehört zum vollständigen Auth-Flow?

Die drei Basisfunktionen `login()`, `logout()`, `register()` sind der Kern – aber in der
Realität erwartet ein User heute deutlich mehr. Hier der vollständige SOTA-Überblick.

---

### 1. Double Opt-In (E-Mail-Bestätigung nach Registrierung)

**Warum:**
- Schutz vor Fake-Registrierungen mit fremden E-Mail-Adressen
- DSGVO-Konformität (nachweisbares Einverständnis)
- Verhindert, dass Bots den User-Pool fluten

**Ablauf:**

```
User registriert sich
  └─ POST /api/v1/auth/register
       1. User anlegen mit is_active=False
       2. Zufälliges Token (UUID oder secrets.token_urlsafe) generieren
       3. Token mit TTL (24h) in DB speichern (eigene Tabelle: email_verifications)
       4. E-Mail senden: "Bitte bestätige deine Adresse"
          Link: https://gjo-se.com/verify-email?token=<token>
       5. Response: { message: "Bitte prüfe deine E-Mails." }

User klickt Link
  └─ GET /api/v1/auth/verify-email?token=<token>
       1. Token in DB suchen
       2. Abgelaufen (> 24h)? → 400 "Token abgelaufen – bitte neu anfordern"
       3. Token gültig → User.is_active = True setzen
       4. Token aus DB löschen
       5. Redirect → /login (mit Erfolgsmeldung)
```

**Neue DB-Tabelle: `email_verifications`**
```
id, user_id (FK), token (unique), expires_at, created_at
```

**E-Mail-Versand:** `fastapi-mail` oder direktes `smtplib`.
Für lokale Entwicklung: [Mailpit](https://mailpit.axllent.org/) als Docker-Container
(SMTP-Fake-Server mit Web-UI).

---

### 2. Passwort vergessen / Reset

**Ablauf (identisch zu Double-Opt-In-Mechanik, anderer Zweck):**

```
User klickt "Passwort vergessen" → gibt E-Mail ein
  └─ POST /api/v1/auth/forgot-password
       Body: { email }
       1. User in DB suchen
       2. Immer gleiche Response: { message: "Falls die Adresse bekannt ist, erhältst du eine E-Mail." }
          (kein "User nicht gefunden" – verhindert User-Enumeration!)
       3. Falls User gefunden: Token generieren, in DB speichern (TTL: 1h)
       4. E-Mail senden: "Passwort zurücksetzen"
          Link: https://gjo-se.com/reset-password?token=<token>

User klickt Link → gibt neues Passwort ein
  └─ POST /api/v1/auth/reset-password
       Body: { token, new_password }
       1. Token suchen + prüfen (gültig? abgelaufen?)
       2. bcrypt.hash(new_password)
       3. User.hashed_password updaten
       4. Token aus DB löschen
       5. Alle aktiven Sessions/Tokens invalidieren (optional: Token-Version im User inkrementieren)
       6. Response: { message: "Passwort erfolgreich geändert." }
```

**Neue DB-Tabelle: `password_resets`**
```
id, user_id (FK), token (unique), expires_at, created_at
```

> **Sicherheits-Hinweis:** Gleiches Token-Schema wie Double-Opt-In,
> aber deutlich kürzere TTL (1h statt 24h).

---

### 3. E-Mail ändern

```
User möchte E-Mail ändern (im Account-Bereich)
  └─ POST /api/v1/auth/change-email
       Body: { new_email, password }  ← Passwort zur Bestätigung
       1. Passwort verifizieren
       2. Neue E-Mail bereits vergeben? → 400
       3. Bestätigungs-Token für neue E-Mail generieren
       4. E-Mail an neue Adresse: "Bitte bestätige deine neue E-Mail-Adresse"
       5. Alte E-Mail bleibt aktiv bis Bestätigung

User bestätigt neue E-Mail
  └─ GET /api/v1/auth/verify-email-change?token=<token>
       1. Token prüfen
       2. User.email updaten
       3. Token löschen
```

---

### 4. Passwort ändern (eingeloggter User)

```
POST /api/v1/auth/change-password  (🔒 JWT erforderlich)
Body: { current_password, new_password }

1. current_password verifizieren
2. new_password != current_password prüfen
3. bcrypt.hash(new_password)
4. User.hashed_password updaten
```

---

### 5. Account löschen (DSGVO: Recht auf Vergessenwerden)

```
DELETE /api/v1/auth/account  (🔒 JWT erforderlich)
Body: { password }  ← Bestätigung

1. Passwort verifizieren
2. User-Daten anonymisieren ODER hard delete
3. Cookie löschen (Logout)
4. Bestätigungs-E-Mail senden
```

> **DSGVO-Hinweis:** Hard-Delete ist einfacher. Anonymisierung
> (email → deleted_<id>@deleted.invalid) ist nötig wenn Fremdschlüssel-Daten
> (z.B. Kommentare) erhalten bleiben sollen.

---

### 6. Refresh Token (Token-Verlängerung ohne Re-Login)

Der `access_token` läuft nach 30 Minuten ab. Ohne Refresh-Mechanismus wird der User
alle 30 Minuten ausgeloggt – schlechte UX.

**Ablauf:**

```
access_token läuft ab → 401 Response
  └─ Axios-Interceptor fängt 401 ab
       └─ POST /api/v1/auth/refresh
            Cookie: refresh_token=<long_lived_jwt>
            ├─ refresh_token gültig → neuen access_token als Cookie setzen
            └─ refresh_token abgelaufen → Logout → /login
```

**Zwei Cookies:**
| Cookie | TTL | HttpOnly | Zweck |
|---|---|---|---|
| `access_token` | 30 Min | ✅ | API-Requests authentifizieren |
| `refresh_token` | 7 Tage | ✅ | Neuen access_token ausstellen |

> **Für Phase 2h:** Noch nicht implementieren – erhöht Komplexität.
> Als separates Ticket vormerken.

---

### 7. Rate-Limiting (Brute-Force-Schutz)

Ohne Rate-Limiting kann ein Angreifer unbegrenzt Passwörter ausprobieren.

```python
# Empfehlung: slowapi (FastAPI-Port von flask-limiter)
@router.post("/login")
@limiter.limit("5/minute")  # max. 5 Login-Versuche pro Minute pro IP
async def login(...): ...
```

> **Für Phase 2h:** Optional, aber empfohlen für Produktion.

---

### 8. Übersicht: Was kommt wann?

| Feature | Phase 2h | Später |
|---|---|---|
| `register()` (einfach, ohne Bestätigung) | ✅ | – |
| `login()` | ✅ | – |
| `logout()` | ✅ | – |
| `get_current_user` / `me` | ✅ | – |
| `RequireAuth` Route Guard | ✅ | – |
| Double Opt-In (E-Mail-Bestätigung) | ⚠️ optional | ✅ empfohlen |
| Passwort vergessen / Reset | ⚠️ optional | ✅ empfohlen |
| Passwort ändern | – | ✅ |
| E-Mail ändern | – | ✅ |
| Account löschen (DSGVO) | – | ✅ |
| Refresh Token | – | ✅ |
| Rate-Limiting | – | ✅ Prod |

> **Empfehlung für Phase 2h:**
> Den einfachen Register-Flow (ohne Double-Opt-In) implementieren,
> aber `is_active`-Feld und `email_verifications`-Tabelle **bereits anlegen**,
> damit der spätere Ausbau keine DB-Migration bricht.
> Double-Opt-In und Passwort-Reset als eigene Tickets in Phase 2i.

---

### 9. E-Mail-Infrastruktur (lokal + Produktion)

| Umgebung | Tool | Zweck |
|---|---|---|
| Lokal / Dev | [Mailpit](https://mailpit.axllent.org/) (Docker) | SMTP-Fake-Server, Web-UI auf :8025 |
| Test | Mailpit oder Mock | E-Mails nicht wirklich senden |
| Produktion | [Resend](https://resend.com) oder [SendGrid](https://sendgrid.com) | Transaktionale E-Mails, Zustellbarkeit |

**Mailpit in docker-compose.override.yml (lokal):**
```yaml
mailpit:
  image: axllent/mailpit
  ports:
    - "8025:8025"   # Web-UI
    - "1025:1025"   # SMTP
```

**Backend .env (lokal):**
```
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=
EMAILS_FROM_ADDRESS=noreply@gjo-se.com
```

---

## Modularisierung – Wiederverwendbarkeit wie TYPO3-Extensions

### Frage: Gibt es fertige Lösungen?

Ja – und die Antwort teilt sich in zwei Kategorien:

#### Option A: Fertige Auth-Bibliotheken (sofort nutzbar)

| Library | Stack | Was sie bieten | Einschränkung |
|---|---|---|---|
| **FastAPI Users** | FastAPI + SQLAlchemy | Register, Login, Verify, Reset, OAuth – komplett out-of-the-box | Meinungsstarke Struktur, weniger flexibel |
| **Auth.js (NextAuth)** | Next.js | Vollständiger Auth-Flow inkl. OAuth | Nur Next.js |
| **Supabase Auth** | Any Frontend | Hosted Auth-Service mit SDK | Vendor Lock-in |
| **Clerk** | React/Next | Hosted Auth inkl. UI-Komponenten | Vendor Lock-in, kostenpflichtig ab Skala |
| **Keycloak** | Any | Enterprise Identity Provider (SSO, OAuth2, OIDC) | Sehr komplex, eigener Server |

**FastAPI Users** wäre die naheliegendste Wahl für dieses Projekt:
```bash
pip install fastapi-users[sqlalchemy]
```
Bietet out-of-the-box: Register, Login, Logout, Verify Email, Reset Password, OAuth2.

> **Empfehlung dagegen für gjo-se.com:**
> FastAPI Users ist gut, aber es abstrahiert sehr viel weg – du lernst dabei weniger,
> und der Code ist schwerer zu debuggen und anzupassen. Für ein Portfolio-Projekt,
> das als Bausatz dienen soll, ist **Eigenimplementierung mit klarer Struktur** wertvoller.

---

#### Option B: Eigener modularer Auth-Bausatz (empfohlen)

Das TYPO3-Extension-Äquivalent in Python/React ist ein **eigenes Git-Repository als Template**
oder ein **cookiecutter-Template**.

```
Konzept: "auth-module" als eigenständiges Modul
──────────────────────────────────────────────────

gjo-auth/                        ← eigenes Git-Repo (privat oder öffentlich)
├── backend/
│   ├── app/
│   │   ├── models/user.py
│   │   ├── schemas/auth.py
│   │   ├── repositories/user_repository.py
│   │   ├── services/auth_service.py
│   │   ├── core/security.py
│   │   └── api/v1/endpoints/auth.py
│   └── tests/
│       └── test_auth.py
└── frontend/
    ├── src/
    │   ├── context/AuthContext.tsx
    │   ├── hooks/useAuth.ts
    │   ├── services/authService.ts
    │   └── components/
    │       ├── LoginForm/
    │       ├── RegisterForm/
    │       └── ProtectedRoute.tsx
    └── README.md
```

**Verwendung in neuen Projekten:**
```bash
# Als Git-Subtree einbinden (bleibt updatebar)
git subtree add --prefix=backend/app/auth \
  https://github.com/gjo-se/gjo-auth.git main --squash

# ODER: cookiecutter-Template
pip install cookiecutter
cookiecutter https://github.com/gjo-se/cookiecutter-fastapi-auth
```

**Realistischere Alternative für den Anfang – Copy-Paste-Modul:**
Kein separates Repo, aber der Auth-Code wird so strukturiert, dass er mit
minimalem Aufwand in ein neues Projekt kopiert werden kann:
- Keine projektspezifischen Imports
- Alle Abhängigkeiten explizit dokumentiert
- `README-auth.md` im Modul mit Integrations-Anleitung

---

### Ist der Auth-Flow damit vollständig?

**Für 95% aller Projekte: Ja – mit folgenden Ergänzungen:**

#### Was noch fehlt für einen produktionsreifen, universellen Flow

| Feature | Prio | Begründung |
|---|---|---|
| **OAuth2 / Social Login** | Mittel | "Login mit Google/GitHub" – in vielen Projekten erwartet. `authlib` für FastAPI. |
| **Roles & Permissions (RBAC)** | Hoch | `role: "user" \| "admin"` reicht für einfache Fälle. Für komplexere Berechtigungen: Permission-System (`can_edit`, `can_delete` etc.) |
| **2FA / TOTP** | Niedrig | Google Authenticator – `pyotp`. Nur für sicherheitskritische Projekte nötig. |
| **Audit Log** | Niedrig | Wer hat sich wann eingeloggt? Tabelle `auth_events`. Für Compliance-Projekte. |
| **Session-Management** | Mittel | Aktive Sessions anzeigen + remote Logout ("Alle Geräte abmelden"). Braucht Refresh Token (Phase 2j). |
| **Account-Sperrung** | Mittel | Nach X fehlgeschlagenen Login-Versuchen konto sperren. Ergänzt Rate-Limiting. |

#### Was bewusst NICHT rein gehört

| Feature | Warum draußen |
|---|---|
| **SSO / SAML** | Enterprise-only, zu komplex für Portfolio-Projekte |
| **Magic Links** | Netter Trend, aber ersetzt nicht Passwort-Flow |
| **WebAuthn / Passkeys** | Zukunft, aber noch nicht Mainstream-Erwartung |

---

### Vollständigkeits-Bewertung nach Phasen

```
Phase 2h  ████████░░  80%  Basis-Flow (Login, Logout, Register, Me, Guard)
Phase 2i  █████████░  90%  + Double Opt-In + Passwort-Reset
Phase 2j  ██████████ 100%  + Change PW/Email, Delete, Refresh Token, Rate-Limit

Für "Universellen Bausatz":
+ OAuth2 Login          → 105% (nice-to-have)
+ RBAC                  → 110% (projektabhängig)
```

> **Fazit:** Nach Phase 2i (Double Opt-In + Passwort-Reset) hast du einen
> Auth-Flow, den du in **nahezu jedem Webprojekt direkt einsetzen** kannst.
> Phase 2j ist Feinschliff für Produktion.
> OAuth2 und RBAC nur wenn das Projekt es explizit braucht.

---

### Empfohlene Vorgehensweise für den Bausatz

1. **Jetzt:** Phase 2h vollständig implementieren, dabei Code sauber strukturieren
2. **Nach Phase 2i:** Auth-Code in separates `gjo-auth`-Repo extrahieren
3. **Dokumentieren:** `README-auth.md` mit "How to integrate in 30 minutes"
4. **Template-Repo anlegen:** `gjo-fastapi-starter` mit Auth bereits eingebaut

---

## Umsetzungsreihenfolge (Tickets)

### Phase 2h – Basis Auth-Flow (jetzt)

| Schritt | Was | Wer |
|---|---|---|
| 1 | Backend: User-Modell + Migration (inkl. `is_active`, `role`) | SAM |
| 2 | Backend: `security.py` (JWT + bcrypt) | SAM |
| 3 | Backend: Auth-Endpunkte (`register`, `login`, `logout`, `me`) | SAM |
| 4 | Backend: Tests (register, login, logout, me, 401-Fälle) | SAM |
| 5 | Frontend: axios installieren + `authService.ts` | SAM |
| 6 | Frontend: `AuthContext` + `AuthProvider` + `useAuth` | SAM |
| 7 | Frontend: `RequireAuth` anpassen | SAM |
| 8 | Frontend: `LoginPage` + `RegisterPage` befüllen | SAM |
| 9 | Frontend: Header Logout-Button | SAM |
| 10 | Integration testen (Docker) | SAM |

### Phase 2i – Double Opt-In + Passwort-Reset (nächste Phase)

| Schritt | Was | Wer |
|---|---|---|
| 1 | Backend: `email_verifications`-Tabelle + Migration | SAM |
| 2 | Backend: `password_resets`-Tabelle + Migration | SAM |
| 3 | Backend: E-Mail-Service (`fastapi-mail` + Mailpit lokal) | SAM |
| 4 | Backend: `verify-email`-Endpunkt | SAM |
| 5 | Backend: `forgot-password` + `reset-password`-Endpunkte | SAM |
| 6 | Frontend: `/verify-email`-Seite | SAM |
| 7 | Frontend: `/forgot-password`-Seite | SAM |
| 8 | Frontend: `/reset-password`-Seite | SAM |

### Phase 2j – Account-Management (später)

| Schritt | Was | Wer |
|---|---|---|
| 1 | Backend + Frontend: Passwort ändern | SAM |
| 2 | Backend + Frontend: E-Mail ändern | SAM |
| 3 | Backend + Frontend: Account löschen (DSGVO) | SAM |
| 4 | Backend: Refresh Token | SAM |
| 5 | Backend: Rate-Limiting (`slowapi`) | SAM |
