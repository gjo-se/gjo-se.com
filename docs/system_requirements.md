## System-Voraussetzungen

Folgende Tools müssen lokal installiert sein:

| Tool | Mindestversion | Installationsbefehl | Prüfen | Status (21.02.2026) |
|---|---|---|---|---|
| Python | 3.12 (Projekt) | _(via uv, siehe Hinweis unten)_ | `uv run python --version` | ✅ 3.12.12 via uv · 3.14.2 als PyCharm-Interpreter |
| uv | latest | `curl -LsSf https://astral.sh/uv/install.sh \| sh` | `uv --version` | ✅ 0.10.4 |
| Node.js | ≥ 22 LTS | `brew install node` | `node --version` | ✅ 25.6.1 (aktueller als LTS, kompatibel) |
| npm | ≥ 10 | _(kommt mit Node.js)_ | `npm --version` | ✅ 11.9.0 |
| Docker Desktop | latest | [docker.com](https://www.docker.com/products/docker-desktop/) | `docker --version` | ✅ 28.2.2 |
| Git | ≥ 2.x | `brew install git` | `git --version` | ✅ 2.39.5 |
| git-flow | latest | `brew install git-flow` | `git flow version` | ✅ 0.4.1 ⚠️ deprecated → Ersatz: `brew install git-flow-next` |
| pre-commit | latest | `uv tool install pre-commit` | `pre-commit --version` | ✅ 4.5.1 (PATH via `~/.zshrc` gesetzt) |
| PyCharm | Professional | [jetbrains.com](https://www.jetbrains.com/pycharm/) | _(GUI-App)_ | ✅ |

> **Legende:** ✅ installiert & OK · ⚠️ installiert, Update empfohlen · ❌ fehlt noch

> **🐍 Python-Versionsstrategie:**
> Auf dem System sind mehrere Python-Versionen installiert. Für dieses Projekt gilt:
>
> | Kontext | Version | Begründung |
> |---|---|---|
> | **Projekt / uv / Docker** | **3.12.12** | Stabile LTS-Version, vollständig unterstützt von FastAPI, SQLAlchemy, Pydantic. Von uv lokal verwaltet → kein separater Download nötig. |
> | **PyCharm IDE-Interpreter** | 3.14.2 | Kann beibehalten werden für IDE-Features; **nicht** als Laufzeit-Interpreter des Projekts verwenden, da 3.14 noch Beta (kein stabiles Release). |
> | **System `python3`** | 3.11.9 | Nicht anfassen — wird von macOS-Tools benötigt. |
>
> `uv init --python 3.12` stellt sicher, dass das Projekt immer mit 3.12 läuft, unabhängig vom System-Python.
