#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

log "starting"

[ -d "$ROOT/node_modules" ] || fail "dependencies missing, run ./scripts/setup.sh first"

port="$(service_port pong)"
if port_up "$port"; then
  log "pong already listening on $port"
else
  start_bg pong "$ROOT" node src/server.js
  wait_port_up "$port" 60 || fail "pong did not open port $port, see $LOGS/pong.log"
fi

"$SCRIPTS/status.sh"

log "links"
for name in $(service_names); do
  printf "%-14s %s\n" "$name" "$(service_url "$name")"
done
log "open the link in two browser tabs, one per player"
