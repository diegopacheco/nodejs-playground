#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

log "setup"

require node
require npm

node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 20 ? 0 : 1)' \
  || fail "node 20 or newer is required, found $(node -v)"

TARGET="$(env_file)"
if [ ! -f "$TARGET" ]; then
  cp "$ROOT/env.template" "$TARGET"
  chmod 600 "$TARGET"
  log "created $TARGET from env.template"
fi

npm install --prefix "$ROOT"

log "setup done"

if grep -q 'replace_me' "$TARGET"; then
  log ""
  log "next steps"
  log "1. open https://dashboard.workos.com and copy your API key and client id"
  log "2. add http://localhost:3000/api/auth/callback as a redirect uri"
  log "3. set WORKOS_API_KEY and WORKOS_CLIENT_ID in $TARGET"
  log "4. run ./scripts/start-all.sh"
fi
