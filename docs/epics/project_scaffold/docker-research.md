# Research: Docker Setup

> Erstellt im Kontext von Phase 9 – Epic #14
> Projekt: gjo-se.com

---

## Warum Docker?

Ohne Docker gilt: „Bei mir läuft's" – auf dem Server nicht. Docker löst genau das:

| Ohne Docker | Mit Docker |
|---|---|
| Python-Version muss manuell stimmen | Container bringt eigene Python-Version mit |
| Node.js muss lokal installiert sein | Frontend-Build läuft isoliert im Container |
| PostgreSQL muss lokal laufen | `db`-Service startet per `docker compose up` |
| Deployment = manuelles Setup auf dem Server | Deployment = `docker compose up` auf dem Server |
| `.env` muss manuell übertragen werden | `.env` wird gemountet – nie im Image |
| Entwickler A hat andere Versionen als B | Alle arbeiten mit identischer Umgebung |

**Kurz:** Docker macht die gesamte Laufzeitumgebung – Python, Node, PostgreSQL – zu Code, der versioniert, geteilt und reproduzierbar deployed werden kann.

---

## Was genau entsteht in Phase 9?

Vier Dateien:

```
backend/Dockerfile
frontend/Dockerfile
docker-compose.yml           ← Produktions-Konfiguration
docker-compose.override.yml  ← Dev-Overrides (Hot-Reload, Volumes)
```

---

## backend/Dockerfile – Multi-Stage Build

```dockerfile
# Stage 1: builder
FROM python:3.12-slim AS builder
# uv installieren, Dependencies in /app/.venv installieren
# uv sync --frozen → exakt die Versionen aus uv.lock

# Stage 2: runtime
FROM python:3.12-slim AS runtime
# Nur das .venv aus dem builder kopieren – kein uv, kein pip im finalen Image
# uvicorn app.main:app starten
```

**Warum Multi-Stage?**
- `builder` enthält Build-Tools (uv, gcc etc.) → wird weggeworfen
- `runtime` ist minimal: nur Python + `.venv` + App-Code
- Ergebnis: kleines, sicheres Image (~150 MB statt ~600 MB)

**Wichtige Prinzipien:**
- Kein `uv` im Production-Image – nur das fertige `.venv`
- `uv sync --frozen` garantiert exakt die Versionen aus `uv.lock`
- `CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`
- Kein `--reload` in Produktion

---

## frontend/Dockerfile – Build + Nginx

```dockerfile
# Stage 1: build
FROM node:20-alpine AS builder
# npm ci → exakte Versionen aus package-lock.json
# npm run build → erzeugt dist/

# Stage 2: serve
FROM nginx:alpine AS runtime
# dist/ aus builder nach /usr/share/nginx/html kopieren
# nginx liefert die statischen Dateien aus
```

**Warum nginx?**
- Node.js wird zur Laufzeit nicht benötigt – `dist/` sind reine statische Dateien
- nginx ist extrem leichtgewichtig und performant für statisches Serving
- Ergebnis: ~25 MB Image

---

## docker-compose.yml – die drei Services

```yaml
services:

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file: .env          # DATABASE_URL, APP_NAME etc. kommen aus .env
    depends_on:
      db:
        condition: service_healthy

  frontend:
    build: ./frontend
    ports:
      - "3000:80"           # nginx läuft intern auf Port 80

  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: gjose
      POSTGRES_USER: gjose_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}   # kommt aus .env
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U gjose_user"]
      interval: 5s
      retries: 5

volumes:
  postgres_data:
```

**Wichtige Details:**
- `depends_on` mit `condition: service_healthy` → Backend startet erst wenn PostgreSQL bereit ist
- `env_file: .env` → Secrets kommen nie ins Image oder in die YAML
- `postgres_data` Volume → DB-Daten überleben Container-Neustarts

---

## docker-compose.override.yml – Dev-Overrides

Diese Datei wird von Docker Compose **automatisch** über `docker-compose.yml` gelegt, wenn beide im selben Verzeichnis liegen – kein extra Flag nötig.

```yaml
services:
  backend:
    volumes:
      - ./backend:/app     # Hot-Reload: lokale Änderungen sofort sichtbar
    command: uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

  frontend:
    volumes:
      - ./frontend:/app    # Vite-Dev-Server statt nginx
    command: npm run dev -- --host
```

**Warum zwei Compose-Dateien?**

| Datei | Zweck | Committed? |
|---|---|---|
| `docker-compose.yml` | Produktions-Konfiguration | ✅ ja |
| `docker-compose.override.yml` | Dev-Overrides (Hot-Reload) | ✅ ja |
| `.env` | Secrets | ❌ nein |

---

## Ablauf: Wie läuft es ab?

### Lokale Entwicklung (Dev)

```bash
# Einmalig: .env aus .env.example erstellen und befüllen
cp .env.example .env

# Alle Services starten (override.yml wird automatisch geladen)
docker compose up

# Ergebnis:
# → http://localhost:8000  – FastAPI (mit Hot-Reload)
# → http://localhost:3000  – React (Vite Dev-Server)
# → PostgreSQL läuft intern auf Port 5432
```

### Produktion

```bash
# Nur docker-compose.yml – kein override
docker compose -f docker-compose.yml up -d --build

# Ergebnis:
# → http://localhost:8000  – FastAPI (kein Reload)
# → http://localhost:3000  – React via nginx (statische Dateien)
```

### Alembic Migrations (einmalig nach Start)

```bash
docker compose exec backend alembic upgrade head
```

---

## Was muss NICHT in Phase 9 entschieden werden?

- **Reverse Proxy (nginx/Traefik):** Kommt erst wenn ein echter Domain-Name + SSL benötigt wird
- **Container Registry (ghcr.io, Docker Hub):** Erst relevant wenn CI/CD das Image bauen und pushen soll (Phase 8 Erweiterung)
- **Kubernetes/Swarm:** Überdimensioniert für den aktuellen Stand

---

## Offene Fragen / Entscheidungen für Phase 9

1. **`DB_PASSWORD` in `.env`:** Wer setzt das lokale Passwort? → Convention: `gjose_dev` für lokal, echtes Secret für Produktion
2. **Port-Konflikte:** Falls lokal schon PostgreSQL läuft → `5433:5432` als Mapping wählen
3. **`docker-compose.override.yml` ins Git?** → Ja, da er keine Secrets enthält und für alle Entwickler gilt

---

## Referenzen

- [Docker Multi-Stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Docker Compose Dokumentation](https://docs.docker.com/compose/)
- [uv in Docker](https://docs.astral.sh/uv/guides/integration/docker/)
- [nginx:alpine Docker Hub](https://hub.docker.com/_/nginx)
- [postgres:16-alpine Docker Hub](https://hub.docker.com/_/postgres)
