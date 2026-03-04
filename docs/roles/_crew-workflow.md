# Crew-Workflow — gjo-se.com

> Dieser Leitfaden beschreibt den **vollständigen, redundanzfreien Workflow** vom ersten Impuls bis zum fertigen Feature auf `develop`.
> Jede Rolle hat genau eine Verantwortlichkeit – kein Artefakt existiert doppelt.
> **Goldene Regel:** Alle Artefakte leben final **nur in GitHub Issues** – lokale `.md`-Dateien sind temporäre Arbeitsdokumente und werden nach Übertragung ins Issue gelöscht.

---

## Überblick: Wer macht was?

```
PIA/PM: Rohidee
        │  → GitHub Issue anlegen (Label: idea)
        │
        │  for REX: Issue #<nr> recherchieren + Plan erstellen
        ▼
REX: Research
        │  → Research-/Plan-Dokument erstellen (temporär im Repo)
        │  → auf Aufforderung: Idea-Issue zum Epic ausbauen
        │  → lokales Research-Dokument löschen
        │
        │  for ARI: #<epic-issue-nr> Prompts/Sub-Issues erstellen
        ▼
ARI: Prompts + Sub-Issues
        │  → Prompt-Dokumente für Sub-Tasks erstellen (temporär im Repo)
        │  → auf Aufforderung: Sub-Issues anlegen und mit Epic verknüpfen
        │  → lokale Prompt-Dokumente löschen
        │
        │  for SAM: ticket <issue-nr> umsetzen
        ▼
SAM: Implementierung
        │  → Feature-Branch und Implementierung zum Issue
        │  → PR gegen develop
        │
        │  (optional) for HANNI: ticket <issue-nr> testen
        ▼
HANNI: QA / Testing
           → Test-Cases, Review, Feedback
```

---

## Artefakt-Lifecycle: Was entsteht wann, wo und wie lange?

| Artefakt | Erstellt von | Ablage (temporär) | Finale Ablage | Wann löschen |
|---|---|---|---|---|
| Rohidee | PIA / PM | — | ✅ GitHub Issue `idea` | nie (bleibt als Issue) |
| Research / Plan | REX | `docs/epics/<thema>/plan.md` | ✅ GitHub Issue `epic` (überschreibt `idea`) | nach Übertragung ins Issue |
| Prompts / Sub-Tasks | ARI | `docs/epics/<thema>/prompt-01.md` etc. | ✅ GitHub Issues `feature` | nach Übertragung in Issues |
| Runbooks / Guides | — | — | ✅ `docs/runbooks/` | nie |
| Rollendefinitionen | — | — | ✅ `docs/roles/` | nie |

> **Zweck der lokalen `.md`:** Kontrollmöglichkeit vor Übertragung – Review, Anpassung, Versionierung im Feature-Branch.
> **Nach Übertragung:** `git rm` + committen → Repo bleibt schlank, Issues sind Single Source of Truth.

---

## Schritt 1 — PIA/PM: Rohidee als GitHub Issue anlegen

PIA/PM wandelt eine Rohidee in ein GitHub Issue mit Label `idea` um und legt damit den initialen Backlog-Eintrag an.

**Ergebnis:** Ein `idea`-Issue (#X) existiert im Backlog und ist Ausgangspunkt für weitere Schritte.

---

## Schritt 2 — REX: Research + Plan erstellen

Auf Basis des `idea`-Issues erstellt REX ein Research-/Plan-Dokument, das den späteren Epic-Inhalt definiert.

Auf Aufforderung durch PIA/PM:
- Überführt REX den Research/Plan in das ursprüngliche Idea-Issue (dies wird zum `epic`)
- passt Labels und Beschreibung des Issues an
- entfernt das lokale Research-Dokument aus dem Repo

**Ergebnis:** Das ursprüngliche `idea`-Issue ist jetzt ein vollständig beschriebenes `epic`-Issue.

---

## Schritt 3 — ARI: Prompts und Sub-Issues erstellen

Ausgehend vom `epic`-Issue erstellt ARI strukturierte Prompts für alle benötigten Sub-Tasks als temporäre Prompt-Dokumente.

Auf Aufforderung durch PIA/PM:
- legt ARI zu jedem Prompt passende Sub-Issues (`feature`) an
- verknüpft diese Sub-Issues klar mit dem zugrunde liegenden `epic`
- entfernt die lokalen Prompt-Dokumente aus dem Repo

**Ergebnis:** Für das Epic existiert eine Menge klar definierter `feature`-Issues als Sub-Issues.

---

## Schritt 4 — SAM: Implementierung

SAM setzt die einzelnen `feature`-Issues um.

Für jedes ausgewählte Feature-Issue:
- erstellt SAM die notwendige Implementierung (Code + Tests)
- arbeitet in einem dedizierten Feature-Branch
- liefert einen PR gegen `develop`

**Ergebnis:** Der Code zum Feature ist implementiert, getestet und als PR gegen `develop` vorbereitet oder gemerged.

---

## Schritt 5 — HANNI: QA / Testing

(Optional, je nach Bedarf und Ticket-Vereinbarung.)

HANNI übernimmt QA/Testing für ausgewählte `feature`-Issues:
- definiert und dokumentiert Test-Cases
- testet das Verhalten gegen die Akzeptanzkriterien
- gibt Feedback bzw. Abnahme zurück ins Issue

**Ergebnis:** Das Feature ist aus QA-Sicht geprüft; Status/Ergebnis ist im zugehörigen Issue dokumentiert.
