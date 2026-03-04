# FastAPI – Research & Best Practices

> **REX-Research** | Stand: März 2026 | Sprache: Deutsch
> Gesicherte Fakten sind als ✅ markiert, Einschätzungen als 💡.

---

## Zusammenfassung

FastAPI ist das **SOTA Python-Framework für REST APIs** (Stand März 2026).
Es kombiniert automatische API-Dokumentation, Typ-Sicherheit via Pydantic v2 und native Async-Unterstützung in einem modernen, produktionsreifen Paket.

**Empfehlung für gjo-se.com:** ✅ FastAPI ist die richtige Wahl – für dieses Projekt und darüber hinaus auch für Enterprise AI/ML-Projekte.

---

## 1. Was ist FastAPI – Überblick

✅ FastAPI ist ein modernes, asynchrones Python Web-Framework, das auf **Starlette** (ASGI) und **Pydantic v2** aufbaut.

| Merkmal | Details |
|---|---|
| **Erstveröffentlichung** | 2018 (Sebastián Ramírez) |
| **Aktuelle Version** | 0.115.x (März 2026) |
| **GitHub Stars** | ~80.000+ ✅ (eines der meistgenutzten Python-Projekte) |
| **Lizenz** | MIT |
| **Basis** | Starlette (ASGI) + Pydantic v2 |
| **Python-Version** | 3.8+ (empfohlen: 3.12+) |

### Was es kann ✅

- Automatische OpenAPI-Dokumentation (Swagger UI + ReDoc) out-of-the-box
- Vollständige Typ-Sicherheit: Request/Response-Validierung via Pydantic v2
- Native async/await-Unterstützung (ASGI)
- Dependency Injection System (eingebaut, leistungsstark)
- WebSocket-Unterstützung
- Background Tasks
- OAuth2 / JWT-Integration (via Bibliotheken)
- Automatisches JSON-Serialisierung/Deserialisierung
- Path-, Query-, Header-, Cookie-Parameter – alles type-annotiert

### Was es NICHT kann ❌

- Kein eingebautes ORM (SQLAlchemy separat)
- Kein eingebautes Auth-System (Bibliotheken nötig)
- Kein Template-Rendering (kein Jinja2 out-of-the-box, aber integrierbar)
- Kein Job-Scheduler (Celery / APScheduler separat)
- Kein eingebautes Caching (Redis separat)
- Kein Admin-Panel out-of-the-box (SQLAdmin als Community-Lösung)

---

## 2. Installation – uv vs. Poetry vs. pip

### Empfehlung: uv (SOTA 2026) ✅

`uv` ist der neue Standard-Package-Manager in der Python-Community (von Astral, den Ruff-Machern). **Extrem schnell** (10–100× schneller als pip/Poetry), vollständig kompatibel mit `pyproject.toml`.

```bash
# uv installieren (macOS)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Neues Projekt anlegen
uv init backend
cd backend

# FastAPI installieren
uv add "fastapi[standard]"          # fastapi + uvicorn + httpx + python-multipart
uv add sqlalchemy alembic "pydantic[email]" python-dotenv aiosqlite asyncpg

# Dev-Dependencies
uv add --dev pytest pytest-asyncio httpx ruff black pyright pre-commit

# Virtuelle Umgebung aktivieren (wird automatisch erstellt)
source .venv/bin/activate

# Server starten
uv run uvicorn app.main:app --reload
```
### Frontend (Node/npm) – Berücksichtigung beim Backend-Setup

Das Frontend (React + TypeScript + Tailwind) hat **keinen Einfluss** auf die Python-Installation.
Die Verzeichnisse `backend/` und `frontend/` sind vollständig voneinander getrennt.

```
gjo-se.com/
  backend/      ← Python / uv / pyproject.toml
  frontend/     ← Node / npm / package.json
```

✅ Beide können unabhängig installiert und gestartet werden.
✅ `docker-compose.yml` verbindet beide Services im Deployment.
❌ Kein gemeinsames Package-Management nötig oder sinnvoll.

---

## 3. SOTA Projektstruktur (März 2026)

Die Community hat sich auf eine **Feature-basierte Struktur** geeinigt – nicht nach Layer (nicht: alle Models in einem Ordner), sondern nach Domäne:

```
backend/
├── app/
│   ├── main.py                  ← FastAPI-Instanz, Lifespan, Middleware
│   ├── api/
│   │   └── v1/
│   │       ├── router.py        ← Zentraler v1-Router
│   │       └── routers/
│   │           ├── health.py    ← GET /health
│   │           ├── users.py     ← Benutzer-Endpunkte
│   │           └── items.py     ← Beispiel-Domäne
│   ├── core/
│   │   ├── config.py            ← Settings via Pydantic BaseSettings
│   │   ├── logging.py           ← Zentrales Logging-Setup
│   │   └── security.py          ← JWT, Passwort-Hashing
│   ├── db/
│   │   ├── base.py              ← DeclarativeBase
│   │   ├── base_model.py        ← Abstrakte Basisklasse (id, timestamps)
│   │   └── session.py           ← AsyncEngine, get_db Dependency
│   ├── models/                  ← SQLAlchemy ORM-Modelle
│   │   └── user.py
│   ├── schemas/                 ← Pydantic-Schemas (Request/Response)
│   │   └── user.py
│   ├── services/                ← Business Logic (keine DB-Logik in Routers)
│   │   └── user_service.py
│   └── repositories/            ← Optionale DB-Abstraktionsschicht
│       └── user_repository.py
├── alembic/                     ← DB-Migrationen
│   ├── env.py
│   └── versions/
├── tests/
│   ├── conftest.py              ← Fixtures, AsyncClient, Test-DB
│   ├── unit/
│   └── integration/
├── pyproject.toml               ← Abhängigkeiten + Tool-Config
├── .env.example                 ← Template (nie .env ins Git!)
└── Dockerfile
```

