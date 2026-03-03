# AI in PyCharm – Überblick & Best Practices

> **REX-Research** | Stand: März 2026 | Sprache: Deutsch
> Gesicherte Fakten sind als ✅ markiert, Einschätzungen als 💡.

---

## Zusammenfassung

In PyCharm stehen drei relevante AI-Assistenz-Optionen zur Verfügung:

| Option | Anbieter | Einstieg |
|---|---|---|
| **JetBrains AI Assistant** | JetBrains | In PyCharm integriert, eigenes Abo |
| **GitHub Copilot** (inkl. Chat) | GitHub / Microsoft | Plugin, GitHub-Abo erforderlich |
| **Codeium / Windsurf** | Codeium | Plugin, Freemium |

💡 **Empfehlung auf einen Blick:** Für dieses Projekt (Python, GitHub-Workflows, Copilot bereits in Nutzung) ist **GitHub Copilot** die stärkste Option – insbesondere durch die Chat-, Edit- und Plan-Modi sowie die `.github/copilot-instructions.md`-Integration.

---
## Verfügbare Modelle in GitHub Copilot (PyCharm/JetBrains, Stand März 2026)

### Sondermodell

| Modell | Faktor | Verhalten | Güte |
|---|---|---|---|
| **Auto** | variable | Copilot wählt automatisch das passende Modell je nach Aufgabe | 💡 Guter Standard-Einstieg |

### Premium Models

| Modell | Anbieter | Faktor | Stärke | Ideal für | Güte |
|---|---|---|---|---|---|
| **Claude Haiku 4.5** | Anthropic | 0,33× | Sehr schnell, günstig, leichtgewichtig | Einfache Fragen, schnelle Completions, Boilerplate | ⭐⭐⭐ |
| **Claude Opus 4.5** | Anthropic | 3,0× | Stärkstes Anthropic-Modell, tiefes Reasoning | Komplexe Architektur, lange Multi-File-Aufgaben | ⭐⭐⭐⭐⭐ |
| **Claude Opus 4.6** | Anthropic | 3,0× | Neueste Opus-Generation, maximale Qualität | Anspruchsvollste Plan-Aufgaben, komplexes Debugging | ⭐⭐⭐⭐⭐ |
| **Claude Sonnet 4** | Anthropic | 1,0× | Ausgewogene Qualität & Geschwindigkeit | Edit-Modus, Code-Reviews, saubere Implementierungen | ⭐⭐⭐⭐⭐ |
| **Claude Sonnet 4.5** | Anthropic | 1,0× | Verbesserte Sonnet-Generation | Plan-Modus, Multi-File-Implementierungen | ⭐⭐⭐⭐⭐ |
| **Claude Sonnet 4.6** ✅ *aktuell* | Anthropic | 1,0× | Neueste Sonnet-Generation, bestes Preis-Leistungs-Verhältnis | **Primärempfehlung:** Plan & Edit für dieses Projekt | ⭐⭐⭐⭐⭐ |
| **GPT-5.1** | OpenAI | 1,0× | Starkes Allround-Modell | Ask, Edit, alltägliche Coding-Tasks | ⭐⭐⭐⭐ |
| **GPT-5.1-Codex** | OpenAI | 1,0× | Code-optimiert, präzise Implementierungen | Edit-Modus, Codegenerierung | ⭐⭐⭐⭐⭐ |
| **GPT-5.1-Codex-Max** | OpenAI | 1,0× | Maximale Codex-Variante, höchste Code-Qualität | Komplexe Implementierungen, große Refactorings | ⭐⭐⭐⭐⭐ |
| **GPT-5.1-Codex-Mini** | OpenAI | 0,33× | Günstige Codex-Variante | Schnelle Code-Completions, einfache Tasks | ⭐⭐⭐ |
| **GPT-5.2** | OpenAI | 1,0× | Verbesserte GPT-5-Generation | Code-Reviews, Erklärungen, Ask-Modus | ⭐⭐⭐⭐ |
| **GPT-5.2-Codex** | OpenAI | 1,0× | Code-optimiertes GPT-5.2 | Edit & Plan für Python-Projekte | ⭐⭐⭐⭐⭐ |
| **GPT-5.3-Codex** | OpenAI | 1,0× | Neueste Codex-Generation | Cutting-Edge Code-Implementierungen | ⭐⭐⭐⭐⭐ |
| **Gemini 2.5 Pro** | Google | 1,0× | Stärkstes Kontextfenster, gut bei großen Codebasen | Große Dateien, langer Kontext, Architektur-Fragen | ⭐⭐⭐⭐ |
| **Gemini 3 Flash (Preview)** | Google | 0,33× | Sehr schnell, günstig | Einfache Fragen, Kontingent schonen | ⭐⭐⭐ |
| **Gemini 3 Pro (Preview)** | Google | 1,0× | Neue Gemini-Generation in Preview | Ausprobieren, langer Kontext | ⭐⭐⭐⭐ |
| **Grok Code Fast 1** | xAI | 0,25× | Extrem günstig, schnell | Notfall-Fallback wenn Kontingent fast leer | ⭐⭐⭐ |

