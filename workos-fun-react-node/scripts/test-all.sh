#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

require npm

[ -d "$ROOT/node_modules" ] || fail "dependencies are missing, run ./scripts/setup.sh first"

log "backend tests"
npm run test --prefix "$ROOT" --workspace backend || fail "backend tests failed"

log "frontend build"
npm run build --prefix "$ROOT" --workspace frontend || fail "frontend build failed"

log "all tests passed"
