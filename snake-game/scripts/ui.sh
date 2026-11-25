#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

port="$(service_port snake-game)"
[ -n "$port" ] || fail "snake-game is not declared in scripts/ports.env"
port_up "$port" || fail "snake-game is not running on $port, run ./scripts/start-all.sh first"

url="$(service_url snake-game)"
log "opening $url"
open_url "$url"
