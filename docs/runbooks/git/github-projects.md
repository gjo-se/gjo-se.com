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
gh pr create --title "feat: ..." --body-file /tmp/pr-body.md --base develop

# Project-Items anzeigen (benötigt gh extension)
gh project item-list 1 --owner gjo-se
```

---

## AC-Checkboxen im Ticket abhaken (SAM Abschluss-Workflow)

GitHub Issues unterstützen kein partielles Checkbox-Update via CLI.
**Empfohlener Weg:** Issue im Browser öffnen und Checkboxen manuell anklicken.

```bash
# Issue im Browser öffnen – Checkboxen dort anklicken
gh issue view <nr> --web
```

> **Warum nicht via CLI?** `gh issue edit` überschreibt den gesamten Body.
> Bei komplexen Bodies mit Codeblöcken ist das fehleranfällig.
> → Browser ist hier der sichere, schnelle Weg.

---

## Ticket-Status setzen (gjo-se.com Project – feste IDs)

| Konstante | Wert |
|---|---|
| **Project-Nr.** | `2` |
| **Project-ID** | `PVT_kwHOAHMTQs4BP8S0` |
| **Status Field-ID** | `PVTSSF_lAHOAHMTQs4BP8S0zg-NF2I` |

| Status | Option-ID |
|---|---|
| Blocked | `c36ae863` |
| Backlog | `f75ad846` |
| Progress | `47fc9ee4` |
| **Review** | `aba860b9` |
| Done | `98236657` |

```bash
# Schritt 1: Item-ID für ein Issue ermitteln
gh project item-list 2 --owner gjo-se --format json | \
  jq '.items[] | select(.content.number == <issue-nr>) | {id, title: .content.title}'

# Schritt 2: Status setzen (Beispiel: → Review)
gh project item-edit \
  --project-id PVT_kwHOAHMTQs4BP8S0 \
  --id <item-id> \
  --field-id PVTSSF_lAHOAHMTQs4BP8S0zg-NF2I \
  --single-select-option-id aba860b9
```
