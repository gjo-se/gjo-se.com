# ============================================================
# gjo-se.com — Shell Aliases & Functions
# ------------------------------------------------------------
# ============================================================

# ------------------------------------------------------------
# GitFlow Shortcuts
# ------------------------------------------------------------
gff() {
  git flow feature start "$1"
}

gfc() {
  git add "${1:-.}"
  git commit -m "$2"
}

gfcp() {
  git add "${1:-.}"
  git commit -m "$2" && git push -u origin "feature/$3"
}

gfpr() {
  gh pr create --title "$1" --body "Closes #$2" --base develop
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
#               z.B. docs/roles/dave.md + scripts/shell/github.zsh → "roles-dave-github"
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

  local pr_body=""
  if [[ -n "$issue_nr" ]]; then
    pr_body="Closes #${issue_nr}"
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
    git flow feature start "$branch" || return 1
  fi


  git add "$files" \
    && git commit -m "$commit_msg" \
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

gfm() {
  gh pr merge "$1" --squash --delete-branch
#  git flow feature finish roles-setup - so solte er doch eher enden, oder?

#  gh pr merge "$1" --squash --delete-branch \
#    && git checkout develop \
#    && git pull \
#    && git branch -d "feature/$2"
}
