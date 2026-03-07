# `.env`-Konzept – gjo-se.com

> Erstellt: 2026-03-07 | Rolle: REX

---

## 1. Bestandsaufnahme: Welche Dateien gibt es?

```
gjo-se.com/
├── .env                    ← Root – für Docker Compose (env_file: .env)
├── .env.example            ← Root – committed, Template für neue Entwickler
├── backend/
│   ├── .env                ← Backend – für lokale Entwicklung (start_be)
│   └── .env.example        ← Backend – committed, Template
└── frontend/
    ├── .env                ← Frontend – für Vite (start_fe / npm run dev)
    └── .env.example        ← Frontend – committed, Template
```

**Git-Status:**
- `.env` und `.env.*` sind **ignoriert** (`.gitignore`: `.env`, `.env.*`)
- `.env.example` Dateien sind **committed** (Ausnahme: `!.env.example`)

---

## 2. Wer liest welche Datei?

| Datei | Leser | Wann |
|-------|-------|------|
| `.env` (Root) | Docker Compose (`env_file: .env`) | `docker compose up` → setzt Container-Env-Variablen |
| `backend/.env` | FastAPI via pydantic-settings (`env_file=".env"`) | `start_be` (lokale Entwicklung ohne Docker) |
| `frontend/.env` | Vite (`import.meta.env.VITE_*`) | `start_fe` / `npm run dev` (lokale Entwicklung ohne Docker) |

### Sonderfall: Docker Dev-Modus (Override aktiv)

Im `docker-compose.override.yml` wird `./backend:/app` als Volume gemountet.
Das bedeutet: **pydantic-settings liest im Container die `backend/.env`** – nicht die Root-`.env`.

Das Zusammenspiel sieht so aus:

```
docker compose up (mit override)
│
├── Docker Compose liest Root-.env  → setzt Container-Umgebungsvariablen (DB_PASSWORD etc.)
│
└── Container startet FastAPI
    └── pydantic-settings liest /app/.env  → das ist backend/.env (via Volume-Mount)
        → überschreibt die Docker-Compose-Variablen mit dem, was in backend/.env steht
```

**Priorität im laufenden Container (Docker Dev):**
`backend/.env` (pydantic) **gewinnt** gegenüber Root-`.env` (Docker Compose env_file)

---

## 3. Ist Redundanz korrekt?

**Ja – aber sie hat eine klare Begründung:**

| Szenario | genutzte Datei | Inhalt |
|----------|---------------|--------|
| `start_be` (lokal, kein Docker) | `backend/.env` | `DATABASE_URL` zeigt auf `localhost:5432` |
| `start_docker` (Docker Dev) | `backend/.env` (via Volume) | `DATABASE_URL` zeigt auf `localhost:5432`* |
| `docker compose` (CI/Produktion, kein Override) | Root-`.env` | `DATABASE_URL` zeigt auf `db:5432` (Docker-intern) |

> \* **Das ist ein Bug im aktuellen Zustand:** `backend/.env` hat `localhost:5432` als
> `DATABASE_URL` – das funktioniert lokal, aber nicht im Docker-Netz ohne Override.
> Im Override-Modus mappt Docker Port 5432 → Host, deshalb klappt es trotzdem.

### Der entscheidende Unterschied zwischen Root- und Backend-`.env`

```
Root-.env:       DATABASE_URL=postgresql+asyncpg://gjose_user:gjose_dev@db:5432/gjose
backend/.env:    DATABASE_URL=postgresql+asyncpg://gjose_user:gjose_dev@localhost:5432/gjose
```

- `db` = Docker-interner Hostname (funktioniert nur innerhalb des Docker-Netzes)
- `localhost` = funktioniert nur wenn Postgres direkt erreichbar ist (lokal oder Port-Mapping)

---

## 4. Probleme im Ist-Zustand

### Problem 1: Zwei Wahrheitsquellen (Redundanz)
Alle Backend-Variablen (`APP_NAME`, `DEBUG`, `ALLOWED_ORIGINS`, `SECRET_KEY` etc.)
stehen in **beiden** Dateien. Ändert man eine, muss man auch die andere anpassen –
wie beim CORS-Bug letzte Woche passiert.

### Problem 2: `backend/.env.example` ist nicht synchron
`backend/.env.example` hat noch `ALLOWED_ORIGINS=["http://localhost:3000"]`
(ohne Port 5173), während `backend/.env` bereits korrigiert wurde.

### Problem 3: Root-`.env` enthält echte Credentials
`DB_PASSWORD=gjose_dev` steht in der Root-`.env` im Klartext.
Für lokale Entwicklung akzeptabel – **in Produktion niemals.**

---

## 5. Empfehlung: Sauberes Konzept

### Prinzip: Eine Quelle pro Kontext

