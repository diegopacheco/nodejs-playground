#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

port="$(service_port space-invader-game)"
[ -n "$port" ] || fail "space-invader-game is not declared in scripts/ports.env"
port_up "$port" || fail "space-invader-game is not running on $port, run ./scripts/start-all.sh first"

url="$(service_url space-invader-game)"
log "opening $url"
open_url "$url"
