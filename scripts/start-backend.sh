#!/usr/bin/env sh
# Start Spring Boot API (dev profile). Unsets IDE-injected npm "devdir" env noise.
set -eu

unset NPM_CONFIG_DEVDIR npm_config_devdir 2>/dev/null || true

ROOT="$(CDPATH= cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

set -a
if [ -f backend/.env ]; then
  # shellcheck disable=SC1091
  . backend/.env
fi
set +a

export PORT=3001
exec backend/mvnw -q -f backend -Dspring-boot.run.profiles=dev spring-boot:run