### Alternativ: Domain-Driven (für größere Projekte)

```
app/
  users/
    router.py
    models.py
    schemas.py
    service.py
  items/
    router.py
    ...
```

💡 **Empfehlung für gjo-se.com:** Die Layer-Struktur (wie im Plan) ist für ein mittelgroßes Projekt gut geeignet. Domain-Driven ab ~5+ Domänen sinnvoll.

---

## 4. Projekt-Grundgerüst – Minimales Boilerplate

### `backend/app/main.py`

```python
"""FastAPI application entry point."""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.logging import setup_logging


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan handler: startup and shutdown logic."""
    setup_logging()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")
```

### `backend/app/core/config.py`

```python
"""Application configuration via Pydantic BaseSettings."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Central application configuration loaded from environment variables."""

    APP_NAME: str = "gjo-se.com"
    DEBUG: bool = False
    ENVIRONMENT: str = "dev"
    DATABASE_URL: str = "sqlite+aiosqlite:///./dev.db"
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"


settings = Settings()
```

### `backend/app/api/v1/routers/health.py`

```python
"""Health check endpoint."""

from fastapi import APIRouter

router = APIRouter(tags=["health"])

HEALTH_STATUS_OK = "ok"


@router.get("/health")
async def health_check() -> dict[str, str]:
    """Liveness check – returns ok if the service is running."""
    return {"status": HEALTH_STATUS_OK}
```

### `backend/tests/conftest.py`

```python
"""Shared pytest fixtures for the test suite."""

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.db.base import Base
from app.db.session import get_db
from app.main import app

TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="session")
async def async_engine():
    """Create in-memory SQLite engine for tests."""
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest.fixture
async def db_session(async_engine):
    """Provide a transactional database session per test."""
    async_session = sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        yield session


@pytest.fixture
async def client(db_session):
    """Provide an async HTTP test client with DB override."""
    app.dependency_overrides[get_db] = lambda: db_session
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()
```

---

## 5. pyproject.toml (uv-basiert, SOTA 2026)

```toml
[project]
name = "gjo-se-backend"
version = "0.1.0"
description = "gjo-se.com Backend API"
requires-python = ">=3.12"
dependencies = [
    "fastapi[standard]>=0.115",
    "uvicorn[standard]>=0.30",
    "sqlalchemy>=2.0",
    "alembic>=1.13",
    "pydantic[email]>=2.0",
    "pydantic-settings>=2.0",
    "python-dotenv>=1.0",
    "aiosqlite>=0.20",
    "asyncpg>=0.29",
]

[dependency-groups]
dev = [
    "pytest>=8.0",
    "pytest-asyncio>=0.23",
    "httpx>=0.27",
    "ruff>=0.4",
    "black>=24.0",
    "pyright>=1.1",
    "pre-commit>=3.7",
]

[tool.ruff]
line-length = 88
select = ["E", "F", "I", "UP", "B", "SIM"]
ignore = []

[tool.black]
line-length = 88
target-version = ["py312"]

[tool.pytest.ini_options]
testpaths = ["tests"]
asyncio_mode = "auto"

[tool.pyright]
pythonVersion = "3.12"
typeCheckingMode = "strict"
```

---

## 6. pre-commit Konfiguration (`.pre-commit-config.yaml`)

### Was ist pre-commit? ✅

`pre-commit` ist ein Framework, das **Git Hooks automatisch verwaltet** – also Skripte, die vor einem `git commit` ausgeführt werden. Es stellt sicher, dass kein Code committet wird, der Lint-Fehler, Formatierungsprobleme oder fehlschlagende Tests enthält.

| Merkmal | Details |
|---|---|
| **Erstveröffentlichung** | 2014 |
| **Aktuell (März 2026)** | v3.7.x ✅ |
| **GitHub Stars** | ~13.000+ |
| **SOTA?** | ✅ Ja – Industriestandard in Python-Projekten |
| **Sprache** | Python (aber hooks können beliebige Tools sein) |
| **Funktion** | Git-Hook-Manager – konfiguriert `.pre-commit-config.yaml` |

**Workflow:**
```
git commit → pre-commit läuft → alle Hooks OK? → Commit wird durchgeführt
                                              ✗ → Commit wird abgebrochen, Fehler werden angezeigt
```

**Installation & Aktivierung:**
```bash
uv add --dev pre-commit
pre-commit install          # registriert den Hook in .git/hooks/pre-commit
pre-commit run --all-files  # manuell alle Dateien einmalig prüfen
```

---

### Hook 1: `pre-commit-hooks` – Allgemeine Datei-Hygiene ✅

**Repo:** `https://github.com/pre-commit/pre-commit-hooks`
**Maintainer:** pre-commit-Team (offiziell)
**SOTA?** ✅ Ja – Basis-Hooks, die in nahezu jedem Python-Projekt verwendet werden

Diese Sammlung bietet kleine, unabhängige Datei-Checks ohne externe Tool-Abhängigkeiten.

| Hook-ID | Was er tut | Warum nötig |
|---|---|---|
| `trailing-whitespace` | Entfernt Leerzeichen am Zeilenende | Verhindert sinnlose Diffs in Git |
| `end-of-file-fixer` | Stellt sicher, dass Dateien mit einem Newline enden | POSIX-Standard, verhindert Editor-Inkonsistenzen |
| `check-yaml` | Validiert YAML-Syntax | Fehlkonfigurationen in `.github/`, `docker-compose.yml` etc. sofort erkennen |
| `check-json` | Validiert JSON-Syntax | Verhindert invalide Config-Dateien |
| `check-merge-conflict` | Erkennt ungelöste Merge-Konflikte (`<<<<<<`) | Verhindert, dass Konflikt-Marker aus Versehen committet werden |