### Standard Models (im Kontingent enthalten, kein Premium-Verbrauch)

| Modell | Anbieter | Faktor | Stärke | Ideal für | Güte |
|---|---|---|---|---|---|
| **GPT-4.1** | OpenAI | included | Solider Allrounder | Ask-Modus, einfache Fragen | ⭐⭐⭐ |
| **GPT-4o** | OpenAI | included | Schnell, bewährt | Alltägliche Tasks, schnelle Completions | ⭐⭐⭐⭐ |
| **GPT-5 mini** | OpenAI | included | Leichtgewichtig, schnell | Einfachste Anfragen, Inline-Hints | ⭐⭐⭐ |

> 💡 Faktor-Angaben direkt aus dem Copilot-UI (Stand März 2026). GitHub kann diese jederzeit anpassen → [GitHub Copilot – Model pricing](https://docs.github.com/en/copilot/using-github-copilot/ai-models/changing-the-ai-model-for-copilot-chat)

---

### Best Practice: Welches Modell wann?

| Situation | Empfohlenes Modell | Faktor | Begründung |
|---|---|---|---|
| **Plan-Modus** (komplexe Implementierung) | Claude Sonnet 4.6 | 1,0× | Bestes Preis-Leistungs-Verhältnis, starkes Reasoning |
| **Plan-Modus** (maximale Qualität, egal was es kostet) | Claude Opus 4.6 | 3,0× | Höchste Qualität – bewusst einsetzen |
| **Edit-Modus** (gezielte Code-Änderung) | GPT-5.1-Codex oder Claude Sonnet 4.6 | 1,0× | Code-optimiert, präzise, zuverlässig |
| **Ask-Modus** (Erklärung, Code-Review) | GPT-4o oder GPT-5.2 | included / 1,0× | Kosteneffizient, schnell |
| **Inline Completion** | (automatisch) | – | Copilot wählt intern, nicht manuell wählbar |
| **Große Dateien / langer Kontext** | Gemini 2.5 Pro | 1,0× | Stärkstes Kontextfenster |
| **Kontingent schonen** | Claude Haiku 4.5 oder Gemini 3 Flash | 0,33× | ~3× mehr Anfragen pro Kontingent |
| **Kontingent fast leer** | Grok Code Fast 1 | 0,25× | ~4× mehr Anfragen – Notfall-Fallback |
| **Standard ohne Premium-Verbrauch** | GPT-4o | included | Immer verfügbar, keine Premium-Kosten |

---

## Vergleich der Optionen

### 1. JetBrains AI Assistant

✅ Direkt in PyCharm eingebaut – kein separates Plugin nötig (ab PyCharm 2023.3)
✅ Unterstützt mehrere Modelle: JetBrains-eigene Modelle, GPT-4o, Google Gemini (je nach Tarif)
✅ Tiefe IDE-Integration: Inline-Completion, AI-gestützte Refactorings, Commit-Message-Generierung, Test-Generierung, Erklärungen direkt im Editor

| Merkmal | Details |
|---|---|
| **Preis** | Im All Products Pack enthalten; einzeln ~ca. 10 €/Monat (💡 Preise können sich ändern) |
| **Chat** | ✅ Ja – AI Assistant Chat-Fenster |
| **Inline Completion** | ✅ Ja |
| **Kontextquellen** | Aktuell geöffnete Datei, Projekt-Dateien (manuell hinzufügbar) |
| **Stärken** | Nahtlose IDE-Integration, JetBrains-spezifische Aktionen (Intention Actions, Refactoring) |
| **Schwächen** | Kein Agentic-Modus, kein „Plan"-Feature, weniger mächtig bei komplexen Multi-File-Aufgaben |

---

### 2. GitHub Copilot (+ Copilot Chat)

✅ Via Plugin: `Settings → Plugins → GitHub Copilot`
✅ Unterstützte Modelle (Stand März 2026): GPT-4o, Claude 3.5 Sonnet, Claude 3.7 Sonnet, Gemini 2.0 Flash, o3-mini – **wählbar im Chat**
✅ Drei Chat-Modi: **Ask**, **Edit**, **Plan** (siehe Abschnitt unten)
✅ Kontext-Steuerung über `#file`, `#selection`, `@workspace`
✅ `.github/copilot-instructions.md` → projektweite Instruktionen für alle Copilot-Anfragen
✅ `AGENTS.md` → Rollen-Definitionen für den Agent-Modus

| Merkmal | Details |
|---|---|
| **Preis** | Individual: ~10 €/Monat; Business: ~19 €/Monat |
| **Chat** | ✅ Ja – Copilot Chat Panel |
| **Inline Completion** | ✅ Ja |
| **Kontextquellen** | `#file`, `#selection`, `@workspace`, gesamtes Repo (Agent-Modus) |
| **Stärken** | Mächtigster Agentic-Modus, Modellwahl, tiefe GitHub-Integration, `AGENTS.md`-Support |
| **Schwächen** | Premium Requests können bei intensiver Nutzung aufgebraucht werden |

---

### 3. Codeium / Windsurf

✅ Kostenloser Einstieg (Freemium)
✅ Inline Completion, Chat, Refactoring
💡 Weniger stark in der PyCharm-Integration als Copilot oder JetBrains AI Assistant
💡 Gut als Fallback oder für reine Inline-Completion ohne Agentic-Anforderungen

| Merkmal | Details |
|---|---|
| **Preis** | Free Tier verfügbar; Pro ~ca. 15 $/Monat |
| **Chat** | ✅ Ja |
| **Inline Completion** | ✅ Ja |
| **Stärken** | Kostenlos einsteigerfreundlich, gute Completion-Qualität |
| **Schwächen** | Kein Plan-Modus, kein `AGENTS.md`-Support, schwächere Multi-File-Intelligenz |

---

## Das „Plan"-Feature (GitHub Copilot Chat)

### Was ist „Plan"?

✅ „Plan" ist ein **Agentic-Modus** im GitHub Copilot Chat – verfügbar in VS Code und JetBrains IDEs (ab Copilot-Plugin ~1.240+).

Im Chat gibt es drei Modi, wählbar über ein Dropdown links neben dem Eingabefeld:

| Modus | Verhalten |
|---|---|
| **Ask** | Beantwortet Fragen, erklärt Code, gibt Empfehlungen – **schreibt keine Dateien** |
| **Edit** | Nimmt direkte Code-Änderungen vor – in ausgewählten Dateien oder `#file`-Referenzen |
| **Plan** (= Agent) | Plant eigenständig mehrstufige Aufgaben, durchsucht das gesamte Repository, liest und schreibt mehrere Dateien, führt Terminal-Befehle aus – **vollständig autonom** |

### Wann „Plan" einsetzen?

✅ Für komplexe, mehrstufige Aufgaben: z.B. „Erstelle ein neues Feature inkl. Tests, Dokumentation und GitHub Issue"
✅ Wenn Copilot selbst entscheiden soll, welche Dateien relevant sind
💡 Plan verbraucht mehr **Premium Requests** als Ask/Edit – bewusst einsetzen
💡 Im Plan-Modus gelten `AGENTS.md` und `.github/copilot-instructions.md` als primäre Steuerungsdokumente

### Zusammenhang mit diesem Projekt

In diesem Repo wird `AGENTS.md` genutzt, um Rollen (DAVE, REX, ARIA etc.) zu definieren.
Der Plan-Agent liest `AGENTS.md` automatisch und hält sich an die dort definierten Verhaltensregeln.

---

## Empfohlene Settings für maximalen Nutzen

### PyCharm – GitHub Copilot Plugin

| Einstellung | Pfad | Empfehlung |
|---|---|---|
| **Plugin aktivieren** | `Settings → Plugins → GitHub Copilot` | ✅ Installieren & aktivieren |
| **Inline Completion** | `Settings → Languages & Frameworks → GitHub Copilot` | ✅ Enable completions aktivieren |
| **Completion Delay** | ebenda | 💡 auf `0` oder minimal stellen für schnelle Vorschläge |
| **Modellwahl im Chat** | Dropdown im Chat-Panel | ✅ Claude Sonnet 4.6 für komplexe Aufgaben; GPT-4o (included) für schnelle Fragen |
| **Chat-Modus wählen** | Dropdown links im Chat | ✅ Ask für Fragen, Edit für Änderungen, Plan für Agenten-Aufgaben |

### Projekt-Konfiguration (Repository)

| Datei | Zweck | Empfehlung |
|---|---|---|
| `.github/copilot-instructions.md` | Projektweite Instruktionen für alle Copilot-Anfragen | ✅ Anlegen mit Projekt-Konventionen, Tech-Stack, Coding-Standards |
| `AGENTS.md` | Rollen-Definitionen für den Plan/Agent-Modus | ✅ Bereits vorhanden – aktuell halten |
| `docs/roles/*.md` | Detaillierte Rollenbeschreibungen | ✅ Bereits vorhanden |

### Allgemeine Best Practices

- **Kontext explizit machen:** Im Chat immer `#file:pfad/zur/datei.py` oder `#selection` nutzen – Copilot arbeitet präziser mit explizitem Kontext
- **`@workspace` nutzen:** Im Plan-/Edit-Modus `@workspace` verwenden, damit Copilot das gesamte Repo durchsucht
- **Premium Requests schonen:** Ask-Modus für einfache Fragen, Plan nur für komplexe Agenten-Aufgaben
- **Modell anpassen:** Claude Sonnet 4.6 für lange, komplexe Aufgaben; GPT-4o (included) / Gemini 3 Flash für schnelle Tasks
- **`copilot-instructions.md` pflegen:** Je präziser die Projektkonventionen darin beschrieben sind, desto besser der Output

---

## Empfehlung

💡 **Für dieses Projekt:**

1. **GitHub Copilot** als primäres Tool – wegen AGENTS.md-Support, Modellwahl, Plan-Modus und GitHub-Integration
2. **JetBrains AI Assistant** optional als Ergänzung für IDE-spezifische Aktionen (Refactoring, Intention Actions)
3. `.github/copilot-instructions.md` anlegen mit Projekt-Tech-Stack und Konventionen → sofortiger Qualitätsgewinn
4. Im Chat-Alltag: **Ask** für Fragen, **Edit** für gezielte Änderungen, **Plan** für komplexe Agenten-Aufgaben

---

## Quellen

- ✅ [GitHub Copilot Docs – Chat modes](https://docs.github.com/en/copilot/using-github-copilot/copilot-chat/using-github-copilot-chat-in-your-ide) (Stand März 2026)
- ✅ [JetBrains AI Assistant – Übersicht](https://www.jetbrains.com/ai/) (Stand März 2026)
- ✅ [GitHub Copilot – Supported models](https://docs.github.com/en/copilot/using-github-copilot/ai-models/changing-the-ai-model-for-copilot-chat) (Stand März 2026)
- ✅ [Codeium / Windsurf](https://codeium.com) (Stand März 2026)
- 💡 Preisangaben sind Richtwerte und können sich ändern – vor Abschluss direkt beim Anbieter prüfen
