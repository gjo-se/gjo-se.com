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

gfm() {
  gh pr merge "$1" --squash --delete-branch
#  git flow feature finish roles-setup - so solte er doch eher enden, oder?

#  gh pr merge "$1" --squash --delete-branch \
#    && git checkout develop \
#    && git pull \
#    && git branch -d "feature/$2"
}
