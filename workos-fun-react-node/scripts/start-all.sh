#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

log "starting"

require node
require npm
require_credentials

[ -d "$ROOT/node_modules" ] || fail "dependencies are missing, run ./scripts/setup.sh first"

start_bg api "$ROOT" npm run dev:api
wait_port_up "$(service_port api)" 30 || fail "api did not open port $(service_port api), see $LOGS/api.log"
log "api up on $(service_port api)"

start_bg ui "$ROOT" npm run dev:ui
wait_port_up "$(service_port ui)" 60 || fail "ui did not open port $(service_port ui), see $LOGS/ui.log"
log "ui up on $(service_port ui)"

"$SCRIPTS/status.sh"
