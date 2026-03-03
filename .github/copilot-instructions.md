# Copilot Instructions – gjo-se.com

> Diese Datei steuert das Verhalten von GitHub Copilot (Ask, Edit, Plan) für das gesamte Repository.
> Sie wird bei **jeder** Copilot-Anfrage automatisch als Kontext geladen.

---

## Projekt-Überblick

- **Projektname:** gjo-se.com
- **Typ:** Fullstack-Webprojekt (Python Backend + React Frontend)
- **Sprache im Chat:** immer **Deutsch**
- **Haupt-Branch:** `main` (produktiv), Feature-Branches nach GitFlow

---

## Tech-Stack

### Backend
- **Python 3.12+**
- **FastAPI** – REST API Framework
- **SQLAlchemy** + **Alembic** – ORM & Migrations
- **Pydantic v2** – Datenvalidierung
- **pytest** – Testing Framework
- **Ruff** – Linting
- **Black** – Formatierung

### Frontend
- **React** (TypeScript)
- **Tailwind CSS**

### Infrastruktur & Tooling
- **PostgreSQL** (Produktion), **SQLite** (lokale Entwicklung / Tests)
- **pip** + **venv** / **Poetry**
- **pre-commit** – Hooks für Linting & Formatierung vor jedem Commit
- **GitHub Actions** – CI/CD Pipeline
- **GitHub Projects** – Issue- und Sprint-Management

---

## Environments

| Umgebung | Branch | Zweck |
|----------|--------|-------|
| `dev` | `develop` | Lokale Entwicklung, Experimente |
| `test` | `release/*` oder `develop` | Integrations- & Regressionstests |
| `prod` | `main` | Produktiv-Deployment |

> **Regel:** Code landet **niemals** direkt auf `main` – immer über PR mit Review.

---

## Coding-Standards (Clean Code)

- Funktionen haben **eine Verantwortlichkeit** (Single Responsibility)
- Variablen- und Funktionsnamen sind **selbsterklärend** – keine Abkürzungen ohne Kontext
- **Keine Magic Numbers** – Konstanten verwenden
- **Docstrings** für alle öffentlichen Funktionen, Klassen und Module (Google Style)
- **Type Hints** sind Pflicht – kein `Any` ohne Begründung
- **Tests first mindset:** Jede neue Funktion erhält mindestens einen Unit Test
- **Keine auskommentierten Code-Blöcke** im finalen Commit
- **Fehlerbehandlung** explizit – kein nacktes `except:` ohne Typ und Logging
- **DRY** – doppelter Code wird in Hilfsfunktionen oder Services ausgelagert

### pre-commit Hooks (werden automatisch ausgeführt)
- `ruff check` – Linting
- `black --check` – Formatierungsprüfung
- `pytest --tb=short` – schnelle Test-Suite vor dem Commit

---

## Agenten-Rollen

Dieses Projekt verwendet definierte Rollen – vollständige Definitionen und Verwendungsbeispiele: → **[`AGENTS.md`](../AGENTS.md)**

Rollen werden im Chat aktiviert mit: `for REX:`, `for DAVE:`, `for SENIOR_DEV:` etc.

> **Jede Copilot-Antwort beginnt mit `Rolle: [ROLLENNAME]`** wenn eine Rolle aktiv ist.
> Ist keine Rolle angegeben, gilt die DEFAULT ROLE aus `AGENTS.md`.

---

## Datei- und Ordnerstruktur

```
docs/
  research/      ← REX-Recherchen als .md
  roles/         ← Rollendefinitionen
  runbooks/      ← Schritt-für-Schritt-Anleitungen (Git, System)
  requirements/  ← Anforderungslisten
.github/
  copilot-instructions.md  ← diese Datei
AGENTS.md                  ← Rollen-Definitionen für den Agent-Modus
```

---

## Workflow-Konventionen

### Git / GitHub
- **Feature-Branches:** `feature/<kurzbeschreibung>` (GitFlow)
- **Commit-Messages:** auf Englisch, imperativ (`Add login endpoint`, nicht `Added...`)
- **PRs:** immer mit Beschreibung, Acceptance Criteria und verlinktem Issue
- **GitHub Issues:** werden über `ghic` mit lokaler `.md`-Datei angelegt (siehe `docs/runbooks/git/github-issues.md`)

### Copilot Chat – Modus-Wahl
| Modus | Einsatz |
|-------|---------|
| **Ask** | Fragen, Erklärungen, Code-Reviews |
| **Edit** | Gezielte Änderungen an bekannten Dateien (`#file:`) |
| **Plan** | Komplexe, mehrstufige Aufgaben – Copilot entscheidet selbst welche Dateien relevant sind |

### Kontext explizit angeben
- `#file:pfad/zur/datei.py` – eine spezifische Datei einbeziehen
- `#selection` – nur die Selektion im Editor
- `@workspace` – gesamtes Repo durchsuchen (Plan-/Edit-Modus)

---

## Was Copilot in diesem Projekt NICHT tun soll

- Keinen Code direkt auf `main` committen
- Keine Credentials, Secrets oder `.env`-Werte in Code schreiben
- Keine `print()`-Statements als Logging – stattdessen `logging`-Modul
- Keine Tests überspringen oder mit `pass` auffüllen
- Kein `TODO`-Kommentar ohne Ticket-Referenz (`# TODO #42: ...`)
