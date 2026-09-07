#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

log "tests started"

require npm

npm test || fail "unit tests failed"
npm run build || fail "vidact build failed"

log "tests passed"
