# Research: FastAPI Modularisierung – SOTA

> Projekt: gjo-se.com
> Erstellt: 2026-03-07
> Rolle: REX

---

## Das Problem: Verstreuter Code bei horizontaler Schichtung

Der Auth-Prompt (2h.1) verteilt den Auth-Code über viele Ordner:

```
app/
├── models/user.py
├── schemas/auth.py
├── repositories/user_repository.py
├── services/auth_service.py
├── core/security.py
└── api/v1/endpoints/auth.py
```

Das ist der klassische **Horizontal Slice** (auch: Layer-basierte Struktur).
Jede Schicht bekommt einen eigenen Ordner – unabhängig vom Feature.

**Problem:** Wenn man den Auth-Code in ein neues Projekt kopieren will,
muss man in 6 verschiedenen Ordnern Dateien heraussuchen.
Wenn man verstehen will "Was macht Auth?", muss man durch 6 Ordner navigieren.

---

## Die zwei Ansätze im Vergleich

### Ansatz A: Horizontal Slice (Layer-basiert) – aktuell geplant

```
app/
├── models/
│   ├── user.py          ← Auth
│   └── product.py       ← Shop
├── schemas/
│   ├── auth.py          ← Auth
│   └── product.py       ← Shop
├── repositories/
│   ├── user_repository.py    ← Auth
│   └── product_repository.py ← Shop
├── services/
│   ├── auth_service.py       ← Auth
│   └── product_service.py    ← Shop
└── api/v1/endpoints/
    ├── auth.py               ← Auth
    └── products.py           ← Shop
```

**Vorteile:**
- Vertraute Struktur (Django, Laravel, klassisches MVC)
- Einfach am Anfang, wenn das Projekt klein ist

**Nachteile:**
- Auth-Code über 6 Ordner verteilt → schwer zu extrahieren
- "Was gehört zu Auth?" ist nicht auf den ersten Blick erkennbar
- Wächst das Projekt, wird jeder Ordner unübersichtlich

---

### Ansatz B: Vertical Slice (Feature-basiert) – SOTA

```
app/
├── auth/
│   ├── __init__.py
│   ├── router.py        ← FastAPI Router
│   ├── models.py        ← SQLAlchemy Modelle
│   ├── schemas.py       ← Pydantic Schemas
│   ├── repository.py    ← DB-Zugriff
│   ├── service.py       ← Geschäftslogik
│   ├── security.py      ← JWT, bcrypt
│   └── dependencies.py  ← get_current_user, Permissions
├── products/
│   ├── __init__.py
│   ├── router.py
│   ├── models.py
│   ├── schemas.py
│   └── ...
├── core/                ← Projekt-weite Infrastruktur (NICHT feature-spezifisch)
│   ├── config.py        ← Settings
│   ├── logging.py       ← Logging-Setup
│   └── database.py      ← Session, Base
└── main.py              ← App-Factory, Router einbinden
```

**Vorteile:**
- Auth-Code → ein Ordner → leicht extrahierbar (copy-paste-Modul!)
- "Was gehört zu Auth?" → sofort erkennbar
- Feature kann eigenständig entwickelt, getestet und versioniert werden
- Skaliert gut: neue Features = neuer Ordner, kein Anfassen bestehender Ordner
- Entspricht dem Prinzip der **High Cohesion** (zusammengehöriger Code zusammen)

**Nachteile:**
- Leichte Lernkurve wenn man aus Django/Laravel kommt
- Gemeinsam genutzte Klassen (z.B. `BaseModel`) müssen in `core/` oder `db/` leben

---

## SOTA in FastAPI-Projekten (Stand 2026)

Die Community hat sich klar in Richtung **Vertical Slice** bewegt.

