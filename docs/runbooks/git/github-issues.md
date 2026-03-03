# Runbook: GitHub Issue erstellen

## Problem
`gh issue create --body "..."` ist fehleranfällig bei Sonderzeichen, Backticks und Umlauten im Shell-Kontext. Mehrere Läufe nötig – vermeiden.

## Lösung: immer --body-file verwenden

Der Alias `ghic` kapselt den gesamten Ablauf. Der Body wird **immer als lokale `.md`-Datei** übergeben.

## Workflow

### 1. Body-Datei erstellen

```bash
cp scripts/shell/issue_template.md /tmp/mein_issue.md
# Datei bearbeiten...
```

### 2. Issue anlegen mit ghic

```bash
# Grundform
ghic "Titel des Issues" /tmp/mein_issue.md

# Mit Labels
ghic "Titel des Issues" /tmp/mein_issue.md "feature,re ready"

# Mit Epic-Referenz
ghic "Titel des Issues" /tmp/mein_issue.md "feature,re ready" 14
```

### Parameter

| Position | Parameter | Pflicht | Default |
|---|---|---|---|
| $1 | Titel | ja | - |
| $2 | Pfad zur Body-.md-Datei | ja | - |
| $3 | Labels (kommagetrennt) | nein | feature,re ready |
| $4 | Epic-Nummer | nein | - |

### Feste Defaults (in ghic eingebaut)
- Project: gjo-se.com
- Assignee: gjo-se

## Warum keine Inline-Bodies?

- Backticks, Anführungszeichen, $, Umlaute brechen Shell-Interpolation
- Zeilenumbrüche in --body sind nicht portabel
- Debugging ist schwierig

## Template

Vorlage: `docs/runbooks/git/issue_template.md`
