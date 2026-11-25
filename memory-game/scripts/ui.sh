#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

port="$(service_port memory-game)"
[ -n "$port" ] || fail "memory-game is not declared in scripts/ports.env"
port_up "$port" || fail "memory-game is not running on $port, run ./scripts/start-all.sh first"

url="$(service_url memory-game)"
log "opening $url"
open_url "$url"
