#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

port="$(service_port pong)"
[ -n "$port" ] || fail "pong is not declared in scripts/ports.env"
port_up "$port" || fail "pong is not running on $port, run ./scripts/start-all.sh first"

url="$(service_url pong)"
log "opening $url"
open_url "$url"
