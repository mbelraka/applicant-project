#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")/.." || exit 1
echo "pre-commit: backend — validate:ci:backend"
sh scripts/run-npm.sh run precommit:backend
