# Plan: Projekt-Grundgerüst für gjo-se.com aufbauen

Das Projekt startet bei Null – nur Dokumentation ist vorhanden. Der Plan baut das Gerüst in 10 logisch aufeinanderfolgenden Phasen auf: zuerst Projektstruktur und Python-Umgebung, dann Backend-Boilerplate mit Datenbank-Setup, anschließend Frontend, CI/CD und Docker. Jede Phase erzeugt eigenständig commitfähige Ergebnisse.

---

## Phase 1 – Projektstruktur anlegen #28

Erstelle die gesamte Ordnerhierarchie (ohne Inhalte) als erstes Commit auf `feature/project-scaffold`.

Zielstruktur:
```
backend/
  app/
    api/
      v1/
        routers/
    core/
    db/
    models/
    schemas/
    services/
  tests/
    unit/
    integration/
frontend/
  src/
    components/
    pages/
    hooks/
    services/
.github/
  workflows/
```

**Schritt:** `.gitkeep`-Dateien in alle leeren Verzeichnisse legen, damit Git sie trackt.

---

## Phase 2 – Python-Umgebung & `pyproject.toml`

Initialisiere das Projekt mit **uv** als Package-Manager (SOTA 2026, 10–100× schneller als pip/Poetry, vollständig kompatibel mit `pyproject.toml`):

```bash
uv init backend
cd backend
uv add "fastapi[standard]" sqlalchemy alembic "pydantic[email]" pydantic-settings aiosqlite asyncpg
uv add --dev pytest pytest-asyncio httpx ruff black pyright pre-commit
```

Kernabhängigkeiten (`[project.dependencies]`):
- `python = ">=3.12"`
- `fastapi[standard]`, `uvicorn[standard]`
- `sqlalchemy`, `alembic`
- `pydantic[email]` (v2), `pydantic-settings` (ersetzt `python-dotenv`)
- `aiosqlite` (dev/test), `asyncpg` (Produktion)

Dev-Abhängigkeiten (`[dependency-groups.dev]`):
- `pytest`, `pytest-asyncio`, `httpx`
- `ruff`, `black`, `pyright`
- `pre-commit`

Konfigurationsblöcke in `pyproject.toml`:
- `[tool.ruff]` – line-length 88, alle relevanten Rule-Sets (`E`, `F`, `I`, `UP`)
- `[tool.black]` – line-length 88
- `[tool.pytest.ini_options]` – `testpaths = ["tests"]`, `asyncio_mode = "auto"`
- `[tool.pyright]` – `pythonVersion = "3.12"`, `strict = true`

---

## Phase 3 – pre-commit Konfiguration

Erstelle [`.pre-commit-config.yaml`](../../.pre-commit-config.yaml) im Root-Verzeichnis.

Hooks in dieser Reihenfolge:
1. **`pre-commit-hooks`** – `trailing-whitespace`, `end-of-file-fixer`, `check-yaml`, `check-json`
2. **`ruff`** – `ruff check --fix` + `ruff format --check`
3. **`black`** – `black --check`
4. **`pytest`** – `uv run pytest --tb=short` (nur auf `backend/`-Dateien)

---

## Phase 4 – FastAPI Boilerplate

Erstelle die folgenden Dateien in `backend/app/`:

| Datei | Inhalt |
|---|---|
| [`backend/app/main.py`](../../backend/app/main.py) | `FastAPI`-Instanz, CORS-Middleware, Router-Registrierung, Lifespan-Handler |
| [`backend/app/core/config.py`](../../backend/app/core/config.py) | `Settings`-Klasse mit Pydantic `BaseSettings` – liest `.env`, enthält `APP_NAME`, `DEBUG`, `DATABASE_URL`, `ENVIRONMENT` |
| [`backend/app/core/logging.py`](../../backend/app/core/logging.py) | Zentrales Logging-Setup mit `logging.config.dictConfig` |
| [`backend/app/api/v1/routers/health.py`](../../backend/app/api/v1/routers/health.py) | `GET /health` – Liveness-Check-Endpunkt (gibt `{"status": "ok"}` zurück) |
| [`backend/app/api/v1/router.py`](../../backend/app/api/v1/router.py) | Zentraler `APIRouter`, inkludiert alle v1-Subrouter |
| [`backend/.env.example`](../../backend/.env.example) | Template für Umgebungsvariablen – **kein** `.env` ins Git |

---

## Phase 5 – SQLAlchemy + Alembic Setup

Erstelle die Datenbankschicht in `backend/app/db/`:

| Datei | Inhalt |
|---|---|
| [`backend/app/db/base.py`](../../backend/app/db/base.py) | `DeclarativeBase`-Klasse als SQLAlchemy-Basisklasse |
| [`backend/app/db/session.py`](../../backend/app/db/session.py) | `AsyncEngine`, `AsyncSessionLocal`, `get_db`-Dependency (FastAPI) |
| [`backend/app/db/base_model.py`](../../backend/app/db/base_model.py) | Abstrakte `BaseModel`-Klasse mit `id`, `created_at`, `updated_at` |

