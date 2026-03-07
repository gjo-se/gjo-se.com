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

  # Aktuelle DB-Revision ermitteln – alembic current gibt z.B. "0002 (head)" aus
  local current_rev
  current_rev=$(cd "$project_dir" && docker compose exec -T backend alembic current 2>/dev/null \
    | grep -v '^$' | awk '{print $1}' | head -1)

  # Neueste Revision aus den Versions-Dateien ermitteln (numerisch oder hex)
  # Dateien sortiert nach Name, letzte = neueste Migration (0001, 0002, ...)
  local latest_file
  latest_file=$(find "$project_dir/backend/alembic/versions" -maxdepth 1 -name "[^_]*.py" | sort | tail -1)
  local latest_rev
  latest_rev=$(grep -oE "^revision: str = ['\"][a-zA-Z0-9_]+['\"]" "$latest_file" 2>/dev/null | grep -oE "['\"][a-zA-Z0-9_]+['\"]" | tr -d "'\"")

  if [[ -z "$latest_rev" ]]; then
    echo "[run_migrations] ℹ️  Keine Migrations-Dateien gefunden – übersprungen."
    return 0
  fi

  echo "[run_migrations] 🔍 DB-Revision: ${current_rev:-<leer>}  |  Neueste: $latest_rev"

  if [[ "$current_rev" == "$latest_rev" ]]; then
    echo "[run_migrations] ✅ DB ist aktuell (revision: $current_rev) – keine Migration nötig."
  else
    echo "[run_migrations] 🗄️  Neue Migrations gefunden (DB: ${current_rev:-leer} → $latest_rev) – führe upgrade head aus ..."
    cd "$project_dir" && docker compose exec backend alembic upgrade head
  fi
}

# ------------------------------------------------------------
# start_docker — Docker Compose starten
# ------------------------------------------------------------
# Startet alle Services via Docker Compose.
# Beim ersten Aufruf (kein Image vorhanden) wird --build gesetzt,
# danach startet es ohne Rebuild (nutzt Layer-Cache).
# Nach dem Start werden Migrations automatisch geprüft und eingespielt.
#
# DB-Daten (Postgres Volume) bleiben bei JEDEM Start erhalten.
# Nur stop_docker --clean löscht die DB explizit.
#
# Verwendung:
#   start_docker            # normaler Start
#   start_docker --build    # Build erzwingen (mit Layer-Cache, DB bleibt)
#   start_docker --rebuild  # Build ohne Cache (nach package-lock-Änderungen, DB bleibt)
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

  if [[ "$1" == "--rebuild" ]]; then
    echo "[start_docker] 🔨 Vollständiger Rebuild – stoppe Container (DB-Daten bleiben erhalten!) ..."
    cd "$project_dir" && docker compose down
    echo "[start_docker] 🔨 Baue Images ohne Cache ..."
    cd "$project_dir" && docker compose build --no-cache && docker compose up -d
    cd "$project_dir" && docker compose build --no-cache && docker compose up -d
  elif [[ "$1" == "--build" ]]; then
    echo "[start_docker] 🔨 Starte Docker Compose mit --build ..."
    cd "$project_dir" && docker compose up --build -d
  else
    # --- Automatische package.json-Prüfung ---
    local pkg_file="$project_dir/frontend/package.json"
    local lock_file="$project_dir/frontend/package-lock.json"
    local image_created

    # Erstellungszeit des Frontend-Images ermitteln (leer = kein Image vorhanden)
    image_created=$(docker image inspect gjo-secom-frontend \
      --format '{{.Created}}' 2>/dev/null | head -1)

    if [[ -n "$image_created" ]]; then
      # Image-Zeit in Unix-Timestamp umrechnen
      local image_ts pkg_ts lock_ts
      image_ts=$(date -j -f "%Y-%m-%dT%H:%M:%S" "${image_created%%.*}" "+%s" 2>/dev/null \
                 || date -d "${image_created%%.*}" "+%s" 2>/dev/null || echo "0")
      pkg_ts=$(stat -f "%m" "$pkg_file" 2>/dev/null \
               || stat -c "%Y" "$pkg_file" 2>/dev/null || echo "0")
      lock_ts=$(stat -f "%m" "$lock_file" 2>/dev/null \
                || stat -c "%Y" "$lock_file" 2>/dev/null || echo "0")

      if [[ "$pkg_ts" -gt "$image_ts" || "$lock_ts" -gt "$image_ts" ]]; then
        echo ""
        echo "[start_docker] ⚠️  package.json / package-lock.json sind neuer als das Docker-Image."
        echo "[start_docker]    Neue npm-Abhängigkeiten fehlen möglicherweise im Container."
        echo ""
        echo -n "[start_docker]    Vollständigen Rebuild durchführen? (empfohlen) [Y/n] "
        read -r answer
        if [[ "$answer" == "n" || "$answer" == "N" ]]; then
          echo "[start_docker] ⚠️  Übersprungen – starte mit bestehendem Image."
        else
          echo "[start_docker] 🔨 Starte vollständigen Rebuild (DB-Daten bleiben erhalten) ..."
          cd "$project_dir" && docker compose down
          cd "$project_dir" && docker compose build --no-cache && docker compose up -d
          _start_docker_wait_and_show "$project_dir"
          return $?
        fi
      fi
    fi

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

  _start_docker_wait_and_show "$project_dir"
}