💡 Diese Hooks sind **sprach-agnostisch** und laufen auf allen Dateien im Repo – nicht nur Python.

---

### Hook 2: `ruff` – Linter & Formatter (SOTA 2026) ✅

**Repo:** `https://github.com/astral-sh/ruff-pre-commit`
**Maintainer:** Astral (dieselben wie `uv`)
**SOTA?** ✅ **Ja – ruff hat Flake8, isort und teils Black als Standard ersetzt**

`ruff` ist ein **extrem schneller Python Linter und Formatter**, geschrieben in Rust.

| Merkmal | Details |
|---|---|
| **Geschwindigkeit** | 10–100× schneller als Flake8/pylint |
| **Regeln** | 700+ Lint-Regeln (Flake8, isort, pyupgrade, bugbear, ...) |
| **GitHub Stars** | ~35.000+ (März 2026) ✅ |
| **Formatter** | `ruff format` – Black-kompatibel (seit v0.2) |
| **Ersetzt** | Flake8, isort, pyupgrade, pep8-naming, flake8-bugbear |

**Die zwei ruff-Hooks im Detail:**

```yaml
- id: ruff
  args: [--fix]      # ← Linter: findet und behebt automatisch fixbare Probleme
- id: ruff-format    # ← Formatter: formatiert Code (Black-kompatibel)
```

| Hook | Rolle | Aktion |
|---|---|---|
| `ruff` (Linter) | Findet Code-Probleme, Stil-Verletzungen, Imports | `--fix` behebt automatisch fixbare Issues |
| `ruff-format` | Formatiert Code-Stil (Einrückung, Quotes, Zeilenlänge) | Kein Argument nötig – formatiert in-place |

**Konfiguration in `pyproject.toml`:**
```toml
[tool.ruff]
line-length = 88
select = ["E", "F", "I", "UP", "B", "SIM"]
# E = pycodestyle errors
# F = pyflakes (undefined names, unused imports)
# I = isort (Import-Sortierung)
# UP = pyupgrade (moderne Python-Syntax)
# B = flake8-bugbear (häufige Bugs und Design-Probleme)
# SIM = flake8-simplify (unnötige Komplexität)
```

---

### Hook 3: `black` – Opinionated Python Formatter ✅

**Repo:** `https://github.com/psf/black`
**Maintainer:** PSF (Python Software Foundation)
**SOTA?** ⚠️ **Wird zunehmend durch `ruff format` ersetzt – aber noch weit verbreitet**

`black` ist der **"uncompromising" Python Code Formatter**. Es gibt keine Konfigurationsmöglichkeiten für den Stil – einheitliches Format für alle.

| Merkmal | Details |
|---|---|
| **Erstveröffentlichung** | 2018 |
| **GitHub Stars** | ~40.000+ (März 2026) |
| **Stil** | Opinionated – kaum konfigurierbar (nur `line-length`) |
| **Ziel** | "End the debate about formatting" – ein einheitlicher Stil für alle Python-Projekte |
| **Kompatibilität** | `ruff format` ist zu ~99% Black-kompatibel |

**Verhältnis ruff ↔ Black:**

```
ruff format ≈ Black (nahezu identisches Output)
```

💡 **Warum beide?** In diesem Setup läuft `ruff` zuerst (Linting + Formatting), `black` danach als finale Sicherheitsnetz. In neuen Projekten kann `black` entfernt werden, wenn `ruff format` verwendet wird – aber die Kombination ist in der Community noch verbreitet.

| Aspekt | Black | ruff format |
|---|---|---|
| **Geschwindigkeit** | Mittel | 10–100× schneller |
| **Stabilität** | ✅ Sehr stabil, seit Jahren | ✅ Stabil seit v0.2 |
| **Konfig** | Minimal | Identisch zu Black |
| **Empfehlung 2026** | 💡 Optional, wenn ruff bereits läuft | ✅ Bevorzugt |

---

### Hook 4: `pytest` (local hook) – Test-Suite vor dem Commit ✅

**Framework:** `https://pytest.org`
**SOTA?** ✅ **Ja – Pytest ist der Industriestandard für Python-Tests**

```yaml
- repo: local
  hooks:
    - id: pytest
      name: pytest
      entry: uv run pytest backend/tests/ --tb=short -q
      language: system
      pass_filenames: false
      always_run: false
      files: ^backend/
```

| Parameter | Bedeutung |
|---|---|
| `repo: local` | Kein externes Repo – läuft direkt im lokalen Projekt |
| `entry: uv run pytest ...` | Führt pytest über uv aus (nutzt die venv des Projekts) |
| `--tb=short` | Kurze Traceback-Ausgabe bei Fehlern (lesbar, nicht zu lang) |
| `-q` | Quiet-Modus – nur Fehler werden ausführlich ausgegeben |
| `pass_filenames: false` | Übergibt keine Dateinamen an den Befehl (pytest entscheidet selbst) |
| `always_run: false` | Hook läuft nur, wenn Dateien im `backend/`-Verzeichnis geändert wurden |
| `files: ^backend/` | Regex: Hook wird nur ausgelöst, wenn Backend-Dateien betroffen sind |

**pytest – Überblick:**

| Merkmal | Details |
|---|---|
| **GitHub Stars** | ~12.000+ (März 2026) |
| **Plugins** | 1.500+ im PyPI (`pytest-asyncio`, `pytest-cov`, `pytest-mock`, ...) |
| **Async-Support** | via `pytest-asyncio` |
| **Fixtures** | Leistungsstarkes Dependency-Injection-System für Tests |

---

### Zusammenfassung: SOTA-Bewertung der Hooks

