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
# 1. Role: Sam
gf_task #Task-Number

# 2. Role: PM
gf_merge #PR-Number

```
