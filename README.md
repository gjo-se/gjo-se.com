# gjo-se.com — Fullstack Projekt-Setup

> **Tech-Stack:** FastAPI · Next.js · Tailwind CSS · uv · Pydantic · Ruff · Pyright · pytest · Docker · GitHub Actions · GitFlow

---

## Inhaltsverzeichnis

1. [Projektstruktur](#1-projektstruktur)
2. [Voraussetzungen](#2-voraussetzungen)
3. [Schritt-für-Schritt-Setup](#3-schritt-für-schritt-setup)
   - [3.1 Repository & GitFlow](#31-repository--gitflow)
   - [3.2 Backend (FastAPI + uv)](#32-backend-fastapi--uv)
   - [3.3 Frontend (Next.js + Tailwind)](#33-frontend-nextjs--tailwind)
   - [3.4 Docker (Multi-Stage)](#34-docker-multi-stage)
   - [3.5 Tooling & Code-Qualität](#35-tooling--code-qualität)
   - [3.6 pre-commit Hooks](#36-pre-commit-hooks)
   - [3.7 CI/CD mit GitHub Actions](#37-cicd-mit-github-actions)
   - [3.8 MCP-Integration](#38-mcp-integration)
4. [Konfigurationsdateien](#4-konfigurationsdateien)
5. [GitFlow Branch-Strategie](#5-gitflow-branch-strategie)
6. [Umgebungen (dev / test / prod)](#6-umgebungen-dev--test--prod)

---

## 1. Projektstruktur

```
gjo-se.com/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                  # Lint, Type-Check, Tests (alle Branches)
│   │   ├── cd-staging.yml          # Deploy → Staging (develop-Branch)
│   │   └── cd-production.yml       # Deploy → Prod (release-Tag)
│   └── CODEOWNERS
│
├── backend/                        # FastAPI-Anwendung
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # App-Instanz & Router-Registrierung
│   │   ├── core/
│   │   │   ├── config.py           # Pydantic BaseSettings (env-basiert)
│   │   │   └── security.py         # Auth-Helpers (JWT, Hashing)
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── router.py       # APIRouter für v1
│   │   │   │   └── endpoints/      # Je ein Modul pro Ressource
│   │   │   └── deps.py             # Dependency-Injection Factories
│   │   ├── models/                 # Pydantic Request-/Response-Schemas
│   │   ├── services/               # Business-Logik
│   │   └── db/
│   │       ├── base.py             # SQLAlchemy Base / DB-Session
│   │       └── migrations/         # Alembic-Migrationen
│   ├── tests/
│   │   ├── conftest.py             # pytest Fixtures
│   │   ├── unit/
│   │   └── integration/
│   ├── Dockerfile                  # Multi-Stage: uv-Builder → Alpine Runtime
│   ├── pyproject.toml              # uv-Manifest: Deps, Ruff, Pyright, pytest
│   └── pyrightconfig.json
│
├── frontend/                       # Next.js-Anwendung
│   ├── src/
│   │   ├── app/                    # Next.js App Router (Layouts, Pages)
│   │   ├── components/             # Wiederverwendbare React-Komponenten
│   │   ├── lib/                    # API-Client, Hilfsfunktionen
│   │   └── types/                  # TypeScript-Typen / API-Interfaces
│   ├── public/                     # Statische Assets
│   ├── Dockerfile                  # Multi-Stage: Node Builder → Nginx Runtime
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── infra/
│   └── docker/
│       └── nginx.conf              # Reverse-Proxy-Konfiguration
│
├── scripts/                        # Entwickler-Hilfsskripte
│
├── .pre-commit-config.yaml         # Hooks: Ruff, Pyright, ESLint, Prettier
├── docker-compose.yml              # Lokale Entwicklungsumgebung
├── docker-compose.test.yml         # Isolierte Testumgebung
├── .env.example                    # Vorlage für Umgebungsvariablen
├── .gitignore
├── .editorconfig
└── README.md
```

---

## 2. Voraussetzungen

Folgende Tools müssen lokal installiert sein:

| Tool | Mindestversion | Installationsbefehl | Prüfen | Status (21.02.2026) |
|---|---|---|---|---|
| Python | 3.12 (Projekt) | _(via uv, siehe Hinweis unten)_ | `uv run python --version` | ✅ 3.12.12 via uv · 3.14.2 als PyCharm-Interpreter |
| uv | latest | `curl -LsSf https://astral.sh/uv/install.sh \| sh` | `uv --version` | ✅ 0.10.4 |
| Node.js | ≥ 22 LTS | `brew install node` | `node --version` | ✅ 25.6.1 (aktueller als LTS, kompatibel) |
| npm | ≥ 10 | _(kommt mit Node.js)_ | `npm --version` | ✅ 11.9.0 |
| Docker Desktop | latest | [docker.com](https://www.docker.com/products/docker-desktop/) | `docker --version` | ✅ 28.2.2 |
| Git | ≥ 2.x | `brew install git` | `git --version` | ✅ 2.39.5 |
| git-flow | latest | `brew install git-flow` | `git flow version` | ✅ 0.4.1 ⚠️ deprecated → Ersatz: `brew install git-flow-next` |
| pre-commit | latest | `uv tool install pre-commit` | `pre-commit --version` | ✅ 4.5.1 (PATH via `~/.zshrc` gesetzt) |
| PyCharm | Professional | [jetbrains.com](https://www.jetbrains.com/pycharm/) | _(GUI-App)_ | ✅ |

> **Legende:** ✅ installiert & OK · ⚠️ installiert, Update empfohlen · ❌ fehlt noch

> **🐍 Python-Versionsstrategie:**
> Auf dem System sind mehrere Python-Versionen installiert. Für dieses Projekt gilt:
>
> | Kontext | Version | Begründung |
> |---|---|---|
> | **Projekt / uv / Docker** | **3.12.12** | Stabile LTS-Version, vollständig unterstützt von FastAPI, SQLAlchemy, Pydantic. Von uv lokal verwaltet → kein separater Download nötig. |
> | **PyCharm IDE-Interpreter** | 3.14.2 | Kann beibehalten werden für IDE-Features; **nicht** als Laufzeit-Interpreter des Projekts verwenden, da 3.14 noch Beta (kein stabiles Release). |
> | **System `python3`** | 3.11.9 | Nicht anfassen — wird von macOS-Tools benötigt. |
>
> `uv init --python 3.12` stellt sicher, dass das Projekt immer mit 3.12 läuft, unabhängig vom System-Python.

---

## 3. Schritt-für-Schritt-Setup

### 3.1 Repository & GitFlow

```bash
# 1. Repository klonen / initialisieren
git clone https://github.com/gjo-se/gjo-se.com.git
cd gjo-se.com

# 2. GitFlow initialisieren (Defaults bestätigen: main / develop)
git flow init

# 3. develop-Branch pushen
git push -u origin develop
```

**GitHub konfigurieren:**
- `main` und `develop` als Protected Branches setzen
- Branch-Protection-Rules: *Require PR + CI-Grün + 1 Approval*
- GitHub Project erstellen: Columns `Backlog → In Progress → Review → Done`

---

### 3.2 Backend (FastAPI + uv)

```bash
# 1. Backend-Verzeichnis anlegen und uv-Projekt initialisieren
mkdir -p backend && cd backend
uv init --python 3.12

# 2. Produktionsabhängigkeiten hinzufügen
uv add fastapi "uvicorn[standard]" pydantic "pydantic-settings" sqlalchemy alembic

# 3. Entwicklungsabhängigkeiten hinzufügen
uv add --dev pytest pytest-asyncio pytest-cov httpx ruff pyright

# 4. Virtuelle Umgebung aktivieren (PyCharm erkennt .venv automatisch)
source .venv/bin/activate

# 5. FastAPI-Skeleton anlegen
mkdir -p app/core app/api/v1/endpoints app/models app/services app/db/migrations tests/unit tests/integration
touch app/__init__.py app/main.py app/core/config.py app/core/security.py
touch app/api/v1/router.py app/api/deps.py
touch tests/conftest.py

cd ..
```

**`backend/app/main.py`** (minimales Skeleton):
```python
from fastapi import FastAPI
from app.api.v1.router import router as api_v1_router

app = FastAPI(title="gjo-se.com API", version="0.1.0")
app.include_router(api_v1_router, prefix="/api/v1")


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
```

**`backend/app/core/config.py`** (Pydantic Settings):
```python
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "gjo-se.com"
    environment: str = "development"  # development | test | production
    debug: bool = False
    database_url: str = "postgresql+asyncpg://user:password@localhost:5432/gjose"
    secret_key: str = "change-me-in-production"


settings = Settings()
```

---

### 3.3 Frontend (Next.js + Tailwind)

```bash
# Next.js mit TypeScript, Tailwind und App Router initialisieren
npx create-next-app@latest frontend \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*"

cd frontend

# Abhängigkeiten installieren (bereits durch create-next-app erledigt)
npm install
```

**Verzeichnisstruktur ergänzen:**
```bash
mkdir -p src/components src/lib src/types
touch src/lib/api-client.ts src/types/index.ts
```

---

### 3.4 Docker (Multi-Stage)

**`backend/Dockerfile`** — Stufe 1: uv baut das Wheel · Stufe 2: minimales Alpine-Runtime-Image:
```dockerfile
# ── Stage 1: Builder ──────────────────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /app

# uv installieren
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Abhängigkeiten installieren und Wheel bauen
COPY pyproject.toml uv.lock* ./
RUN uv sync --frozen --no-dev

COPY app ./app
RUN uv build --wheel --out-dir /dist

# ── Stage 2: Runtime (Alpine – minimale Attack-Surface) ───────
FROM python:3.12-alpine AS runtime

WORKDIR /app

# Wheel aus Builder-Stage kopieren und installieren
COPY --from=builder /dist/*.whl /tmp/
RUN pip install --no-cache-dir /tmp/*.whl && rm /tmp/*.whl

# Non-root User für Sicherheit
RUN adduser -D appuser
USER appuser

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**`frontend/Dockerfile`** — Stufe 1: Node Builder · Stufe 2: Nginx Alpine:
```dockerfile
# ── Stage 1: Builder ──────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 2: Runtime (Nginx Alpine) ───────────────────────────
FROM nginx:alpine AS runtime

COPY --from=builder /app/.next/static /usr/share/nginx/html/_next/static
COPY infra/docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**`docker-compose.yml`** — Lokale Entwicklungsumgebung:
```yaml
services:
  backend:
    build:
      context: ./backend
      target: builder          # Hot-Reload im Dev-Mode
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/app
    env_file: .env
    depends_on:
      - postgres

  frontend:
    build:
      context: ./frontend
      target: builder
    command: npm run dev
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    env_file: .env

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: gjose
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Lokale Umgebung starten:**
```bash
# .env aus Vorlage erstellen
cp .env.example .env

# Alle Services starten
docker compose up --build

# Nur Backend neu bauen
docker compose up --build backend
```

---

### 3.5 Tooling & Code-Qualität

**`backend/pyproject.toml`** (relevante Abschnitte):
```toml
[project]
name = "gjo-se-backend"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.115",
    "uvicorn[standard]>=0.30",
    "pydantic>=2.7",
    "pydantic-settings>=2.3",
    "sqlalchemy>=2.0",
    "alembic>=1.13",
]

[dependency-groups]
dev = [
    "pytest>=8.0",
    "pytest-asyncio>=0.24",
    "pytest-cov>=5.0",
    "httpx>=0.27",
    "ruff>=0.5",
    "pyright>=1.1",
]

[tool.ruff]
line-length = 120
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B", "SIM"]
fixable = ["ALL"]

[tool.ruff.lint.per-file-ignores]
"tests/**" = ["S101"]

[tool.pyright]
pythonVersion = "3.12"
typeCheckingMode = "strict"
venvPath = "."
venv = ".venv"

[tool.pytest.ini_options]
testpaths = ["tests"]
asyncio_mode = "auto"
addopts = "--cov=app --cov-report=term-missing --cov-fail-under=80"
```

**`backend/pyrightconfig.json`**:
```json
{
  "pythonVersion": "3.12",
  "typeCheckingMode": "strict",
  "venvPath": ".",
  "venv": ".venv",
  "include": ["app"],
  "exclude": ["tests"]
}
```

**Ruff & Pyright manuell ausführen:**
```bash
cd backend

# Linting + Auto-Fix
uv run ruff check . --fix

# Formatierung
uv run ruff format .

# Type-Checking
uv run pyright

# Tests mit Coverage
uv run pytest
```

---

### 3.6 pre-commit Hooks

**`.pre-commit-config.yaml`** (Projekt-Root):
```yaml
repos:
  # ── Python: Ruff (Linting + Formatting) ──────────────────────
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.5.0
    hooks:
      - id: ruff
        args: [--fix]
        files: ^backend/
      - id: ruff-format
        files: ^backend/

  # ── Python: Pyright (Type-Checking) ──────────────────────────
  - repo: local
    hooks:
      - id: pyright
        name: pyright
        language: system
        entry: bash -c 'cd backend && uv run pyright'
        pass_filenames: false
        files: ^backend/.*\.py$

  # ── Frontend: Prettier ────────────────────────────────────────
  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v4.0.0-alpha.8
    hooks:
      - id: prettier
        files: ^frontend/
        types_or: [javascript, jsx, ts, tsx, css, json, markdown]

  # ── Allgemein ─────────────────────────────────────────────────
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-merge-conflict
      - id: check-added-large-files
        args: [--maxkb=500]
```

**Hooks installieren:**
```bash
# pre-commit global installieren (falls noch nicht geschehen)
uv tool install pre-commit

# Hooks im Repository registrieren
pre-commit install

# Alle Hooks einmalig auf dem gesamten Codebase ausführen
pre-commit run --all-files
```

---

### 3.7 CI/CD mit GitHub Actions

**`.github/workflows/ci.yml`** — Läuft auf jedem Push und PR:
```yaml
name: CI

on:
  push:
    branches: ["**"]
  pull_request:
    branches: [main, develop]

jobs:
  backend-quality:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend

    steps:
      - uses: actions/checkout@v4

      - name: uv installieren
        uses: astral-sh/setup-uv@v4
        with:
          enable-cache: true

      - name: Python-Version setzen
        run: uv python install 3.12

      - name: Abhängigkeiten installieren
        run: uv sync --frozen

      - name: Ruff Lint
        run: uv run ruff check .

      - name: Ruff Format Check
        run: uv run ruff format --check .

      - name: Pyright Type-Check
        run: uv run pyright

      - name: pytest mit Coverage
        run: uv run pytest

  frontend-quality:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend

    steps:
      - uses: actions/checkout@v4

      - name: Node.js installieren
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Abhängigkeiten installieren
        run: npm ci

      - name: ESLint
        run: npm run lint

      - name: TypeScript Type-Check
        run: npm run type-check

      - name: Build
        run: npm run build
```

**`.github/workflows/cd-staging.yml`** — Deploy auf Staging (develop-Branch):
```yaml
name: CD Staging

on:
  push:
    branches: [develop]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment: staging

    steps:
      - uses: actions/checkout@v4

      - name: Docker Login
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Backend Docker-Image bauen & pushen
        uses: docker/build-push-action@v6
        with:
          context: ./backend
          push: true
          tags: ghcr.io/${{ github.repository }}/backend:staging

      - name: Frontend Docker-Image bauen & pushen
        uses: docker/build-push-action@v6
        with:
          context: ./frontend
          push: true
          tags: ghcr.io/${{ github.repository }}/frontend:staging

      # Hier: Deployment-Schritt (SSH, Kubernetes, Render, etc.)
```

**`.github/workflows/cd-production.yml`** — Deploy auf Prod (Release-Tag):
```yaml
name: CD Production

on:
  push:
    tags:
      - "v*.*.*"

jobs:
  deploy-production:
    runs-on: ubuntu-latest
    environment: production      # Manueller Approval in GitHub erforderlich

    steps:
      - uses: actions/checkout@v4

      - name: Docker Login
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Backend-Image bauen & pushen
        uses: docker/build-push-action@v6
        with:
          context: ./backend
          push: true
          tags: |
            ghcr.io/${{ github.repository }}/backend:latest
            ghcr.io/${{ github.repository }}/backend:${{ github.ref_name }}

      - name: Frontend-Image bauen & pushen
        uses: docker/build-push-action@v6
        with:
          context: ./frontend
          push: true
          tags: |
            ghcr.io/${{ github.repository }}/frontend:latest
            ghcr.io/${{ github.repository }}/frontend:${{ github.ref_name }}

      # Hier: Produktions-Deployment-Schritt
```

---

### 3.8 MCP-Integration

GitHub MCP ermöglicht KI-gestütztes Issue- und PR-Management direkt aus der IDE oder aus Claude Desktop.

**`.mcp.json`** im Projekt-Root:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<dein-token>"
      }
    }
  }
}
```

**Einsatzmöglichkeiten:**
- Automatisch Issues aus fehlgeschlagenen CI-Runs erstellen
- PR-Beschreibungen generieren lassen
- Release-Notes aus Commit-History zusammenfassen

---

## 4. Konfigurationsdateien

| Datei | Zweck |
|---|---|
| `backend/pyproject.toml` | uv-Projektmanifest: Deps, Ruff, Pyright, pytest |
| `backend/pyrightconfig.json` | Pyright Strict Mode |
| `.pre-commit-config.yaml` | Git-Hooks: Ruff, Pyright, Prettier, allgemeine Checks |
| `docker-compose.yml` | Lokale Entwicklungsumgebung |
| `docker-compose.test.yml` | Isolierte CI/Test-Umgebung |
| `.env.example` | Vorlage für alle Umgebungsvariablen |
| `.github/workflows/ci.yml` | CI: Lint, Type-Check, Tests |
| `.github/workflows/cd-staging.yml` | CD: Staging-Deploy auf `develop`-Push |
| `.github/workflows/cd-production.yml` | CD: Prod-Deploy auf Release-Tag |
| `.mcp.json` | GitHub MCP Server Konfiguration |

---

## 5. GitFlow Branch-Strategie

```
main          ← Nur Production-Releases (geschützt, kein direkter Push)
  └── develop ← Integrations-Branch, Basis für Features (geschützt)
        ├── feature/ISSUE-123-user-auth      ← PR → develop
        ├── bugfix/ISSUE-456-fix-login        ← PR → develop
        ├── release/1.2.0                     ← PR → main + develop
        └── hotfix/ISSUE-789-security-patch   ← PR → main + develop
```

**Workflow-Beispiel neues Feature:**
```bash
# Feature-Branch erstellen
git flow feature start user-authentication

# ... entwickeln, committen ...

# Feature fertigstellen (Merge → develop)
git flow feature finish user-authentication

# Release erstellen
git flow release start 1.0.0
git flow release finish 1.0.0   # Merged → main + develop, erstellt Tag v1.0.0

# Hotfix
git flow hotfix start security-patch
git flow hotfix finish security-patch
```

---

## 6. Umgebungen (dev / test / prod)

| Variable | development | test | production |
|---|---|---|---|
| `ENVIRONMENT` | `development` | `test` | `production` |
| `DEBUG` | `true` | `false` | `false` |
| `DATABASE_URL` | lokale Postgres | In-Memory / Test-DB | Managed DB |
| `SECRET_KEY` | beliebig | fix (für Tests) | starkes Secret (Vault) |

**`.env.example`**:
```env
# App
ENVIRONMENT=development
DEBUG=true
SECRET_KEY=change-me-in-development

# Datenbank
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/gjose

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Pydantic Settings wählt automatisch die richtige `.env`-Datei:
```python
# In config.py kann je nach ENVIRONMENT eine andere .env-Datei geladen werden
model_config = SettingsConfigDict(
    env_file=f".env.{os.getenv('ENVIRONMENT', 'development')}",
    env_file_encoding="utf-8"
)
```

---

> **Nächste Schritte:** Sobald die Struktur steht, können die einzelnen Module
> (Auth, DB-Layer, API-Endpunkte, Frontend-Pages) iterativ über Feature-Branches
> hinzugefügt werden. Jeder Schritt wird durch CI automatisch geprüft.