| Hook / Tool | SOTA? | Ersatz möglich durch | Empfehlung für gjo-se.com |
|---|---|---|---|
| `pre-commit-hooks` | ✅ Ja | – (kein sinnvoller) | ✅ Beibehalten |
| `ruff` (Linter) | ✅ Ja, SOTA 2026 | Flake8 (veraltet) | ✅ Beibehalten |
| `ruff-format` | ✅ Ja, SOTA 2026 | Black (noch üblich) | ✅ Beibehalten |
| `black` | ⚠️ Auslaufend | `ruff format` | 💡 Kann entfernt werden, wenn ruff-format aktiv |
| `pytest` | ✅ Ja, Industriestandard | – | ✅ Beibehalten |

💡 **Empfehlung:** `black` als separaten Hook mittelfristig entfernen – `ruff format` übernimmt dessen Rolle vollständig. Bis dahin schadet die Kombination nicht, da beide dasselbe Output erzeugen.

---

### Vollständige `.pre-commit-config.yaml` für gjo-se.com

```yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-json
      - id: check-merge-conflict

  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.4.0
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format

  - repo: https://github.com/psf/black
    rev: 24.4.2
    hooks:
      - id: black

  - repo: local
    hooks:
      - id: pytest
        name: pytest
        entry: uv run pytest backend/tests/ --tb=short -q
        language: system
        pass_filenames: false
        always_run: false
        files: ^backend/
```

---

## 7. Alternativen zu FastAPI

| Framework | Sprache | Stärken | Schwächen | Empfehlung |
|---|---|---|---|---|
| **Django + DRF** | Python | Batteries-included, Admin, ORM | Schwerfällig, wenig Async | Für CMS/Content-lastige Apps |
| **Flask** | Python | Einfach, flexibel | Kein Async, manuelle Validierung | Für sehr kleine APIs |
| **Litestar** | Python | Noch schneller als FastAPI, strenger typisiert | Kleinere Community | Interessante Alternative |
| **Hono** | TypeScript | Extrem schnell, Edge-ready | Kein Python | Wenn FE-Team das Backend übernimmt |
| **NestJS** | TypeScript | Enterprise-ready, strukturiert | Lernkurve | Wenn Team TypeScript-first ist |
| **Express** | JavaScript | Etabliert, riesige Community | Kein Typ-System | Legacy-Projekte |

💡 **Fazit:** FastAPI ist 2026 für Python-APIs die klare Empfehlung. Litestar ist die einzige ernstzunehmende Alternative im Python-Raum.

---

## 8. Für welche Projektarten geeignet?

| Projektart | Geeignet? | Begründung |
|---|---|---|
| **REST API (Fullstack)** | ✅ Perfekt | Genau der Kernfall |
| **Microservices** | ✅ Sehr gut | Leichtgewichtig, schnell deploybar |
| **AI/ML Inference API** | ✅ Sehr gut | Nativ async, ideal für Model-Serving |
| **GraphQL** | ⚠️ Möglich | Strawberry-Integration vorhanden, aber nicht der Fokus |
| **Realtime (Chat, Live)** | ✅ Gut | WebSocket-Support eingebaut |
| **Admin-Backends** | ⚠️ Eingeschränkt | SQLAdmin als Zusatz nötig |
| **CMS / Content-lastig** | ❌ Nicht ideal | Django besser geeignet |
| **CLI-Tools** | ❌ Nein | Typer (vom selben Autor) ist besser |

---

## 9. FastAPI für Enterprise AI/ML – Empfehlung

✅ **Ja – FastAPI ist SOTA für AI/ML-APIs.** Begründung:

| Aspekt | FastAPI-Vorteil |
|---|---|
| **Model Serving** | Async-Endpoints für parallele Inferenz-Anfragen, kein Blocking |
| **Pydantic v2** | Strikte Validierung von ML-Inputs (Feature-Vektoren, Batch-Requests) |
| **OpenAPI auto-docs** | Data Scientists können die API direkt testen ohne Frontend |
| **Dependency Injection** | Model-Loading einmalig im Lifespan, via DI in Endpoints injiziert |
| **Streaming** | `StreamingResponse` für LLM-Token-Streaming out-of-the-box |
| **Produktionsreife** | Läuft bei Uber, Microsoft, Netflix, Netflix, Hugging Face intern |

### Typisches AI/ML-Pattern mit FastAPI

```python
# Model einmalig beim Start laden – nicht bei jedem Request
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    app.state.model = load_model("model.pkl")  # einmalig
    yield
    del app.state.model

# In Endpoints via Request-State nutzen
@router.post("/predict")
async def predict(request: Request, payload: PredictRequest) -> PredictResponse:
    model = request.app.state.model
    result = model.predict(payload.features)
    return PredictResponse(prediction=result)
```

💡 **Einschränkung:** Für GPU-intensive Inferenz (z.B. große LLMs) empfiehlt sich **TorchServe**, **Triton Inference Server** oder **vLLM** als spezialisierte Serving-Layer – FastAPI bleibt dann der API-Gateway davor.

---

## 10. Module – Standard vs. Community

### Standard (offizielle FastAPI-Empfehlung) ✅

| Modul | Zweck | Installation |
|---|---|---|
| `fastapi[standard]` | FastAPI + Uvicorn + Extras | `uv add "fastapi[standard]"` |
| `pydantic[email]` | Validierung + Email-Support | inkl. in standard |
| `sqlalchemy` | ORM (async) | `uv add sqlalchemy` |
| `alembic` | DB-Migrationen | `uv add alembic` |
| `pydantic-settings` | Settings via `.env` | `uv add pydantic-settings` |
| `python-jose` | JWT-Token | `uv add python-jose[cryptography]` |
| `passlib` | Passwort-Hashing | `uv add passlib[bcrypt]` |
| `httpx` | Async HTTP-Client + Test-Client | `uv add httpx` |

### Community-Module (aktiv gepflegt, empfehlenswert) ✅

