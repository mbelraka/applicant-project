#!/usr/bin/env sh
set -e
ROOT="$(CDPATH= cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
unset NPM_CONFIG_DEVDIR npm_config_devdir 2>/dev/null || true

sh scripts/run-npm.sh run start -w @recruita/frontend &
sh scripts/start-backend.sh &
wait
