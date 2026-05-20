#!/usr/bin/env sh
# Run npm with IDE-injected devdir env vars removed (avoids npm 11+ DEP/warnings).
# Prefer Corepack so npm matches package.json "packageManager" (npm@10.9.2).
set -eu
unset NPM_CONFIG_DEVDIR npm_config_devdir 2>/dev/null || true
if command -v corepack >/dev/null 2>&1; then
  corepack enable >/dev/null 2>&1 || true
fi
exec npm "$@"
