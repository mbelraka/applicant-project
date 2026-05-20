#!/usr/bin/env sh
# Exit 0 when any staged file is under frontend/.
set -eu

git diff --cached --name-only --diff-filter=ACMR | grep -q '^frontend/'
