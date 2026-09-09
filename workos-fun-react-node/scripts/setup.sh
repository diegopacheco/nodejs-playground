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
  workos_steps
  log ""
  log "then run ./scripts/configure-workos.sh, it asks for both values one at a time,"
  log "checks them against WorkOS, and writes them into $TARGET"
fi
