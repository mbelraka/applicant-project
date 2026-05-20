#!/usr/bin/env sh
# Exit 0 when any staged file is under backend/.
set -eu

git diff --cached --name-only --diff-filter=ACMR | grep -q '^backend/'
