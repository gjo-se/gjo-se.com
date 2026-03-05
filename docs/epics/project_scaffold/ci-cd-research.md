# Research: GitHub Actions CI/CD Pipeline

> Erstellt im Kontext von Phase 8 – Epic #14
> Projekt: gjo-se.com

---

## Was passiert?

GitHub Actions ist eine **Automatisierungsplattform direkt in GitHub**. Workflows werden als YAML-Dateien unter `.github/workflows/` definiert – GitHub führt sie automatisch aus, sobald definierte Ereignisse eintreten (z.B. Push, PR).

Für dieses Projekt wird eine Datei `.github/workflows/ci.yml` angelegt mit **zwei parallelen Jobs**:

```
Push / PR auf beliebigen Branch
    │
    ├── backend-ci
    │     1. Python 3.12 aufsetzen
    │     2. uv + Dependencies installieren (uv sync --frozen)
    │     3. ruff (Linting)
    │     4. black (Formatierungsprüfung)
    │     5. pytest (Unit Tests)
    │
    └── frontend-ci
          1. Node.js 20 aufsetzen
          2. npm ci (reproduzierbares Install via package-lock.json)
          3. npm run build (TypeScript kompilieren + Bundle prüfen)
```

---

## Warum CI/CD?

| Ohne CI | Mit CI |
|---|---|
| Fehler fallen erst lokal auf (wenn man dran denkt) | Jeder PR wird **automatisch geprüft** |
| „Bei mir läuft's" – auf anderem System nicht | Einheitliche, reproduzierbare Umgebung |
| Merge ohne Tests möglich | PR kann erst gemergt werden wenn CI grün ist |
| pre-commit läuft nur lokal | CI ist die **zweite Verteidigungslinie** |

**Konkret für dieses Projekt:** Jedes Mal wenn ein PR auf `develop` geöffnet wird, laufen beide Jobs automatisch. Schlägt ein Job fehl – sieht man es sofort im PR, bevor gemergt werden kann.

---

## Was wird über Code gesteuert?

**Fast alles** – die Workflow-Datei reicht. Konkret:

- Die YAML-Datei selbst (`.github/workflows/ci.yml`)
- Welche Jobs laufen und in welcher Reihenfolge
- Welche Branches den Trigger auslösen
- Welche Python/Node-Versionen genutzt werden
- Welche Actions-Versionen verwendet werden

---

## Was muss einmalig in den GitHub Settings gemacht werden?

### 1. Branch Protection Rules

`GitHub → Repository → Settings → Branches → Add rule`

Für `develop` **und** `main` jeweils:

| Setting | Wert |
|---|---|
| Branch name pattern | `develop` / `main` |
| Require status checks to pass before merging | ✅ aktivieren |
| Status checks auswählen | `backend-ci`, `frontend-ci` |
| Require branches to be up to date before merging | ✅ aktivieren |
| Do not allow bypassing the above settings | ✅ empfohlen |

> **Hinweis:** Die Status-Check-Namen (`backend-ci`, `frontend-ci`) erscheinen in der Auswahl erst nachdem der Workflow **einmal gelaufen** ist.

### 2. Actions Permissions (einmalig prüfen)

`GitHub → Repository → Settings → Actions → General`

- „Allow all actions" oder „Allow actions created by GitHub" – bei neuen Repos meist korrekt voreingestellt.

---

## Aufwand-Übersicht

| Was | Wo | Aufwand |
|---|---|---|
| `ci.yml` anlegen | Code (`.github/workflows/`) | Phase 8 |
| Branch Protection für `develop` | GitHub Settings | ~5 Min, einmalig |
| Branch Protection für `main` | GitHub Settings | ~5 Min, einmalig |
| Actions Permissions prüfen | GitHub Settings | ~1 Min, einmalig |

---

## Referenzen

- [GitHub Actions Dokumentation](https://docs.github.com/en/actions)
- [astral-sh/setup-uv](https://github.com/astral-sh/setup-uv)
- [actions/setup-python](https://github.com/actions/setup-python)
- [actions/setup-node](https://github.com/actions/setup-node)