# Interner Helfer: warten + Migrations + Links ausgeben
function _start_docker_wait_and_show() {
  local project_dir="$1"

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

  # Frontend-Port dynamisch ermitteln:
  # - docker-compose.override.yml vorhanden → Vite Dev-Server auf 5173
  # - nur docker-compose.yml → nginx auf 3000
  local frontend_port="3000"
  if [[ -f "$project_dir/docker-compose.override.yml" ]]; then
    frontend_port="5173"
  fi

  local fe_url="http://localhost:${frontend_port}"
  local be_url="http://localhost:8000"

  # Klickbare Links ausgeben
  echo ""
  echo "┌──────────────────────────────────────────────────────┐"
  echo "│  🌐 Services erreichbar:                              │"
  echo "│                                                      │"
  printf "│  Frontend  →  \e]8;;%s\e\\%s\e]8;;\e\\%-22s│\n" "$fe_url" "$fe_url" ""
  printf "│  Backend   →  \e]8;;%s\e\\%s\e]8;;\e\\%-22s│\n" "$be_url" "$be_url" ""
  printf "│  API Docs  →  \e]8;;%s/docs\e\\%s/docs\e]8;;\e\\%-17s│\n" "$be_url" "$be_url" ""
  printf "│  ReDoc     →  \e]8;;%s/redoc\e\\%s/redoc\e]8;;\e\\%-16s│\n" "$be_url" "$be_url" ""
  if [[ "$frontend_port" == "5173" ]]; then
    printf "│  Showcase  →  \e]8;;%s/dev/atoms\e\\%s/dev/atoms\e]8;;\e\\%-11s│\n" "$fe_url" "$fe_url" ""
  fi
  echo "└──────────────────────────────────────────────────────┘"
}

# ------------------------------------------------------------
# stop_docker — Docker Compose stoppen
# ------------------------------------------------------------
# Stoppt alle laufenden Container. Daten (Volumes) bleiben erhalten.
# Für einen vollständigen Reset (DB löschen): stop_docker --clean
#
# Verwendung:
#   stop_docker          # Container stoppen (Daten bleiben)
#   stop_docker --clean  # Container + Volumes entfernen (DB weg!)
#
# Beispiel:
#   $ stop_docker        # Feierabend
#   $ start_docker       # nächster Morgen
# ------------------------------------------------------------
function stop_docker() {
  local project_dir
  project_dir="$(git rev-parse --show-toplevel)"

  if [[ "$1" == "--clean" ]]; then
    echo "[stop_docker] 🗑️  Stoppe Container und lösche Volumes (DB-Daten werden gelöscht!) ..."
    echo -n "[stop_docker]    Bist du sicher? [y/N] "
    read -r answer
    if [[ "$answer" == "y" || "$answer" == "Y" ]]; then
      cd "$project_dir" && docker compose down -v
      echo "[stop_docker] ✅ Container und Volumes entfernt."
    else
      echo "[stop_docker] ↩️  Abgebrochen."
    fi
  else
    echo "[stop_docker] 🛑 Stoppe Docker Container (Daten bleiben erhalten) ..."
    cd "$project_dir" && docker compose stop
    echo "[stop_docker] ✅ Alle Container gestoppt."
    echo "[stop_docker]    Zum Neustart: start_docker"
  fi
}