Alembic initialisieren:
- `alembic init backend/alembic` → erzeugt `alembic.ini` + `alembic/env.py`
- `alembic/env.py` anpassen: `DATABASE_URL` aus `Settings` laden, `target_metadata` auf `Base.metadata` zeigen
- Erste Migration erstellen: `alembic revision --autogenerate -m "initial"`

`.env.example` enthält: `DATABASE_URL=sqlite+aiosqlite:///./dev.db` für lokale Entwicklung.

---

## Phase 6 – pytest Konfiguration & erstes Test-Beispiel

Erstelle in `backend/tests/`:

| Datei | Inhalt |
|---|---|
| [`backend/tests/conftest.py`](../../backend/tests/conftest.py) | `AsyncClient`-Fixture mit In-Memory-SQLite (`sqlite+aiosqlite:///:memory:`), DB-Schema-Setup per `create_all` |
| [`backend/tests/unit/test_health.py`](../../backend/tests/unit/test_health.py) | Unit-Test für `GET /health` – erwartet `200` + `{"status": "ok"}` |

Alle Tests laufen mit `pytest-asyncio` im `asyncio_mode = "auto"`. Kein `pass` in Tests – echter Assert-Inhalt.

---

## Phase 7 – React + TypeScript + Tailwind Frontend

Im `frontend/`-Verzeichnis:

1. **Initialisierung** mit `npm create vite@latest . -- --template react-ts`
2. **Tailwind CSS** installieren: `npm install -D tailwindcss @tailwindcss/vite` und in `vite.config.ts` als Plugin einbinden
3. **Tailwind-Import** in [`frontend/src/index.css`](../../frontend/src/index.css): `@import "tailwindcss";`
4. Aufräumen: Standard-Vite-Boilerplate aus `App.tsx` entfernen, durch minimales Gerüst (`<main>`) ersetzen
5. [`frontend/.env.example`](../../frontend/.env.example) anlegen mit `VITE_API_BASE_URL=http://localhost:8000`

---

## Phase 8 – GitHub Actions CI/CD Pipeline

Erstelle [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) mit zwei Jobs:

**Job `backend-ci`** (trigger: `push` + `pull_request` auf alle Branches):
1. Checkout + Python 3.12 setup
2. `uv` installieren + Abhängigkeiten cachen (`uv sync`)
3. `ruff check backend/` + `black --check backend/`
4. `uv run pytest backend/tests/ --tb=short --cov=app`

**Job `frontend-ci`** (parallel zu `backend-ci`):
1. Checkout + Node.js 20 setup
2. `npm ci` im `frontend/`-Verzeichnis
3. `npm run build`

Kein Deployment-Job in dieser Phase – nur Linting + Tests + Build-Check.

---

## Phase 9 – Docker Setup

Erstelle zwei Dockerfiles und eine Compose-Datei:

| Datei | Inhalt |
|---|---|
| [`backend/Dockerfile`](../../backend/Dockerfile) | Multi-stage: `builder`-Stage installiert Dependencies via `uv sync`; `runtime`-Stage nur mit `venv` – kein uv in Produktion |
| [`frontend/Dockerfile`](../../frontend/Dockerfile) | `node:20-alpine` für Build, `nginx:alpine` für statisches Serving |
| [`docker-compose.yml`](../../docker-compose.yml) | Services: `backend` (Port 8000), `frontend` (Port 3000), `db` (PostgreSQL 16) mit Volume; `.env`-Datei wird gemountet |
| [`docker-compose.override.yml`](../../docker-compose.override.yml) | Dev-Overrides: `volumes`-Mount für Hot-Reload, SQLite statt Postgres |

Secrets kommen aus `.env` (niemals hardcoded).

---

## Phase 10 – README.md erweitern

Erweitere [`README.md`](../../README.md) um folgende Abschnitte:
- **Projektübersicht** – Tech-Stack-Tabelle
- **Quickstart** – lokales Setup in 5 Schritten (Clone → venv → pre-commit install → `uvicorn` starten → Frontend starten)
- **Projektstruktur** – annotierter Verzeichnisbaum
- **Environments** – Tabelle `dev / test / prod` mit Branch-Mapping
- **Weitere Dokumentation** – bestehende Links beibehalten + neue ergänzen

---

## Offene Entscheidungen

1. **Async vs. Sync SQLAlchemy:** Der Plan nutzt `AsyncSession` + `aiosqlite`/`asyncpg`. Falls du synchrones SQLAlchemy bevorzugst (einfacher Einstieg), wäre Phase 5 anzupassen – `AsyncEngine` entfällt, `get_db` wird einfacher.
2. **Package-Manager:** ✅ **Entschieden: uv** – SOTA 2026, 10–100× schneller als pip/Poetry, vollständig kompatibel mit `pyproject.toml`. Details: `docs/research/fastapi-research.md`.
3. **Feature-Branch-Strategie:** Der Plan kann als ein großer `feature/project-scaffold`-Branch umgesetzt werden, oder jede Phase bekommt einen eigenen Branch (sauberer History, mehr PR-Overhead).
4. wie kann ich das in eine Routine bringen um es per **1klick** wiederholbar machen
