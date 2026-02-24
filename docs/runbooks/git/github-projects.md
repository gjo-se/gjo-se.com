# GitHub Projects 

## Project Columns

- Blocked
- Backlog
- Progress
- Review
- Done

---

## Issue fields
- Title
- Description
- Labels

---

## Issue labels
- re ready
- feature
- bug
- blocked

## Issue sub-issues 
- TODO: ausarbeiten

## Issue mit Branch verknüpfen
- TODO: ausarbeiten, testen und ich funktionen einbauen

```bash
# Branch nach Konvention benennen → GitHub erkennt den Issue-Bezug automatisch
git flow feature start ISSUE-1-health-check-endpoint
```

→ GitHub verknüpft den Branch/PR mit dem Issue sobald im PR-Body `Closes #1` steht.

**Im PR-Body immer angeben:**
```
Closes #1
```
→ Issue wird beim Merge automatisch geschlossen und auf „Done" gesetzt.

---

## Täglicher Workflow

```
1. Backlog → Issue aussuchen
2. Issue öffnen → "Create branch" oder:
      git flow feature start ISSUE-X-titel
3. Entwickeln & committen
4. git push + gh pr create (Closes #X im Body)
      → PR wandert automatisch nach "In Review"
5. PR mergen
      → Issue schließt sich automatisch
      → Item wandert nach "Done"
```

---

## Nützliche CLI-Befehle

```bash
# Alle offenen Issues anzeigen
gh issue list

# Issue direkt im Browser öffnen
gh issue view 1 --web

# PR mit Issue verknüpfen
gh pr create --title "feat: ..." --body "Closes #1" --base develop

# Project-Items anzeigen (benötigt gh extension)
gh project item-list 1 --owner gjo-se
```
