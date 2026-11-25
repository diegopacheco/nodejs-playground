#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

port="$(service_port killer-queen-game)"
[ -n "$port" ] || fail "killer-queen-game is not declared in scripts/ports.env"
port_up "$port" || fail "killer-queen-game is not running on $port, run ./scripts/start-all.sh first"

url="$(service_url killer-queen-game)"
log "opening $url"
open_url "$url"
