#!/usr/bin/env sh
set -e
ROOT="$(CDPATH= cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
. "$ROOT/scripts/clean-npm-env.sh"

npm run start -w @recruita/frontend &
sh scripts/start-backend.sh &
wait
