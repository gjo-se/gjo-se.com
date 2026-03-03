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
