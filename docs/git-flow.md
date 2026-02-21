# GitFlow

```
main ──────────────────────────────────────────────────────► (Produktion)
  │                               ▲                  ▲
  │                               │                  │
  │                          release/1.0.0       hotfix/X
  │                               │                  │
develop ───────────────────────────────────────────────────► (Integration)
  │            ▲             ▲             ▲
  │            │             │             │
feature/A   feature/B     feature/C     (zurück aus release)
```

| Branch | Erzeugt aus | Per PR gemergt in | Wer bekommt den Code |
|---|---|---|---|
| `feature/*` | `develop` | `develop` | nur `develop` |
| `release/*` | `develop` | `main` **+** `develop` | **beide** (GitFlow automatisch) |
| `hotfix/*` | `main` | `main` **+** `develop` | **beide** (GitFlow automatisch) |

## Workflow
```bash
git checkout develop          # 1. Branch wechseln
git pull                      # 2. Remote-Stand holen
git branch -d feature/X       # 3. Lokalen Feature-Branch aufräumen
git flow feature start ISSUE-Y-naechstes-feature  # 4. Neues Feature starten
```
