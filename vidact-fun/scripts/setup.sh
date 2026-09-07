#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

log "setup started"

require node
require npm

npm install

if [ ! -f "$ROOT/.gitignore" ]; then
  printf "node_modules/\ndist/\n.run/\n" >"$ROOT/.gitignore"
elif ! grep -q '^\.run/$' "$ROOT/.gitignore"; then
  printf ".run/\n" >>"$ROOT/.gitignore"
fi

npm run build

log "setup done"