**Belege:**
- [FastAPI Best Practices](https://github.com/zhanymkanov/fastapi-best-practices) (10k+ Stars):
  → Empfiehlt explizit Feature-basierte Struktur
- `fastapi-users` (die populärste Auth-Library für FastAPI):
  → Ist selbst als Vertical Slice aufgebaut
- Tiangolo (FastAPI-Autor) in offiziellen Beispielen:
  → Größere Beispiele nutzen Feature-Module

---

## Hybride Variante: SOTA für dieses Projekt (Empfehlung)

Vollständig Vertical Slice – aber mit klarer `core/`-Schicht für Projekt-Infrastruktur:

```
app/
├── auth/                    ← Feature-Modul (komplett eigenständig)
│   ├── __init__.py
│   ├── router.py            ← FastAPI APIRouter
│   ├── models.py            ← User, EmailVerification, PasswordReset
│   ├── schemas.py           ← RegisterRequest, LoginResponse, UserOut, ...
│   ├── repository.py        ← user_repo, email_verification_repo, password_reset_repo
│   ├── service.py           ← register(), login(), verify_email(), ...
│   ├── security.py          ← hash_password(), verify_password(), create_token(), get_current_user()
│   └── dependencies.py      ← Dependency-Injection: require_auth, require_admin
│
├── core/                    ← Projekt-weite Infrastruktur (kein Feature-Code)
│   ├── config.py            ← Settings (alle ENV-Variablen)
│   ├── logging.py           ← Logging-Setup
│   └── exceptions.py        ← Gemeinsame HTTP-Exceptions (optional)
│
├── db/                      ← DB-Infrastruktur (kein Feature-Code)
│   ├── base.py              ← DeclarativeBase
│   ├── base_model.py        ← Gemeinsames BaseModel (id, created_at, updated_at)
│   └── session.py           ← AsyncSession, get_db Dependency
│
├── api/
│   └── v1/
│       └── router.py        ← Sammelt alle Feature-Router: auth, products, ...
│
└── main.py                  ← App-Factory
```

**Was ändert sich gegenüber dem ursprünglichen Prompt (2h.1)?**

| Prompt 2h.1 (Horizontal) | Empfehlung (Vertical) |
|---|---|
| `app/models/user.py` | `app/auth/models.py` |
| `app/schemas/auth.py` | `app/auth/schemas.py` |
| `app/repositories/user_repository.py` | `app/auth/repository.py` |
| `app/services/auth_service.py` | `app/auth/service.py` |
| `app/core/security.py` | `app/auth/security.py` |
| `app/api/v1/endpoints/auth.py` | `app/auth/router.py` |

`core/` behält nur Projekt-weiten Code (config, logging) – kein Feature-Code.

---

## Wie wird ein Feature-Modul in main.py eingebunden?

```python
# app/api/v1/router.py
from fastapi import APIRouter
from app.auth.router import router as auth_router
from app.products.router import router as products_router

api_router = APIRouter()
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(products_router, prefix="/products", tags=["products"])
```

```python
# app/main.py
from app.api.v1.router import api_router
app.include_router(api_router, prefix="/api/v1")
```

Neues Feature hinzufügen:
1. Neuen Ordner `app/neues_feature/` anlegen
2. `router.py` im neuen Ordner anlegen
3. Eine Zeile in `api/v1/router.py` ergänzen
4. `main.py` bleibt unberührt

---

## Wie funktioniert die Wiederverwendbarkeit?

### Copy-Paste (einfachste Variante)

```bash
# Auth-Modul in neues Projekt kopieren
cp -r gjo-se.com/backend/app/auth/ neues-projekt/backend/app/auth/

# Dann in neues-projekt/backend/app/api/v1/router.py:
from app.auth.router import router as auth_router
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
```

Das funktioniert, weil `app/auth/` **keine Imports aus anderen Feature-Modulen** hat –
nur aus `app/core/` und `app/db/`, die in jedem Projekt vorhanden sind.

### Abhängigkeitsregel (zwingend einhalten)

```
✅ auth/     → darf importieren: core/, db/
✅ products/ → darf importieren: core/, db/, auth/ (z.B. get_current_user)
❌ auth/     → darf NICHT importieren: products/ (keine Kreuzabhängigkeiten!)
❌ core/     → darf NICHT importieren: auth/, products/
```

Diese Regel macht das Modul extrahierbar.

---

## Konsequenz für den Auth-Prompt (2h.1)

Der Prompt 2h.1 sollte angepasst werden:
- Struktur auf **Vertical Slice** umstellen (`app/auth/` statt verteilt)
- `core/security.py` → `app/auth/security.py`
- `core/` behält nur `config.py` und `logging.py`

**Empfehlung:** Prompt 2h.1 vor der Umsetzung von ARI aktualisieren lassen.

---

## Zusammenfassung

| | Horizontal Slice | Vertical Slice |
|---|---|---|
| Code-Organisation | Nach Schicht | Nach Feature |
| Auth extrahierbar? | ❌ 6 Ordner durchsuchen | ✅ 1 Ordner kopieren |
| Skalierung | ⚠️ Ordner wachsen | ✅ neuer Ordner pro Feature |
| SOTA 2026 | ⚠️ Veraltet für größere Projekte | ✅ Community-Standard |
| Lernkurve | Niedrig | Niedrig (wenn einmal verstanden) |
