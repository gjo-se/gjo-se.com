# ============================================================
# gjo-se.com — Shell Aliases & Functions
# ------------------------------------------------------------
# ============================================================

# ------------------------------------------------------------
# GitFlow Shortcuts
# ------------------------------------------------------------

# ------------------------------------------------------------
# Schnell-Shortcut für CLI & Roles: Sam & Co
# ------------------------------------------------------------

# ------------------------------------------------------------
# PM: Rohidee als GitHub Issue anlegen (Label: idea)
# ------------------------------------------------------------
# Verwendung:
#   gf_idea "<titel>" ["<beschreibung>"]
#
# Beispiel:
#   gf_idea "Dark Mode für Dashboard"
#   gf_idea "Dark Mode für Dashboard" "Nutzer wünschen sich einen Dark Mode für das Dashboard."
# ------------------------------------------------------------
gf_idea() {
  local title="$1"
  local body="${2:-}"

  if [[ -z "$title" ]]; then
    echo "Verwendung: gf_idea \"<titel>\" [\"<beschreibung>\"]"
    echo "Beispiel:   gf_idea \"Dark Mode für Dashboard\""
    return 1
  fi

  gh issue create \
    --title "$title" \
    --body "$body" \
    --label "idea" \
    --project "gjo-se.com" \
    --assignee "gjo-se"
}

gf_task(){
  local issue="$1"
  local msg="${2:-ISSUE-${1}}"
  local files="${3:-.}"

  if [[ -z "$issue" ]]; then
    echo "Verwendung: gf_task <issue-nr> [commit-msg] [files]"
    return 1
  fi

  local branch="ISSUE-${issue}"

  git flow feature start "$branch" \
    && git add "$files" \
    && git commit -m "$msg" \
    && git push -u origin "feature/${branch}" --force-with-lease \
    && gh pr create \
         --title "$msg" \
         --body "Closes #${issue}" \
         --base develop
}

# ------------------------------------------------------------
# Einmalig alle bereits gemergten Feature-Branches aufräumen
# ------------------------------------------------------------
# Was passiert:
#   1. Wechsel auf develop + pull
#   2. Alle lokalen Branches die in develop enthalten sind → löschen
#   3. Veraltete Remote-Tracking-Referenzen entfernen
# ------------------------------------------------------------
gf_cleanup() {
  echo "🔍 Wechsle auf develop..."
  git checkout develop && git pull || return 1

  echo ""
  echo "🗑️  Folgende Branches werden gelöscht (bereits in develop enthalten):"
  git branch --merged develop | grep -v '^\*\|main\|develop'

  echo ""
  read -r "confirm?▶ Löschen? [Enter = ja / Ctrl+C = abbrechen] "

  git branch --merged develop \
    | grep -v '^\*\|main\|develop' \
    | xargs -r git branch -d

  echo ""
  echo "🧹 Remote-Tracking-Referenzen aufräumen..."
  git remote prune origin

  echo ""
  echo "✅ Fertig — alle gemergten Branches entfernt."
}

gf_merge() {
  local pr="$1"
  local branch

  branch=$(gh pr view "$pr" --json headRefName --jq '.headRefName')

  gh pr merge "$pr" --squash --delete-branch \
    && git checkout develop \
    && git pull \
    && git branch -d "$branch" 2>/dev/null \
    && git remote prune origin
}

# ------------------------------------------------------------
# Gezieltes Stashen — interaktive Dateiauswahl via fzf
# ------------------------------------------------------------
# Verwendung:
#   gf_stash <stash-name>
#
# Beispiel:
#   gf_stash "ISSUE-42"
#
# Voraussetzung: fzf installiert (brew install fzf)
# Navigation:    TAB = auswählen, SHIFT+TAB = abwählen, ENTER = bestätigen
# ------------------------------------------------------------
gf_stash() {
  local stash_name="$1"

  if [[ -z "$stash_name" ]]; then
    echo "Verwendung: gf_stash <stash-name>"
    echo "Beispiel:   gf_stash \"ISSUE-42\""
    return 1
  fi

  if ! command -v fzf &>/dev/null; then
    echo "❌ fzf nicht installiert. Bitte ausführen: brew install fzf"
    return 1
  fi

  # Alle geänderten + neuen Dateien ermitteln
  local all_files
  all_files=$(git status --short | awk '{print $NF}')

  if [[ -z "$all_files" ]]; then
    echo "✅ Keine geänderten Dateien vorhanden."
    return 0
  fi

  # Alles stagen damit git diff --cached für Preview funktioniert
  echo "$all_files" | xargs git add --

  # Interaktive Auswahl via fzf — Preview via git diff --cached
  local selected
  selected=$(echo "$all_files" | fzf \
    --multi \
    --prompt="📦 Dateien für Stash \"${stash_name}\" auswählen > " \
    --header="TAB = auswählen  |  SHIFT+TAB = abwählen  |  ENTER = bestätigen  |  ESC = abbrechen" \
    --preview='git diff --cached -- {}' \
    --preview-window=right:60%)

  if [[ -z "$selected" ]]; then
    echo "⚠️  Keine Dateien ausgewählt — alle Dateien werden wieder unstaged."
    git restore --staged . 2>/dev/null || git reset HEAD .
    return 0
  fi

  # Nicht ausgewählte Dateien wieder unstagen
  local not_selected
  not_selected=$(comm -23 <(echo "$all_files" | sort) <(echo "$selected" | sort))
  if [[ -n "$not_selected" ]]; then
    echo "$not_selected" | xargs git restore --staged -- 2>/dev/null \
      || echo "$not_selected" | xargs git reset HEAD --
  fi

  echo ""
  echo "📦 Folgende Dateien werden gestasht unter \"${stash_name}\":"
  echo "$selected" | while read -r f; do
    echo "   • $f"
  done
  echo ""
  read -r "confirm?▶ Stashen? [Enter = ja / Ctrl+C = abbrechen] "

  local files_array
  files_array=(${(f)selected})
  git stash push -m "$stash_name" -- "${files_array[@]}"

  # Sicherheitshalber sicherstellen dass nichts ungewollt gestaged bleibt
  git restore --staged . 2>/dev/null || true
}