| Modul | Zweck | Stars | Empfehlung |
|---|---|---|---|
| `fastapi-users` | Auth komplett (Register, Login, JWT, OAuth2) | ~4k | ✅ Für Projekte mit User-Management |
| `sqlmodel` | SQLAlchemy + Pydantic in einem (vom FastAPI-Autor) | ~14k | 💡 Für einfache Projekte |
| `SQLAdmin` | Admin-Panel für SQLAlchemy-Modelle | ~2k | ✅ Wenn Admin nötig |
| `celery` | Background Jobs / Task Queue | ~24k | ✅ Standard für async Tasks |
| `fastapi-cache2` | Response-Caching (Redis/Memory) | ~1k | ✅ Für Performance |
| `slowapi` | Rate Limiting | ~1k | ✅ Für produktive APIs |
| `loguru` | Einfacheres Logging als stdlib | ~20k | 💡 Alternative zu logging-Modul |
| `sentry-sdk` | Error Tracking | – | ✅ Für Produktion |
| `prometheus-fastapi-instrumentator` | Metrics / Observability | ~1k | ✅ Für Enterprise |

### Community-Stärke ✅

FastAPI hat eine **sehr aktive Community** (Stand März 2026):
- ~80.000 GitHub Stars – Top 5 der Python-Projekte
- 500+ Contributors
- Wöchentliche Releases
- Offizielle Tutorials auf fastapi.tiangolo.com
- Aktiver Discord-Server
- Starke Präsenz auf Stack Overflow, Reddit (r/Python, r/FastAPI)

---

## 11. Frontend-Stack beim Backend-Setup berücksichtigen?

**Kurze Antwort: Nein – aber CORS und `.env` ja.**

| Aspekt | Berücksichtigen? | Was konkret |
|---|---|---|
| **CORS** | ✅ Ja | `allow_origins=["http://localhost:3000"]` in `main.py` |
| **API-Prefix** | ✅ Ja | `/api/v1/` als Konvention – Frontend kennt den Prefix |
| **`.env.example`** | ✅ Ja | `ALLOWED_ORIGINS` dokumentieren |
| **npm/Node** | ❌ Nein | Völlig getrennte Verzeichnisse und Toolchains |
| **Tailwind/React** | ❌ Nein | Kein Einfluss auf Python-Umgebung |
| **Shared Types** | 💡 Optional | OpenAPI-Schema → TypeScript-Typen generieren via `openapi-typescript` |

💡 **Profi-Tipp:** FastAPI generiert automatisch ein OpenAPI-Schema (`/openapi.json`). Mit `openapi-typescript` können daraus direkt TypeScript-Typen für das React-Frontend generiert werden – **keine manuelle Synchronisation** von API-Typen nötig.

```bash
# Im frontend/-Verzeichnis
npx openapi-typescript http://localhost:8000/openapi.json -o src/api/schema.d.ts
```

---

## Empfehlung für gjo-se.com (Zusammenfassung)

| Entscheidung | Empfehlung | Begründung |
|---|---|---|
| **Framework** | FastAPI ✅ | SOTA, community-stärke, Pydantic v2, async |
| **Package Manager** | `uv` statt Poetry | 10–100× schneller, zukunftssicher |
| **Projektstruktur** | Layer-basiert (wie im Plan) | Gut für Projektgröße |
| **Async SQLAlchemy** | ✅ Ja | Passt zu FastAPIs async-Natur |
| **Enterprise/AI/ML** | ✅ Geeignet | Nativ async, Pydantic-Validierung, Streaming |
| **FE beim Setup** | Nur CORS + env | Sonst vollständig getrennt |

### Anpassung am Plan (`plan-projectScaffold.prompt.md`)

Phase 2 sollte von **Poetry** auf **uv** umgestellt werden:
- `pyproject.toml` bleibt gleich (uv ist kompatibel)
- `poetry.lock` → `uv.lock`
- `poetry install` → `uv sync`
- `poetry shell` → `source .venv/bin/activate`

---

## 12. Phase 5 – SQLAlchemy + Alembic Setup

> **REX-Research** | Stand: März 2026

---

### 12.1 SOTA Python ORM-Vergleich (März 2026)

| Library | Stars (ca.) | Async? | Migrations | SOTA? | Empfehlung |
|---|---|---|---|---|---|
| **SQLAlchemy 2.0** | ~10.000 (Core-Repo) | ✅ `AsyncSession` | via Alembic | ✅ Industriestandard | ✅ Erste Wahl |
| **SQLModel** | ~14.000 | ✅ (wraps SQLAlchemy) | via Alembic | 💡 Gut für einfache Projekte | 💡 Wenn Pydantic + ORM in einer Klasse gewünscht |
| **Tortoise ORM** | ~4.500 | ✅ nativ | Aerich | ⚠️ Kleinere Community | ❌ Nicht empfohlen für neue Projekte |
| **encode/databases** | ~3.800 | ✅ nativ | keine eingebaut | ❌ Weitgehend eingestellt | ❌ Nicht verwenden |
| **Prisma (Python-Client)** | ~1.600 | ✅ | Prisma Migrate | 💡 TypeScript-First-Ansatz | ❌ Nicht Python-nativ |
| **Peewee** | ~11.000 | ❌ | eigenes System | ❌ Kein Async | ❌ Legacy |
| **Django ORM** | (Django: ~80k) | ⚠️ eingeschränkt | Django Migrations | ✅ Im Django-Ökosystem | ❌ Nicht für FastAPI |

**Fazit ✅:** SQLAlchemy 2.0 + Alembic ist 2026 der unangefochtene Standard für FastAPI-Projekte. SQLModel ist eine interessante Alternative für einfachere Domänen – nutzt intern SQLAlchemy und ist vollständig kompatibel.

---

### 12.2 SQLAlchemy 2.0 im Detail

