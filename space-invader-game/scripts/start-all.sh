#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

log "starting"

require npx

port="$(service_port space-invader-game)"
if port_up "$port"; then
  log "space-invader-game already listening on $port"
else
  start_bg space-invader-game "$ROOT" npx --yes serve -l "$port" --no-clipboard .
  wait_port_up "$port" 60 || fail "space-invader-game did not open port $port, see $LOGS/space-invader-game.log"
fi

"$SCRIPTS/status.sh"

log "links"
for name in $(service_names); do
  printf "%-20s %s\n" "$name" "$(service_url "$name")"
done
