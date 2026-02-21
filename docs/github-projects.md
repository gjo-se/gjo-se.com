# GitHub Projects — Kurzeinweisung

> GitHub Projects ist das integrierte Projektmanagement-Tool von GitHub.
> Es verbindet Issues, Pull Requests und Notizen direkt mit dem Repository —
> kein externes Tool (Jira, Trello) nötig.

---

## Konzept in 30 Sekunden

```
GitHub Project
  │
  ├── Issues        ← Aufgaben, Bugs, Features (im Repo angelegt)
  ├── Pull Requests ← werden automatisch verknüpft wenn Branch-Name passt
  └── Views         ← Board / Table / Roadmap — verschiedene Sichtweisen auf dieselben Daten
```

Ein **Item** im Project ist immer entweder:
- ein **Issue** aus dem Repo
- ein **Pull Request** aus dem Repo
- eine **Draft-Notiz** (noch kein Issue, nur Idee)

---

## Schritt 1 — Project anlegen

1. 👉 [github.com/orgs/gjo-se/projects/new](https://github.com/orgs/gjo-se/projects/new)
2. **„Board"** auswählen (Kanban-Ansicht)
3. Name: `gjo-se.com`
4. **„Create project"** klicken

---

## Schritt 2 — Columns (Spalten) einrichten

Standard-Spalten anpassen:

| Spalte | Bedeutung | GitFlow-Bezug |
|---|---|---|
| **Backlog** | Geplante Aufgaben, noch nicht gestartet | — |
| **In Progress** | Aktive Entwicklung | `feature/` Branch existiert |
| **In Review** | PR geöffnet, wartet auf Merge | PR offen gegen `develop` |
| **Done** | PR gemergt, Feature abgeschlossen | PR in `develop` gemergt |

Spalte umbenennen: Spalten-Header klicken → **„Edit column"**
Spalte hinzufügen: Ganz rechts **„+ Add column"**

---

## Schritt 3 — Repository verknüpfen

Damit Issues und PRs aus dem Repo automatisch ins Project übernommen werden können:

1. Project öffnen → oben rechts **„..."** → **„Settings"**
2. Links: **„Linked repositories"**
3. **„Link a repository"** → `gjo-se/gjo-se.com` auswählen

---

## Schritt 4 — Issue erstellen & zum Project hinzufügen

### Im Repository:
```
github.com/gjo-se/gjo-se.com → Issues → New issue
```

Felder ausfüllen:
- **Title:** Kurze, prägnante Beschreibung z.B. `feat: Health-Check Endpoint`
- **Description:** Was soll gebaut werden, Akzeptanzkriterien
- **Labels:** `feature` / `bug` / `docs` / `chore`
- **Assignees:** Dich selbst zuweisen
- **Projects:** Project `gjo-se.com` auswählen → Issue landet automatisch im Backlog

### Per GitHub CLI:
```bash
gh issue create \
  --title "feat: Health-Check Endpoint" \
  --body "Implementiert GET /health der { status: ok } zurückgibt." \
  --label "feature" \
  --assignee "@me" \
  --project "gjo-se.com"
```

---

## Schritt 5 — Issue mit Branch verknüpfen

Wenn du mit der Arbeit an einem Issue beginnst:

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

## Schritt 6 — Automatisierungen einrichten

GitHub Projects hat eingebaute Automationen:

1. Project → **„..."** → **„Workflows"**
2. Empfohlene Aktivierungen:

| Workflow | Auslöser | Aktion |
|---|---|---|
| **Item added to project** | Issue/PR wird hinzugefügt | → Status: `Backlog` |
| **Item reopened** | Issue/PR wird wieder geöffnet | → Status: `In Progress` |
| **Item closed** | Issue/PR wird geschlossen/gemergt | → Status: `Done` |
| **Pull request merged** | PR wird gemergt | → Status: `Done` |
| **Code changes requested** | Review verlangt Änderungen | → Status: `In Progress` |
| **Pull request reviewed** | Review approved | → Status: `In Review` |

---

## Views — verschiedene Ansichten

Im selben Project können mehrere Views nebeneinander existieren:

| View-Typ | Wofür |
|---|---|
| **Board** | Täglicher Überblick (Kanban) |
| **Table** | Alle Issues als Liste mit Filtern und Gruppierung |
| **Roadmap** | Zeitliche Planung (Start/End-Datum pro Issue) |

View hinzufügen: **„+ New view"** oben links im Project

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

---

> **Tipp:** Labels konsequent verwenden — `feature`, `bug`, `docs`, `chore`, `blocked`.
> Damit lässt sich der Backlog später filtern und priorisieren.