| Merkmal | Details |
|---|---|
| **Erstveröffentlichung 2.0** | Januar 2023 |
| **GitHub Stars** | ~10.000 (das Core-Repo) |
| **Lizenz** | MIT |
| **Async-Support** | ✅ `AsyncEngine` + `AsyncSession` via `sqlalchemy.ext.asyncio` |
| **Type Hints** | ✅ Vollständig (`Mapped[T]`, `mapped_column()`) |
| **Python-Version** | 3.7+ (empfohlen: 3.12+) |

#### Was kann SQLAlchemy 2.0? ✅

- Vollständiges ORM mit `Mapped[]`-Type-Annotations (kein Casting nötig)
- Core + ORM in einem: SQL-Ausdrücke als Python, oder direkt SQL
- `AsyncSession` für non-blocking DB-Operationen (passt zu FastAPI)
- Relationship-Loading: `selectin`, `joined`, `lazy`, `subquery`
- Multi-DB-Support: PostgreSQL, MySQL, SQLite, Oracle, MSSQL
- Connection Pooling (eingebaut)
- Transactions, Savepoints, Row-Level-Locking

#### Was kann SQLAlchemy 2.0 NICHT? ❌

- Kein eingebautes Migrations-System (→ Alembic)
- Keine automatische Schema-Validierung beim Start
- `lazy`-Loading funktioniert in async-Kontexten **nicht** ohne explizites `selectin`/`joined` – häufige Fehlerquelle

#### Warum 2.0 und nicht 1.4? ✅

| Aspekt | SQLAlchemy 1.4 | SQLAlchemy 2.0 |
|---|---|---|
| **Type Hints** | Eingeschränkt, manuell | ✅ `Mapped[str]`, vollständig typsicher |
| **Async** | Beta, umständlich | ✅ Erster Bürger, stabil |
| **`select()`-Syntax** | `session.query(Model)` (deprecated) | ✅ `select(Model)` – modern, lesbar |
| **`mapped_column()`** | `Column()` (Legacy) | ✅ `mapped_column()` – typsicher |
| **Performance** | Basis | Leicht verbessert durch neue Core-Architektur |

💡 **Regel:** In neuen Projekten ausschliesslich SQLAlchemy 2.0-Syntax verwenden. `session.query()` und `Column()` sind deprecated.

---

### 12.3 Alembic im Detail

| Merkmal | Details |
|---|---|
| **Maintainer** | SQLAlchemy-Team (Mike Bayer) |
| **SOTA?** | ✅ Ja – kein ernstzunehmender Konkurrent im Python/SQLAlchemy-Raum |
| **Lizenz** | MIT |
| **Integration** | Liest SQLAlchemy-`Base.metadata` direkt |

#### Was kann Alembic? ✅

- **Autogenerate:** erkennt Modell-Änderungen automatisch (`--autogenerate`)
- Vorwärts- und Rückwärts-Migrationen (`upgrade` / `downgrade`)
- Branching-Unterstützung (mehrere parallele Migration-Heads)
- Offline-Migrationen (SQL-Skripte ohne DB-Verbindung generieren)
- Multi-DB-Support (dieselben Treiber wie SQLAlchemy)

#### Wichtige Alembic-Befehle

```bash
# Erste Initialisierung
alembic init alembic

# Migration aus Modell-Änderungen generieren
alembic revision --autogenerate -m "add user table"

# Alle ausstehenden Migrationen anwenden
alembic upgrade head

# Eine Migration zurückrollen
alembic downgrade -1

# Aktuellen DB-Stand anzeigen
alembic current

# Migrations-History
alembic history --verbose
```

#### Was autogenerate NICHT erkennt ⚠️

- Stored Procedures, Triggers, Views
- Partielle Indexes (`CREATE INDEX ... WHERE ...`)
- Sequenz-Änderungen bei bestimmten Dialekten
- Umbenennen von Tabellen/Spalten (wird als Drop + Add interpretiert → **immer manuell prüfen**)

#### Alternativen zu Alembic

| Tool | Für wen | Empfehlung |
|---|---|---|
| **Aerich** | Tortoise ORM | ❌ Nur für Tortoise |
| **Django Migrations** | Django ORM | ❌ Nicht kompatibel |
| **Liquibase** | Sprach-agnostisch, XML/YAML | ❌ Zu schwergewichtig für Python-Projekte |
| **Flyway** | JVM-basiert | ❌ Nicht Python |

✅ **Fazit:** Alembic ist die einzige sinnvolle Wahl für SQLAlchemy-Projekte.

---

### 12.4 SQLite lokal vs. PostgreSQL in Produktion – sinnvoll?

#### Die zentrale Frage ✅

Der Plan sieht vor: `aiosqlite` (SQLite) für lokale Entwicklung und Tests, `asyncpg` (PostgreSQL) für Produktion. Ist das eine gute Idee?

**Kurze Antwort:** ⚠️ **Jein – mit klarer Strategie ist es akzeptabel, aber es gibt Fallstricke.**

---

#### Risiken: SQLite ↔ PostgreSQL Dialect-Unterschiede

