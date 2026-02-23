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
gff ISSUE-1307-feature-name

# 2. create Commits
git status
git add . | folder/file.py
git commit -m "Description"
gfc . "feat: health check"
gfc app/main.py "feat: health check"

# 3. Remote-Push
git push -u origin feature/ISSUE-1307-feature-name
git push
gfcp . "feat: health check" ISSUE-1307-health-check
gfcp app/main.py "feat: health check" ISSUE-1307-health-check

# 4. create PR
gh pr create --title "feat: health check" --body "Closes #1307"
gfpr "feat: health check" 1307

# 5. merge PR + pull dev + cleanup
gh pr merge X --squash --delete-branch
git checkout develop
git pull
git branch -d feature/ISSUE-1307-feature-name
gfm X
```
