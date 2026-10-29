#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

log "tests started"

require node
( cd "$ROOT/backend" && npm test ) || fail "backend tests failed"
( cd "$ROOT/frontend" && npm test ) || fail "frontend tests failed"

log "tests passed"
