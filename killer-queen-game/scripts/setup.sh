#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

log "setup started"

require node
require npx
npx --yes serve --version >/dev/null || fail "could not fetch the serve static server"

if [ ! -f "$ROOT/.gitignore" ] || ! grep -q '^\.run/$' "$ROOT/.gitignore"; then
  printf ".run/\n" >>"$ROOT/.gitignore"
fi

log "setup done"
