## Rolle
SENIOR_DEV (Backend Engineer)

## Kontext
Teil des Projekt-Scaffoldings für gjo-se.com (Feature-Branch: `feature/project-scaffold`).
Phase 2 (Python-Umgebung & `pyproject.toml`) ist abgeschlossen – `uv`, `ruff`, `black` und `pytest` sind als Dev-Dependencies eingetragen.
Phase 3 richtet die automatisierten Git-Hooks via `pre-commit` ein, sodass kein Code ohne Lint- und Format-Prüfung committet werden kann.

Recherche-Grundlage: `docs/research/fastapi-research.md` → Abschnitt 6.

## Aufgabe
1. `.pre-commit-config.yaml` im Root-Verzeichnis des Repos anlegen
2. Hook-Gruppe 1 – **`pre-commit-hooks` v4.6.0** eintragen:
   - `trailing-whitespace`
   - `end-of-file-fixer`
   - `check-yaml`
   - `check-json`
   - `check-merge-conflict`
3. Hook-Gruppe 2 – **`ruff-pre-commit` v0.4.0** eintragen:
   - `ruff` mit `args: [--fix]`
   - `ruff-format`
4. Hook-Gruppe 3 – **`black` v24.4.2** eintragen:
   - `black`
5. Hook-Gruppe 4 – **lokaler `pytest`-Hook** eintragen:
   - `entry: uv run pytest backend/tests/ --tb=short -q`
   - `pass_filenames: false`
   - `always_run: false`
   - `files: ^backend/`
6. `pre-commit` im Repo aktivieren: `pre-commit install`
7. Einmaligen Durchlauf auf allen Dateien ausführen: `pre-commit run --all-files` – Ergebnis prüfen, Fehler beheben
8. Änderungen committen: `git add .pre-commit-config.yaml && git commit -m "Add pre-commit configuration"`

## Akzeptanzkriterien
- [ ] `.pre-commit-config.yaml` existiert im Root-Verzeichnis
- [ ] Alle vier Hook-Gruppen sind korrekt konfiguriert
- [ ] `pre-commit run --all-files` läuft ohne Fehler durch
- [ ] Ein `git commit` mit absichtlichem Trailing-Whitespace wird von pre-commit abgebrochen
- [ ] Ein `git commit` mit einem Ruff-Lint-Fehler wird abgebrochen
- [ ] `pytest`-Hook läuft nur, wenn Dateien unter `backend/` geändert wurden
- [ ] Kein auskommentierter Code, keine `print()`-Statements im Commit

## Constraints
- `.pre-commit-config.yaml` liegt im **Root** des Repos (nicht in `backend/`)
- `pytest`-Hook nutzt `uv run` – kein direktes `pytest`-Binary
- Die Hook-Versionen (`rev:`) exakt wie im Plan angegeben verwenden
- `black` bleibt als zusätzlicher Safety-Net-Hook erhalten (auch wenn `ruff-format` bereits formatiert)
- Keine Secrets, keine `.env`-Werte in Konfigurationsdateien
