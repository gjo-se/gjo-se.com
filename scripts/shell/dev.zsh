# ============================================================
# gjo-se.com — Dev-Server Helper
# ------------------------------------------------------------
# Stellt Hilfsfunktionen zum Starten des FastAPI-Dev-Servers
# bereit. Sourcen mit: source scripts/shell/dev.zsh
# ============================================================

# ------------------------------------------------------------
# start_be — FastAPI Dev-Server starten
# ------------------------------------------------------------
# Startet den uvicorn-Dev-Server mit --reload im backend/-Verzeichnis.
# Verwendet uv run, damit das projektlokale .venv genutzt wird.
#
# Verwendung:
#   start_be           # startet auf Standardport 8000
#   start_be 8080      # startet auf Port 8080
#
# Beispiel:
#   $ source scripts/shell/dev.zsh
#   $ start_be
# ------------------------------------------------------------
function start_be() {
  local port="${1:-8000}"
  local backend_dir
  backend_dir="$(git rev-parse --show-toplevel)/backend"

  if [[ ! -d "$backend_dir" ]]; then
    echo "[start_be] ❌ Verzeichnis nicht gefunden: $backend_dir" >&2
    return 1
  fi

  echo "[start_be] 🚀 Starte FastAPI Dev-Server auf http://127.0.0.1:${port} ..."
  echo "[start_be] 📁 Arbeitsverzeichnis: $backend_dir"
  cd "$backend_dir" && uv run uvicorn app.main:app --reload --host 127.0.0.1 --port "$port"
}

# ------------------------------------------------------------
# start_fe — Vite Dev-Server starten
# ------------------------------------------------------------
# Startet den Vite-Dev-Server im frontend/-Verzeichnis.
#
# Verwendung:
#   start_fe           # startet auf Standardport 5173
#   start_fe 3000      # startet auf Port 3000
#
# Beispiel:
#   $ source scripts/shell/dev.zsh
#   $ start_fe
# ------------------------------------------------------------
function start_fe() {
  local port="${1:-5173}"
  local frontend_dir
  frontend_dir="$(git rev-parse --show-toplevel)/frontend"

  if [[ ! -d "$frontend_dir" ]]; then
    echo "[start_fe] ❌ Verzeichnis nicht gefunden: $frontend_dir" >&2
    return 1
  fi

  echo "[start_fe] 🚀 Starte Vite Dev-Server auf http://localhost:${port} ..."
  echo "[start_fe] 📁 Arbeitsverzeichnis: $frontend_dir"
  cd "$frontend_dir" && npm run dev -- --port "$port"
}

# ------------------------------------------------------------
# run_migrations — Alembic Migrations einspielen
# ------------------------------------------------------------
# Prüft ob neue Migrations-Dateien in alembic/versions/ vorhanden
# sind, die noch nicht in der DB eingespielt wurden, und führt
# dann "alembic upgrade head" im laufenden backend-Container aus.
#
# Verwendung:
#   run_migrations          # prüft + spielt ein wenn nötig
#   run_migrations --force  # immer ausführen ohne Prüfung
#
# Beispiel:
#   $ run_migrations
# ------------------------------------------------------------
function run_migrations() {
  local project_dir
  project_dir="$(git rev-parse --show-toplevel)"

  # Prüfen ob backend-Container läuft
  local running
  running=$(docker compose -f "$project_dir/docker-compose.yml" ps --status running --services 2>/dev/null | grep "^backend$")

  if [[ -z "$running" ]]; then
    echo "[run_migrations] ⚠️  backend-Container läuft nicht – Migrations übersprungen." >&2
    return 1
  fi

  if [[ "$1" == "--force" ]]; then
    echo "[run_migrations] 🗄️  Führe alembic upgrade head aus (--force) ..."
    cd "$project_dir" && docker compose exec backend alembic upgrade head
    return $?
  fi

  # Aktuelle DB-Revision ermitteln
  local current_rev
  current_rev=$(cd "$project_dir" && docker compose exec -T backend alembic current 2>/dev/null | grep -oE '[a-f0-9]{12}' | head -1)

  # Neueste Revision aus den Versions-Dateien ermitteln
  local latest_file
  latest_file=$(ls -t "$project_dir/backend/alembic/versions/"*.py 2>/dev/null | head -1)
  local latest_rev
  latest_rev=$(grep -oE "revision: str = '[a-f0-9]+'" "$latest_file" 2>/dev/null | grep -oE '[a-f0-9]+' | head -1)

  if [[ -z "$latest_rev" ]]; then
    echo "[run_migrations] ℹ️  Keine Migrations-Dateien gefunden – übersprungen."
    return 0
  fi

  if [[ "$current_rev" == "$latest_rev" ]]; then
    echo "[run_migrations] ✅ DB ist aktuell (revision: $current_rev) – keine Migration nötig."
  else
    echo "[run_migrations] 🗄️  Neue Migrations gefunden (DB: ${current_rev:-leer} → $latest_rev) ..."
    cd "$project_dir" && docker compose exec backend alembic upgrade head
  fi
}

# ------------------------------------------------------------
# start_docker — Docker Compose starten
# ------------------------------------------------------------
# Startet alle Services via Docker Compose.
# Beim ersten Aufruf (kein Image vorhanden) wird --build gesetzt,
# danach startet es ohne Rebuild (nutzt Layer-Cache).
# Nach dem Start werden Migrations automatisch geprüft.
#
# Verwendung:
#   start_docker          # normaler Start
#   start_docker --build  # Build erzwingen
#
# Beispiel:
#   $ source scripts/shell/dev.zsh
#   $ start_docker
# ------------------------------------------------------------
function start_docker() {
  local project_dir
  project_dir="$(git rev-parse --show-toplevel)"

  if [[ ! -f "$project_dir/docker-compose.yml" ]]; then
    echo "[start_docker] ❌ docker-compose.yml nicht gefunden: $project_dir" >&2
    return 1
  fi

  if [[ "$1" == "--build" ]]; then
    echo "[start_docker] 🔨 Starte Docker Compose mit --build ..."
    cd "$project_dir" && docker compose up --build -d
  else
    # Prüfen ob Images bereits existieren
    local images
    images=$(docker compose -f "$project_dir/docker-compose.yml" images -q 2>/dev/null)
    if [[ -z "$images" ]]; then
      echo "[start_docker] 🔨 Kein Image gefunden – starte mit --build ..."
      cd "$project_dir" && docker compose up --build -d
    else
      echo "[start_docker] 🚀 Starte Docker Compose ..."
      cd "$project_dir" && docker compose up -d
    fi
  fi

  # Warten bis backend-Container healthy ist
  echo "[start_docker] ⏳ Warte auf backend-Container ..."
  local attempts=0
  until docker compose -f "$project_dir/docker-compose.yml" ps --status running --services 2>/dev/null | grep -q "^backend$"; do
    attempts=$((attempts + 1))
    if [[ $attempts -ge 30 ]]; then
      echo "[start_docker] ❌ Timeout – backend-Container nicht gestartet." >&2
      return 1
    fi
    sleep 2
  done

  echo "[start_docker] ✅ Alle Services laufen."
  echo ""

  # Migrations automatisch prüfen und einspielen
  run_migrations
}
