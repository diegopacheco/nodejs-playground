#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

log "tests started"

require node
log "no test suites exist, checking syntax of every script in the game"
node "$SCRIPTS/check-syntax.js" "$ROOT" || fail "syntax check failed"

log "tests passed"
