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
