#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

log "starting"

require npx

port="$(service_port killer-queen-game)"
if port_up "$port"; then
  log "killer-queen-game already listening on $port"
else
  start_bg killer-queen-game "$ROOT" npx --yes serve -l "$port" --no-clipboard .
  wait_port_up "$port" 60 || fail "killer-queen-game did not open port $port, see $LOGS/killer-queen-game.log"
fi

"$SCRIPTS/status.sh"

log "links"
for name in $(service_names); do
  printf "%-20s %s\n" "$name" "$(service_url "$name")"
done
