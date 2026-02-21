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
# 1. start Feature:
git flow feature start ISSUE-1307-feature-name

# 2. create Commits
git status
git add . | folder/file.py
git commit -m "Description"

# 3. Remote-Push
git push -u origin feature/ISSUE-1307-feature-name
git push

# 4. create PR (sollte ohne --base develop funktionieren => default)
gh pr create --title "feat: health check" --body "Closes #1307" --base develop

# 5. merge PR
gh pr merge X --squash --delete-branch

# incl. pull dev & cleanup
git checkout develop
git pull
git branch -d feature/ISSUE-1307-feature-name
```
