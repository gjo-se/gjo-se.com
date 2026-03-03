# ============================================================
# gjo-se.com — Shell Imports
# ------------------------------------------------------------
# einmalig einbinden in ~/.zshrc:
# echo 'source ~/Dropbox/5-Berufsleben/gjoSe/Development/Projects/python/gjo-se.com/scripts/shell/imports.zsh' >> ~/.zshrc
# source ~/.zshrc

# ============================================================

SHELL_DIR="$(dirname "${(%):-%x}")"

source "$SHELL_DIR/github.zsh"
