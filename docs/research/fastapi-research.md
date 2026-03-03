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

## Quellen

- ✅ [FastAPI Dokumentation](https://fastapi.tiangolo.com) (Stand März 2026)
- ✅ [uv Dokumentation](https://docs.astral.sh/uv/) (Stand März 2026)
- ✅ [FastAPI GitHub](https://github.com/tiangolo/fastapi) (Stand März 2026)
- ✅ [Pydantic v2 Docs](https://docs.pydantic.dev/latest/) (Stand März 2026)
- 💡 Sterne-Angaben sind Richtwerte, können abweichen
