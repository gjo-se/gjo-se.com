# Sourcetree — Remote Repository einbinden

> Das lokale Repository ist bereits vorhanden unter:
> `/Users/gregoryjodaily/Dropbox/5-Berufsleben/gjoSe/Development/Projects/python/gjo-se.com`
> Diese Anleitung zeigt, wie du es in Sourcetree öffnest und das GitHub Remote `origin` einbindest.

---

## Schritt 1 — Lokales Repo in Sourcetree öffnen

1. Sourcetree starten
2. Oben links: **„New"** → **„Add existing local repository"**
3. Im Finder-Dialog navigieren zu:
   `/Users/gregoryjodaily/Dropbox/5-Berufsleben/gjoSe/Development/Projects/python/gjo-se.com`
4. **„Add"** klicken

Das Repo erscheint jetzt in der Sourcetree-Seitenleiste unter „Local".

---

## Schritt 2 — Prüfen ob Remote bereits gesetzt ist

Im linken Panel unter **„REMOTES"** sollte `origin` erscheinen mit:
```
https://github.com/gjo-se/gjo-se.com.git
```

Falls `origin` bereits sichtbar ist → direkt zu **Schritt 4**.

Falls nicht → weiter mit **Schritt 3**.

---

## Schritt 3 — Remote `origin` manuell hinzufügen

1. Oben in der Toolbar: **„Repository"** → **„Repository Settings..."**
2. Tab **„Remotes"** öffnen
3. Button **„Add"** klicken
4. Felder ausfüllen:
   - **Remote Name:** `origin`
   - **URL / Path:** `https://github.com/gjo-se/gjo-se.com.git`
5. **„OK"** klicken

---

## Schritt 4 — Branches prüfen

Im linken Panel solltest du jetzt sehen:

```
BRANCHES (local)
  ├── develop  ← aktueller Branch
  └── main

REMOTES
  └── origin
        ├── develop
        └── main
```

Falls `origin/develop` und `origin/main` fehlen:
- Toolbar: **„Fetch"** klicken (holt alle Remote-Branches ohne Merge)

---

## Schritt 5 — develop aktualisieren (Pull)

1. Im linken Panel **`develop`** doppelklicken → Branch wechseln
2. Toolbar: **„Pull"** klicken
3. Im Dialog:
   - **„Pull from remote:"** `origin`
   - **„Remote branch to pull:"** `develop`
   - ☑ **„Rebase instead of merge"** (optional, hält History sauber)
4. **„OK"** klicken

---

## Schritt 6 — GitHub Authentication in Sourcetree

Falls beim Pull/Push ein Login-Dialog erscheint:

1. **„Accounts"** → Sourcetree → **Preferences → Accounts**
2. **„Add"** → **GitHub**
3. Wähle **„OAuth"** → Browser öffnet sich → mit `gjo-se` Account einloggen
4. **„Allow"** klicken → zurück in Sourcetree

> **Alternativ mit Token:**
> Statt OAuth: Preferences → Accounts → Add → GitHub → **„Personal Access Token"**
> Token erstellen unter: [github.com/settings/tokens](https://github.com/settings/tokens)
> Scopes: `repo`, `workflow`

---

## Täglicher Workflow in Sourcetree

| Aktion | Sourcetree | Äquivalenter Terminal-Befehl |
|---|---|---|
| Änderungen holen | **Fetch** (kein Merge) | `git fetch --all` |
| Branch aktualisieren | **Pull** auf aktivem Branch | `git pull` |
| Feature-Branch erstellen | **Branch** → neuer Branch von `develop` | `git flow feature start ...` |
| Änderungen committen | **Commit** im unteren Panel | `git commit -m "..."` |
| Branch pushen | **Push** → Branch auswählen | `git push -u origin feature/...` |
| PR öffnen | Link in Sourcetree → GitHub öffnet sich | `gh pr create ...` |
| Nach Merge aufräumen | Branch im Panel → Rechtsklick → **Delete** | `git branch -d feature/...` |

---

## Branch-Protection in Sourcetree sichtbar

Wenn du versuchst direkt auf `develop` oder `main` zu pushen, siehst du:

```
Push rejected:
  ! [remote rejected] develop -> develop (protected branch hook declined)
```

→ Das ist korrekt. Immer über einen Feature-Branch + PR arbeiten.

---

## Sourcetree GitFlow-Integration aktivieren

Sourcetree hat GitFlow eingebaut:

1. Toolbar: **„Git-flow"** Button (oben rechts)
2. **„Initialize Repository"** → Defaults bestätigen (entspricht `git flow init -d`)
3. Ab jetzt: **„Git-flow"** → **„Start New Feature/Release/Hotfix"** direkt aus der UI

> Da `git flow init -d` bereits im Terminal ausgeführt wurde, erkennt Sourcetree
> die bestehende Konfiguration automatisch.