| Feature | SQLite | PostgreSQL | Risiko |
|---|---|---|---|
| **`JSON`-Typ** | ✅ (als Text gespeichert) | ✅ (nativer `jsonb`) | ⚠️ `jsonb`-Operatoren (`@>`, `?`) funktionieren nicht in SQLite |
| **`ARRAY`-Typ** | ❌ nicht vorhanden | ✅ nativ | ❌ SQLite-Code bricht in Postgres |
| **`ILIKE`** | ❌ (nur `LIKE` case-insensitive via `COLLATE`) | ✅ | ⚠️ Queries müssen angepasst werden |
| **`UUID`-Typ** | ✅ (als Text) | ✅ (nativ) | 💡 SQLAlchemy abstrahiert das weg |
| **Constraints (DEFERRABLE)** | ❌ eingeschränkt | ✅ | ⚠️ Komplexe FK-Constraints können abweichen |
| **`RETURNING`-Klausel** | ✅ (ab SQLite 3.35) | ✅ | 💡 OK wenn SQLite >= 3.35 |
| **Concurrent Writes** | ❌ Nur ein Writer | ✅ Multi-Writer | 💡 Kein Problem lokal, da Entwicklungsumgebung |
| **Full-Text-Search** | ⚠️ Eingeschränkt (`FTS5`) | ✅ `tsvector` | ⚠️ Unterschiedliche Implementierungen |
| **Enum-Typen** | ❌ | ✅ `CREATE TYPE` | ⚠️ SQLAlchemy emuliert Enums in SQLite als VARCHAR |
| **Schema-Unterstützung** | ❌ | ✅ | ⚠️ Keine Namespaces in SQLite |

💡 **Für gjo-se.com relevant:** JSON, UUID und Enums – diese drei sind in fast jedem Projekt im Einsatz und werden von SQLAlchemy weitgehend abstrahiert, solange keine rohen SQL-Strings oder Postgres-spezifischen Operatoren verwendet werden.

---

#### Vorteile von SQLite lokal

| Vorteil | Beschreibung |
|---|---|
| **Kein Docker nötig** | Entwicklung sofort möglich – kein `docker-compose up` |
| **Schnell** | In-Memory-SQLite für Tests: blitzschnell, kein Netzwerk |
| **Einfach** | Keine Konfiguration, keine Credentials |
| **CI-freundlich** | GitHub Actions braucht keinen Postgres-Service für Unit-Tests |

---

#### SOTA-Praxis 2026: Was machen echte Projekte?

| Ansatz | Wer macht das | Bewertung |
|---|---|---|
| **SQLite lokal, Postgres prod** | Viele Django/Flask-Projekte, kleine FastAPI-Projekte | ⚠️ Akzeptabel, aber Fallstricke beachten |
| **Postgres lokal via Docker, Postgres prod** | Enterprise-Projekte, FastAPI-Boilerplates von Tiangolo/Netflix | ✅ SOTA – keine Dialect-Überraschungen |
| **SQLite nur für Unit-Tests (in-memory), Postgres für alles andere** | ✅ Moderner Mittelweg | ✅ Empfohlen |
| **Postgres lokal via `pg_tmp` / neon.tech** | Cloud-native Entwicklung | 💡 Interessant, aber komplex |

---

#### Empfehlung für gjo-se.com ✅

**Der optimale Mittelweg:**

```
Unit-Tests      → SQLite in-memory (aiosqlite)   ← schnell, kein Docker
Integration     → PostgreSQL via Docker           ← produktionsnah
Lokale Entw.    → SQLite (aiosqlite)              ← reibungsloser Start
Produktion      → PostgreSQL (asyncpg)            ← Standard
```

| Schicht | DB | Treiber | Begründung |
|---|---|---|---|
| `pytest` Unit-Tests | SQLite `:memory:` | `aiosqlite` | Maximal schnell, kein Netzwerk |
| `pytest` Integration-Tests | Postgres (Docker) | `asyncpg` | Produktionsnah, echte Dialect-Checks |
| Lokale Entwicklung | SQLite `./dev.db` | `aiosqlite` | Kein Docker-Overhead |
| Produktion | PostgreSQL 16 | `asyncpg` | Performance, Features, SOTA |

**Regeln um Fallstricke zu vermeiden:**
1. ❌ Keine Postgres-spezifischen Typen (`ARRAY`, `jsonb`-Operatoren) in SQLAlchemy-Modellen
2. ❌ Kein rohes SQL mit Postgres-Dialekt
3. ✅ Nur SQLAlchemy-abstrahierte Typen: `String`, `Integer`, `Boolean`, `DateTime`, `JSON`, `Uuid`
4. ✅ Alembic-Migrationen **immer gegen Postgres** testen (nicht nur gegen SQLite)
5. ✅ Integration-Tests in CI laufen gegen Postgres (GitHub Actions: `services: postgres`)

---

### 12.5 aiosqlite vs. asyncpg

#### aiosqlite ✅

| Merkmal | Details |
|---|---|
| **Was ist es?** | Async-Wrapper um Python's eingebautes `sqlite3`-Modul |
| **Verwendung** | Lokale Entwicklung + Unit-Tests (in-memory) |
| **GitHub Stars** | ~900 |
| **SOTA?** | ✅ Ja – einzige sinnvolle Wahl für async SQLite |
| **Besonderheit** | Führt SQLite in einem Thread-Pool aus (SQLite ist nicht nativ async) |
| **Installation** | `uv add aiosqlite` |

```python
# DATABASE_URL für SQLite
DATABASE_URL = "sqlite+aiosqlite:///./dev.db"          # Datei
DATABASE_URL = "sqlite+aiosqlite:///:memory:"           # In-Memory (Tests)
```

#### asyncpg ✅

| Merkmal | Details |
|---|---|
| **Was ist es?** | Vollständig async PostgreSQL-Treiber – ohne `libpq` (kein `psycopg2`) |
| **Verwendung** | Produktion + Integration-Tests |
| **GitHub Stars** | ~7.500 |
| **SOTA?** | ✅ Ja – schnellster Python-PostgreSQL-Treiber |
| **Performance** | Nativ implementiert in Cython – messbar schneller als psycopg2 |
| **Installation** | `uv add asyncpg` |

```python
# DATABASE_URL für PostgreSQL
DATABASE_URL = "postgresql+asyncpg://user:password@localhost:5432/dbname"
```

#### psycopg3 als Alternative? 💡

`psycopg3` (psycopg) hat seit v3.0 (2021) ebenfalls async-Support und gilt als moderner Nachfolger von `psycopg2`. Es ist eine valide Alternative zu `asyncpg`.