# ------------------------------------------------------------
# GitFlow Dev Shortcut — feature start + commit + push + PR in einem Schritt
# ------------------------------------------------------------
# Vollaufruf:
#   gf_dev <feature-branch> <commit-msg> <pr-title> <issue-nr> [files]
#
# Kurzaufruf (alle Parameter optional — werden aus Git-Kontext abgeleitet):
#   gf_dev
#
# Auto-Detect:
#   branch    → aktueller Feature-Branch (ohne "feature/"-Prefix)
#               oder automatisch aus geänderten Dateien generiert:
#               z.B. docs/roles/dave.md + scripts/shell/git.zsh → "roles-dave-git"
#   files     → alle geänderten Dateien (default: ".")
#   commit-msg→ "feat: <branch-name>"
#   pr-title  → gleich wie commit-msg
#   issue-nr  → optional — aus Branch-Name (42-foo) oder letztem Commit (#42)
#               wird nichts gefunden: PR ohne "Closes #N"
#
# Bestätigung:
#   Vor der Ausführung wird eine Zusammenfassung angezeigt.
#   Einmalig Enter drücken → alle Schritte laufen durch.
# ------------------------------------------------------------
gf_dev() {
  local branch="$1"
  local commit_msg="$2"
  local pr_title="$3"
  local issue_nr="$4"
  local files="${5:-.}"

  # --- Auto-Detect Branch ---
  if [[ -z "$branch" ]]; then
    local current
    current=$(git branch --show-current)

    if [[ "$current" == feature/* ]]; then
      # bereits auf Feature-Branch → Name übernehmen
      branch="${current#feature/}"
    else
      # auf develop/main → Branch-Name aus geänderten Dateien ableiten
      local changed
      changed=$(git diff --name-only HEAD)
      if [[ -z "$changed" ]]; then
        changed=$(git diff --name-only)
      fi

      if [[ -z "$changed" ]]; then
        echo "❌ Keine geänderten Dateien gefunden. Branch-Namen bitte angeben."
        return 1
      fi

      # Dateinamen (ohne Extension) extrahieren, deduplizieren, zusammensetzen
      local raw_branch
      raw_branch=$(echo "$changed" \
        | xargs -I{} basename {} \
        | sed 's/\.[^.]*$//' \
        | tr '[:upper:]' '[:lower:]' \
        | sed 's/[^a-z0-9]/-/g' \
        | sort -u \
        | tr '\n' '-' \
        | sed 's/-$//' \
        | cut -c1-40)

      # Inhalt des Diffs auf domänenspezifische Schlüsselwörter analysieren
      # (keine Commit-Typen wie feat/fix/refactor — die kommen im Diff selbst vor)
      local diff_summary
      diff_summary=$(git diff HEAD -- $changed 2>/dev/null \
        | grep '^+' \
        | grep -v '^+++' \
        | grep -oiE 'role|runbook|script|workflow|docker|pipeline|deploy|fachwissen|zusammenarbeit|kernaufgaben|monitoring|secrets|alias|shortcut|precommit|linting|environment|umgebung' \
        | tr '[:upper:]' '[:lower:]' \
        | sort | uniq -c | sort -rn \
        | awk '{print $2}' \
        | head -3 \
        | tr '\n' '-' \
        | sed 's/-$//')

      if [[ -n "$diff_summary" ]]; then
        branch="${diff_summary}-${raw_branch}"
      else
        branch="$raw_branch"
      fi

      branch=$(echo "$branch" | cut -c1-50)

      # Commit-Message aus Dateiliste + Diff-Summary ableiten
      if [[ -z "$commit_msg" ]]; then
        local file_hint
        file_hint=$(echo "$changed" | xargs -I{} basename {} | sed 's/\.[^.]*$//' | sort -u | tr '\n' ', ' | sed 's/, $//')
        if [[ -n "$diff_summary" ]]; then
          commit_msg="feat: ${diff_summary} (${file_hint})"
        else
          commit_msg="feat: update ${file_hint}"
        fi
      fi
    fi
  fi

  # --- Auto-Detect Issue-Nr (optional) ---
  if [[ -z "$issue_nr" ]]; then
    issue_nr=$(echo "$branch" | grep -oE '^[0-9]+|[0-9]+$' | head -1)
    if [[ -z "$issue_nr" ]]; then
      issue_nr=$(git log -1 --pretty=%s | grep -oE '#[0-9]+' | tr -d '#' | head -1)
    fi
  fi

  # --- Auto-Detect Commit-Message (Fallback) ---
  if [[ -z "$commit_msg" ]]; then
    commit_msg="feat: ${branch}"
  fi

  # --- Auto-Detect PR-Title ---
  if [[ -z "$pr_title" ]]; then
    pr_title="$commit_msg"
  fi

  local pr_body
  if [[ -n "$issue_nr" ]]; then
    pr_body="Closes #${issue_nr}"
  else
    pr_body="—"
  fi

  # --- Zusammenfassung & einmalige Bestätigung ---
  echo ""
  echo "┌─────────────────────────────────────────────┐"
  echo "│  gf_dev — Zusammenfassung                   │"
  echo "├─────────────────────────────────────────────┤"
  printf "│  🔀 Branch  : feature/%-23s│\n" "$branch"
  printf "│  📝 Commit  : %-29s│\n" "${commit_msg:0:29}"
  printf "│  🏷️ PR-Titel: %-29s│\n" "${pr_title:0:29}"
  if [[ -n "$issue_nr" ]]; then
    printf "│  🔗 Issue   : #%-28s│\n" "$issue_nr"
  else
    echo "│  ℹ️  Issue   : kein Issue verknüpft          │"
  fi
  printf "│  📁 Files   : %-29s│\n" "${files:0:29}"
  echo "└─────────────────────────────────────────────┘"
  echo ""
  read -r "confirm?▶ Ausführen? [Enter = ja / Ctrl+C = abbrechen] "

  # --- Auf Feature-Branch wechseln oder anlegen ---
  local current_branch
  current_branch=$(git branch --show-current)
  if [[ "$current_branch" != "feature/$branch" && "$current_branch" != "$branch" ]]; then
    GIT_EDITOR=true git flow feature start "$branch" || return 1
  fi

  GIT_EDITOR=true git add "$files" \
    && GIT_EDITOR=true git commit --no-edit -m "$commit_msg" \
    && git push -u origin "feature/$branch" \
    && gh pr create \
         --title "$pr_title" \
         --body "$pr_body" \
         --base develop
}

# ------------------------------------------------------------
# GitHub Issue erstellen (immer über lokale .md-Datei)
# ------------------------------------------------------------
# Verwendung:
#   ghic <title> <body-file.md> [label1,label2] [epic-nr]
#
# Beispiel:
#   ghic "Systemvoraussetzungen einrichten" /tmp/issue_body.md "feature,re ready" 14
#
# - body-file: beliebige .md-Datei, Sonderzeichen & Umlaute sicher
# - labels:    kommagetrennt, optional (default: "feature,re ready")
# - epic-nr:   optional, fügt "Epic: #N" ans Ende des Body an
# ------------------------------------------------------------
ghic() {
  local title="$1"
  local bodyfile="$2"
  local labels="${3:-feature,re ready}"
  local epic="$4"

  if [[ -z "$title" || -z "$bodyfile" ]]; then
    echo "Verwendung: ghic <title> <body-file.md> [labels] [epic-nr]"
    return 1
  fi

  if [[ ! -f "$bodyfile" ]]; then
    echo "Fehler: Datei '$bodyfile' nicht gefunden."
    return 1
  fi

  # Epic-Referenz ans Ende der Datei anhängen (temporäre Kopie)
  local tmpfile
  tmpfile=$(mktemp /tmp/ghic_body_XXXXXX.md)
  cp "$bodyfile" "$tmpfile"

  if [[ -n "$epic" ]]; then
    echo "" >> "$tmpfile"
    echo "Epic: #${epic}" >> "$tmpfile"
  fi

  gh issue create \
    --title "$title" \
    --body-file "$tmpfile" \
    --project "gjo-se.com" \
    --assignee "gjo-se" \
    --label "$labels"

  rm -f "$tmpfile"
}
