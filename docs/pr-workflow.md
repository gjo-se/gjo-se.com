# PR Review & Merge — Schritt für Schritt

> Dieser Leitfaden erklärt den kompletten Pull-Request-Workflow für das Projekt `gjo-se.com`.
> Branch-Protection ist für `main` und `develop` aktiv — jede Änderung **muss** über einen PR laufen.

---

## Warum nicht direkt auf `develop` oder `main` pushen?

Branch-Protection erzwingt den PR-Workflow:

| Aktion | Erlaubt |
|---|---|
| Direkter `git push origin develop` | ❌ geblockt |
| Direkter `git push origin main` | ❌ geblockt |
| Feature-Branch pushen + PR öffnen | ✅ einziger Weg |
| Force-Push / Branch löschen | ❌ geblockt |
| PR selbst mergen (kein zweiter Reviewer nötig) | ✅ erlaubt (Weg B) |

---

## Schritt 1 — Feature-Branch erstellen

```bash
# GitFlow-Weg (empfohlen)
git flow feature start ISSUE-123-mein-feature

# Alternativ manuell
git checkout develop
git checkout -b feature/ISSUE-123-mein-feature
```

---

## Schritt 2 — Entwickeln & committen

```bash
# Änderungen vornehmen, dann:
git add .
git commit -m "feat: kurze Beschreibung der Änderung"
```

**Commit-Message-Konventionen:**

| Prefix | Wann |
|---|---|
| `feat:` | Neues Feature |
| `fix:` | Bugfix |
| `docs:` | Nur Dokumentation |
| `chore:` | Build, Tooling, Konfiguration |
| `refactor:` | Code-Umstrukturierung ohne Funktionsänderung |
| `test:` | Tests hinzugefügt oder angepasst |

---

## Schritt 3 — Branch pushen & PR öffnen

```bash
# Branch pushen
git push -u origin feature/ISSUE-123-mein-feature

# PR per GitHub CLI öffnen
gh pr create \
  --title "feat: kurze Beschreibung" \
  --body "Beschreibung der Änderung, Bezug zu Issue #123" \
  --base develop
```

Oder direkt im Browser:
👉 GitHub zeigt nach dem Push automatisch einen „Compare & pull request"-Button

---

## Schritt 4 — PR reviewen (im Browser)

1. **[github.com/gjo-se/gjo-se.com/pulls](https://github.com/gjo-se/gjo-se.com/pulls)** öffnen
2. Den PR anklicken
3. Tab **„Files changed"** → alle Änderungen prüfen
4. Button **„Review changes"** (oben rechts)
   - ● **Approve** wählen
   - Optional: Kommentar z.B. `LGTM` (Looks Good To Me)
   - **„Submit review"** klicken

---

## Schritt 5 — PR mergen

1. Button **„Merge pull request"** klicken
2. Merge-Strategie wählen:

| Strategie | Wann verwenden |
|---|---|
| **Squash and merge** ✅ | Standard — fasst alle Commits zu einem zusammen, hält History sauber |
| Merge commit | Wenn die einzelnen Commits erhalten bleiben sollen |
| Rebase and merge | Für linearen Commit-Verlauf ohne Merge-Commit |

3. Commit-Message prüfen / anpassen
4. **„Confirm squash and merge"** klicken

---

## Schritt 6 — Aufräumen

```bash
# Nach dem Merge: lokalen Branch löschen und develop aktualisieren
git checkout develop
git pull
git branch -d feature/ISSUE-123-mein-feature

# Remote-Branch wurde durch GitHub automatisch gelöscht (falls so konfiguriert)
# Alternativ manuell:
git push origin --delete feature/ISSUE-123-mein-feature
```

---

## Kompletter Workflow auf einen Blick

```
develop
  │
  ├── git flow feature start ISSUE-123-mein-feature
  │         │
  │         ├── entwickeln & committen
  │         ├── git push -u origin feature/...
  │         └── gh pr create --base develop
  │                   │
  │                   ├── Review in GitHub
  │                   └── Squash and merge → develop
  │
  └── git pull (develop aktualisiert)
```

---

## Häufige Fehler

| Fehler | Ursache | Lösung |
|---|---|---|
| `protected branch hook declined` | Direkter Push auf `develop`/`main` | Feature-Branch verwenden + PR öffnen |
| `fatal: 'origin' does not appear to be a git repository` | Remote nicht gesetzt | `git remote add origin <url>` |
| PR kann nicht gemergt werden | CI-Checks schlagen fehl | Fehler lokal beheben, committen, pushen |

---

> **Tipp:** Mit `gh pr status` siehst du jederzeit den Status aller deiner offenen PRs im Terminal.
