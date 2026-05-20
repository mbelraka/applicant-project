#!/usr/bin/env sh
# Exit 0 when package.json or package-lock.json are staged.
set -eu

git diff --cached --name-only --diff-filter=ACMR \
  | grep -qE '^(package\.json|package-lock\.json)$'
