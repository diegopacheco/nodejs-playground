#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

log "setup started"

require node
require npm
( cd "$ROOT/frontend" && npm install ) || fail "frontend npm install failed"

if [ ! -f "$ROOT/.gitignore" ] || ! grep -q '^\.run/$' "$ROOT/.gitignore"; then
  printf ".run/\n" >>"$ROOT/.gitignore"
fi

log "setup done"
