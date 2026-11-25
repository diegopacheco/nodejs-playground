#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

log "tests started"

require node
log "no test suites exist, checking syntax of every source file"
for f in "$ROOT"/src/*.js; do
  node --check "$f" || fail "syntax error in $f"
done

log "tests passed"
