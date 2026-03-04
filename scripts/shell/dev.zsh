# ============================================================
# gjo-se.com — Dev-Server Helper
# ------------------------------------------------------------
# Stellt Hilfsfunktionen zum Starten des FastAPI-Dev-Servers
# bereit. Sourcen mit: source scripts/shell/dev.zsh
# ============================================================

# ------------------------------------------------------------
# backend_start — FastAPI Dev-Server starten
# ------------------------------------------------------------
# Startet den uvicorn-Dev-Server mit --reload im backend/-Verzeichnis.
# Verwendet uv run, damit das projektlokale .venv genutzt wird.
#
# Verwendung:
#   backend_start           # startet auf Standardport 8000
#   backend_start 8080      # startet auf Port 8080
#
# Beispiel:
#   $ source scripts/shell/dev.zsh
#   $ backend_start
# ------------------------------------------------------------
function backend_start() {
  local port="${1:-8000}"
  local backend_dir
  backend_dir="$(git rev-parse --show-toplevel)/backend"

  if [[ ! -d "$backend_dir" ]]; then
    echo "[backend_start] ❌ Verzeichnis nicht gefunden: $backend_dir" >&2
    return 1
  fi

  echo "[backend_start] 🚀 Starte FastAPI Dev-Server auf http://127.0.0.1:${port} ..."
  echo "[backend_start] 📁 Arbeitsverzeichnis: $backend_dir"
  cd "$backend_dir" && uv run uvicorn app.main:app --reload --host 127.0.0.1 --port "$port"
}
