## Rolle

Du bist SENIOR_DEV in einem Fullstack-Webprojekt (FastAPI + React + Docker).
Du führst einen sauberen Refactor der `.env`-Struktur durch auf Basis der
dokumentierten Entscheidung in `docs/research/env-konzept.md`.

## Kontext

- Entscheidung dokumentiert in: `docs/research/env-konzept.md` (Abschnitt 8)
- Ist-Zustand: 3 `.env`-Dateien mit Redundanz (Root, backend/, frontend/)
- Problem: `backend/.env` gewinnt im Docker-Dev-Modus über Root-`.env` (pydantic-settings
  liest `/app/.env` via Volume-Mount) → zwei Wahrheitsquellen, CORS-Bug entstanden
- Entscheidung: Docker-First → `start_be` / `start_fe` entfallen → `backend/.env` fällt weg

## Aufgabe

### 1. `start_be` und `start_fe` aus `dev.zsh` entfernen

Datei: `scripts/shell/dev.zsh`

- Funktionen `start_be()` und `start_fe()` vollständig entfernen (inkl. Kommentar-Block)
- Header-Kommentar der Datei anpassen (kein Verweis mehr auf `start_be`)

### 2. `backend/.env` und `backend/.env.example` löschen

```bash
git rm backend/.env
git rm backend/.env.example
```

### 3. Root-`.env` zur Single Source of Truth machen

Datei: `.env` (Root, nicht committed)

Inhalt nach Umbau:

```dotenv
# gjo-se.com – Umgebungsvariablen
# Kopiere .env.example → .env und fülle echte Werte ein. Niemals committen.

# Application
APP_NAME=gjo-se.com
DEBUG=false
ENVIRONMENT=dev

# CORS – erlaubte Origins (Frontend-URL)
ALLOWED_ORIGINS=["http://localhost:5173"]

# PostgreSQL (Docker-intern: Hostname = Service-Name "db")
DATABASE_URL=postgresql+asyncpg://gjose_user:gjose_dev@db:5432/gjose
DB_PASSWORD=gjose_dev

# Auth / JWT
SECRET_KEY=change-me-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256
COOKIE_SECURE=False
```

### 4. Root-`.env.example` synchronisieren

Datei: `.env.example` (committed)

Gleicher Inhalt wie `.env`, aber Secrets als Platzhalter:

```dotenv
# gjo-se.com – Umgebungsvariablen
# Kopiere diese Datei zu .env und fülle echte Werte ein. Niemals committen.

# Application
APP_NAME=gjo-se.com
DEBUG=false
ENVIRONMENT=dev

# CORS – erlaubte Origins (Frontend-URL)
ALLOWED_ORIGINS=["http://localhost:5173"]

# PostgreSQL (Docker-intern: Hostname = Service-Name "db")
DATABASE_URL=postgresql+asyncpg://gjose_user:<your-password>@db:5432/gjose
DB_PASSWORD=<your-password>

# Auth / JWT
SECRET_KEY=<generate-a-strong-secret>
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALGORITHM=HS256
COOKIE_SECURE=False
```

### 5. `docker-compose.yml` prüfen

Datei: `docker-compose.yml`

`env_file: .env` bleibt unverändert – Root-`.env` ist jetzt vollständig.
Keine Anpassung nötig, nur sicherstellen dass kein zweiter `env_file`-Eintrag
auf `backend/.env` zeigt.

### 6. README bereinigen

Datei: `README.md`

- `start_be` und `start_fe` aus der Befehlstabelle entfernen
- Verweis in der Ordnerstruktur (`scripts/shell/ ← Shell-Funktionen (gf_task, start_be ...)`)
  aktualisieren auf `(gf_task, start_docker ...)`

### 7. `frontend/.env` prüfen

Datei: `frontend/.env` (nicht committed)

Bleibt unverändert – enthält nur `VITE_API_BASE_URL=http://localhost:8000`.
Vite brennt `VITE_*`-Variablen zur Build-Zeit ins Bundle – das ist kein
Runtime-Kontext, sondern Build-Konfiguration.

### 8. Docker-Stack testen

```bash
start_docker --rebuild
```

Manuell prüfen:
- `http://localhost:5173/register` → Registrierung erfolgreich
- `http://localhost:5173/login` → Login setzt Cookie
- `http://localhost:5173/me` → Dashboard sichtbar
- `http://localhost:8000/docs` → Swagger-UI erreichbar

## Akzeptanzkriterien

- [ ] `start_be` und `start_fe` existieren nicht mehr in `dev.zsh`
- [ ] `backend/.env` und `backend/.env.example` sind aus dem Repo entfernt (`git rm`)
- [ ] Root-`.env` enthält alle Variablen (APP, CORS, DB, Auth)
- [ ] Root-`.env.example` ist mit Root-`.env` synchron (Platzhalter statt echter Werte)
- [ ] `docker compose up` startet fehlerfrei
- [ ] CORS-Preflight `OPTIONS /api/v1/auth/register` gibt `200` zurück
- [ ] Register + Login + `/me` funktionieren im Browser
- [ ] `npm run build` fehlerfrei
- [ ] `uv run pytest` fehlerfrei
- [ ] README: keine Verweise mehr auf `start_be` / `start_fe`

## Constraints

- `frontend/.env` und `frontend/.env.example` werden **nicht** angefasst
- `docker-compose.override.yml` wird **nicht** angefasst
- Keine neuen Variablen einführen – nur umstrukturieren
- Commit-Message: `Refactor: consolidate env config to single root .env (Docker-First)`
- Branch: `feature/ISSUE-<nr>` (GitFlow)