| Aspekt | asyncpg | psycopg3 |
|---|---|---|
| **Async** | ✅ Nativ | ✅ (seit v3.0) |
| **Stars** | ~7.500 | ~1.700 |
| **Geschwindigkeit** | Etwas schneller | Sehr gut |
| **libpq** | ❌ kein Bedarf | ✅ nutzt libpq |
| **Empfehlung** | ✅ Bewährt | 💡 Gute Alternative |

💡 Für gjo-se.com: `asyncpg` bleibt die Empfehlung – weit verbreitet, gut dokumentiert, nahtlos mit SQLAlchemy 2.0.

---

### 12.6 Boilerplate-Code für Phase 5

#### `backend/app/db/base.py`

```python
"""SQLAlchemy declarative base for all ORM models."""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Central declarative base class.

    All ORM models must inherit from this class to be picked up
    by SQLAlchemy metadata and Alembic autogenerate.
    """
```

---

#### `backend/app/db/base_model.py`

```python
"""Abstract base model with common columns for all entities."""

from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class BaseModel(Base):
    """Abstract ORM base class providing id, created_at and updated_at.

    All domain models should inherit from this class instead of Base directly.

    Attributes:
        id: UUID primary key, auto-generated.
        created_at: Timestamp of record creation, set by the database.
        updated_at: Timestamp of last update, maintained by the database.
    """

    __abstract__ = True

    id: Mapped[UUID] = mapped_column(
        primary_key=True,
        default=uuid4,
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
```

💡 **UUID statt Integer als PK – Warum?**

| Aspekt | Integer (Autoincrement) | UUID |
|---|---|---|
| **Ratierbarkeit** | ❌ `/users/1`, `/users/2` → vorhersehbar | ✅ nicht ratierbar |
| **Merge-Sicherheit** | ❌ Kollisionen bei Multi-DB | ✅ Global eindeutig |
| **Performance** | ✅ Etwas schneller (sequenziell) | 💡 Minimal langsamer |
| **URL-Sicherheit** | ❌ Enumeration möglich | ✅ kein Information Leakage |
| **SOTA für APIs** | ❌ Veraltet | ✅ Standard 2026 |

---

#### `backend/app/db/session.py`

```python
"""Async database engine and session factory for FastAPI."""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency that provides a transactional database session.

    Yields:
        AsyncSession: An active database session that is automatically
            closed after the request completes.

    Example:
        @router.get("/items")
        async def list_items(db: AsyncSession = Depends(get_db)) -> list[Item]:
            result = await db.execute(select(Item))
            return result.scalars().all()
    """
    async with AsyncSessionLocal() as session:
        yield session
```

---

#### `backend/alembic/env.py`

```python
"""Alembic migration environment configuration."""

import asyncio
from logging.config import fileConfig

from alembic import context
from sqlalchemy.ext.asyncio import create_async_engine

from app.core.config import settings
from app.db.base import Base

# Alembic Config-Objekt – gibt Zugriff auf .ini-Werte
config = context.config

# Python-Logging aus alembic.ini konfigurieren
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Metadata aller Modelle – Autogenerate liest daraus die Änderungen
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in offline mode (ohne DB-Verbindung, erzeugt SQL-Skript).

    Nützlich um Migrationen zu reviewen oder in Umgebungen ohne DB-Zugriff
    SQL-Skripte zu generieren.
    """
    context.configure(
        url=settings.DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection):
    """Execute migrations within a synchronous connection context.

    Args:
        connection: A synchronous SQLAlchemy connection provided by the
            async engine's sync wrapper.
    """
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    """Run migrations in online mode using an async engine.

    Alembic erwartet eine synchrone Verbindung – der async Engine wird
    daher via ``run_sync`` gewrapped.
    """
    connectable = create_async_engine(settings.DATABASE_URL, future=True)

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
```

---

### 12.7 Zusammenfassung: Empfehlungen für gjo-se.com

| Entscheidung | Empfehlung | Begründung |
|---|---|---|
| **ORM** | SQLAlchemy 2.0 | ✅ SOTA, vollständige Type Hints, async |
| **Migrations** | Alembic | ✅ Einzige sinnvolle Wahl für SQLAlchemy |
| **PK-Typ** | UUID | ✅ Sicher, nicht ratierbar, API-Standard 2026 |
| **Lokal vs. Prod DB** | SQLite lokal / Postgres prod | ✅ Akzeptabel mit Dialect-Disziplin |
| **Unit-Test DB** | SQLite in-memory | ✅ Maximal schnell |
| **Integration-Test DB** | PostgreSQL (Docker) | ✅ Produktionsnah |
| **Async-Treiber lokal** | `aiosqlite` | ✅ Einzige Option für async SQLite |
| **Async-Treiber prod** | `asyncpg` | ✅ Schnellster Python-Postgres-Treiber |

---

## Quellen

- ✅ [FastAPI Dokumentation](https://fastapi.tiangolo.com) (Stand März 2026)
- ✅ [uv Dokumentation](https://docs.astral.sh/uv/) (Stand März 2026)
- ✅ [FastAPI GitHub](https://github.com/tiangolo/fastapi) (Stand März 2026)
- ✅ [Pydantic v2 Docs](https://docs.pydantic.dev/latest/) (Stand März 2026)
- ✅ [SQLAlchemy 2.0 Docs](https://docs.sqlalchemy.org/en/20/) (Stand März 2026)
- ✅ [Alembic Docs](https://alembic.sqlalchemy.org/en/latest/) (Stand März 2026)
- ✅ [asyncpg GitHub](https://github.com/MagicStack/asyncpg) (Stand März 2026)
- ✅ [aiosqlite GitHub](https://github.com/omnilib/aiosqlite) (Stand März 2026)
- 💡 Sterne-Angaben sind Richtwerte, können abweichen