```
gjo-se.com/
├── .env                ← NUR Docker-Compose-Variablen: DB_PASSWORD, (DB_HOST etc.)
├── .env.example        ← Template dafür
├── backend/
│   ├── .env            ← ALLE FastAPI-Variablen für lokale Entwicklung UND Docker Dev
│   └── .env.example    ← Template dafür
└── frontend/
    ├── .env            ← Vite-Variablen (VITE_*)
    └── .env.example    ← Template dafür
```

**Root-`.env` (Docker Compose) – minimal:**
```dotenv
DB_PASSWORD=gjose_dev
```

**`docker-compose.yml` Backend-Service:**
```yaml
backend:
  env_file:
    - .env          # DB_PASSWORD für den db-Service
    - backend/.env  # alle FastAPI-Variablen direkt aus backend/.env
```

So gibt es **eine einzige Quelle** für FastAPI-Konfiguration: `backend/.env`.
Kein manuelles Synchronisieren mehr.

### Warum nicht heute sofort umbauen?

Der Umbau erfordert:
1. `docker-compose.yml` anpassen (`env_file` auf `backend/.env` umstellen)
2. Root-`.env` auf DB-Variablen reduzieren
3. `backend/.env` um `DATABASE_URL` mit `db`-Hostname ergänzen (für Docker-intern)
4. Alle `.env.example` aktualisieren
5. README aktualisieren

Das ist ein eigenständiges Ticket – kein Hotfix.

---

## 6. Sofortmaßnahmen (bereits erledigt)

| Maßnahme | Status |
|----------|--------|
| Root-`.env`: `ALLOWED_ORIGINS` um `localhost:5173` erweitert | ✅ |
| Root-`.env`: Auth-Variablen ergänzt | ✅ |
| `backend/.env`: `ALLOWED_ORIGINS` um `localhost:5173` erweitert | ✅ |
| Root-`.env.example`: synchronisiert | ✅ |

## 7. Offene Punkte (Ticket empfohlen)

- [ ] `backend/.env.example`: `ALLOWED_ORIGINS` auf `localhost:5173` aktualisieren
- [ ] `docker-compose.yml`: `env_file` auf `backend/.env` umstellen (Single Source)
- [ ] Root-`.env` auf reine Docker-Compose-Variablen (`DB_PASSWORD`) reduzieren
- [ ] README: `.env`-Konzept dokumentieren

---

## 8. SOTA-Entscheidung: Docker-First → Single Source

> Entschieden: 2026-03-07

**Ausgangsfrage:** Da Docker die einzige Laufzeitumgebung ist – sind `start_be` und
`start_fe` (und damit `backend/.env`) noch notwendig?

### Analyse

| Szenario | `start_be` / `start_fe` nötig? | Begründung |
|---|---|---|
| Backend starten | ❌ | `docker-compose.override.yml` liefert `--reload` |
| Frontend starten | ❌ | `docker-compose.override.yml` liefert Vite Dev-Server |
| Hot-Reload | ❌ | Volume-Mount + `--reload` bereits aktiv |
| pytest lokal | ❌ | `uv run pytest` läuft direkt, kein Server nötig |
| Separate DB ohne Docker | ❌ | PostgreSQL läuft ausschließlich in Docker |

**Ergebnis:** `start_be` und `start_fe` haben keinen Mehrwert mehr.
Sie erzeugen eine **parallele Laufzeit mit anderer Konfiguration** (`localhost:5432`
statt Docker-internem `db:5432`) – das ist die Ursache des CORS-Bugs gewesen.

### Zielstruktur (nach Umbau)

```
gjo-se.com/
├── .env              ← ALLE Variablen: DB_PASSWORD + alle FastAPI-Settings (Single Source)
├── .env.example      ← committed, Template
└── frontend/
    ├── .env          ← NUR VITE_* (build-time, wird ins Image eingebrannt)
    └── .env.example  ← committed, Template
```

`backend/.env` und `backend/.env.example` → **werden gelöscht**.

### Warum `frontend/.env` bleibt

Vite brennt `VITE_*`-Variablen **zur Build-Zeit** ins JS-Bundle ein –
das ist kein Runtime-Kontext. Das Docker-Image braucht `VITE_API_BASE_URL`
beim `npm run build` im Dockerfile.

### Umbau-Schritte (für das Ticket)

1. `start_be` und `start_fe` aus `dev.zsh` entfernen
2. `backend/.env` und `backend/.env.example` löschen (`git rm`)
3. Root-`.env`: `DATABASE_URL` auf `db:5432` (Docker-intern) festlegen –
   `localhost:5432` entfällt, da kein direkter lokaler Zugriff mehr vorgesehen
4. `docker-compose.yml`: `env_file: .env` bleibt – Root-`.env` ist jetzt die einzige Quelle
5. README: Tabelle der Shell-Befehle bereinigen (`start_be`, `start_fe` entfernen)
6. `env-konzept.md` (dieses Dokument): als Entscheidungsnachweis behalten
