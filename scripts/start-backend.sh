#!/usr/bin/env sh
# Start Spring Boot API (dev profile).
set -eu

ROOT="$(CDPATH= cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

set -a
if [ -f backend/.env ]; then
  # shellcheck disable=SC1091
  . backend/.env
fi
set +a

export PORT=3001
exec sh scripts/run-mvn.sh -q -Dspring-boot.run.profiles=dev spring-boot:run
