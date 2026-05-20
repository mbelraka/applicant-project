#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")/.." || exit 1
echo "pre-commit: frontend — validate:ci:frontend"
npm run precommit:frontend
