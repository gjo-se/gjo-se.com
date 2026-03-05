# gjo-se.com — Fullstack Projekt-Setup

Fullstack-Webprojekt mit FastAPI-Backend, React-Frontend und PostgreSQL – containerisiert mit Docker, automatisiert mit GitHub Actions.

---

## Tech-Stack

| Bereich | Technologie |
|---|---|
| Backend | Python 3.12, FastAPI, SQLAlchemy 2.0, Alembic, Pydantic v2 |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Datenbank | PostgreSQL 16 (Produktion / lokal), SQLite in-memory (Unit-Tests) |
| Package Manager | uv (Backend), npm (Frontend) |
| Testing | pytest, pytest-asyncio, httpx AsyncClient |
| CI/CD | GitHub Actions |
| Containerisierung | Docker, Docker Compose, OrbStack |

---

## Quickstart

### A) Mit Docker (empfohlen)

```bash
git clone https://github.com/gjo-se/gjo-se.com.git
cd gjo-se.com

cp .env.example .env          # .env befüllen (DB_PASSWORD setzen)

start_docker                  # alle Services starten + Migrations automatisch prüfen
# oder direkt:
docker compose up --build     # erstes Mal (mit Build)
docker compose up             # danach (nutzt Layer-Cache)

# Migrations manuell prüfen und einspielen (wird von start_docker automatisch aufgerufen):
run_migrations                # prüft ob neue Migrations vorhanden sind
run_migrations --force        # immer ausführen
```

| URL | Service |
|---|---|
| http://localhost:8000/api/v1/health | FastAPI Health-Check |
| http://localhost:3000 | React-Frontend |

### PyCharm – Datenbankverbindung

PostgreSQL läuft im Docker-Container und ist auf `localhost:5432` erreichbar.

`PyCharm → Database (rechte Seitenleiste) → + → PostgreSQL`

| Feld | Wert |
|---|---|
| Host | `localhost` |
| Port | `5432` |
| Database | `gjose` |
| User | `gjose_user` |
| Password | Wert aus `.env` (`DB_PASSWORD`) |

> Bei Port-Konflikt mit lokalem PostgreSQL: `"5433:5432"` in `docker-compose.yml` setzen und Port `5433` in PyCharm verwenden.

### B) Ohne Docker (manuell)

```bash
# Backend
cd backend
uv sync
uv run uvicorn app.main:app --reload
# → http://localhost:8000

# Frontend (neues Terminal)
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

Voraussetzung: PostgreSQL läuft lokal und `DATABASE_URL` in `backend/.env` ist gesetzt.

---

## Projektstruktur

```
gjo-se.com/
├── backend/
│   ├── app/
│   │   ├── api/v1/routers/   ← FastAPI-Router (health etc.)
│   │   ├── core/             ← Config (pydantic-settings), Logging
│   │   ├── db/               ← SQLAlchemy Base, Session, Migrations
│   │   ├── models/           ← ORM-Modelle
│   │   ├── schemas/          ← Pydantic-Schemas (Request/Response)
│   │   └── services/         ← Business-Logik
│   ├── alembic/              ← Migrations
│   └── tests/
│       ├── unit/             ← pytest, AsyncClient, In-Memory-SQLite
│       └── integration/      ← pytest gegen PostgreSQL
├── frontend/
│   └── src/
│       ├── components/       ← React-Komponenten
│       ├── hooks/            ← Custom Hooks
│       ├── pages/            ← Seiten / Routen
│       └── services/         ← API-Calls (fetch/axios)
├── .github/workflows/        ← CI-Pipeline (backend-ci + frontend-ci)
├── docs/
│   ├── epics/                ← Epic-Pläne + Research
│   ├── research/             ← Technologie-Recherchen
│   ├── roles/                ← Rollen-Definitionen (SAM, REX, ARI ...)
│   └── runbooks/             ← Git-Workflow, GitHub Projects, Sourcetree
├── scripts/shell/            ← Shell-Funktionen (gf_task, start_be ...)
├── docker-compose.yml        ← Produktions-Konfiguration
├── docker-compose.override.yml ← Dev-Overrides (Hot-Reload)
└── .env.example              ← Template für Umgebungsvariablen
```

---

## Environments

| Umgebung | Branch | Datenbank | Zweck |
|---|---|---|---|
| `dev` | `develop` | PostgreSQL (Docker) | lokale Entwicklung |
| `test` | `release/*` | PostgreSQL | Integrations- und Regressionstests |
| `prod` | `main` | PostgreSQL | Produktiv-Deployment |

> Code landet niemals direkt auf `main` – immer über PR mit Review.

---

## Nützliche Befehle

Shell-Funktionen aus `scripts/shell/` – einmalig in `~/.zshrc` einbinden:

```bash
source ~/path/to/gjo-se.com/scripts/shell/imports.zsh
```

| Befehl | Beschreibung |
|---|---|
| `start_docker` | Docker Compose starten + Migrations automatisch prüfen |
| `run_migrations` | Alembic Migrations prüfen und einspielen (`--force` zum Erzwingen) |
| `start_be` | FastAPI Dev-Server starten (Port 8000) |
| `start_fe` | Vite Dev-Server starten (Port 5173) |
| `gf_task <nr>` | Feature-Branch + Commit + Push + PR in einem Schritt |
| `gf_merge <pr-nr>` | PR mergen + Branch aufräumen |
| `gf_cleanup` | Alle gemergten lokalen Branches löschen |
| `gf_idea "<titel>"` | Rohidee als GitHub Issue anlegen (Label: idea) |

---

## Weiterführende Dokumentation

| Dokument | Beschreibung |
|---|---|
| [AGENTS.md](AGENTS.md) | Rollen-Definitionen (SAM, REX, ARI, PIA etc.) |
| [docs/runbooks/git/git-flow.md](docs/runbooks/git/git-flow.md) | GitFlow-Workflow |
| [docs/runbooks/git/github-issues.md](docs/runbooks/git/github-issues.md) | Issues anlegen mit `ghic` |
| [docs/runbooks/git/github-projects.md](docs/runbooks/git/github-projects.md) | GitHub Projects: Board, Automationen |
| [docs/runbooks/git/sourcetree-setup.md](docs/runbooks/git/sourcetree-setup.md) | Sourcetree: Remote, GitFlow-Integration |
| [docs/research/release.md](docs/_works/release.md) | Release-Workflow: GitFlow, Versionierung, CHANGELOG |
| [docs/epics/project_scaffold/docker-research.md](docs/epics/project_scaffold/docker-research.md) | Docker Setup: Warum, Was, Wie |
| [docs/research/ci-cd-research.md](docs/research/ci-cd-research.md) | GitHub Actions CI/CD: Warum, Was, Wie |
