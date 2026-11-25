#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

port="$(service_port bomberman)"
[ -n "$port" ] || fail "bomberman is not declared in scripts/ports.env"
port_up "$port" || fail "bomberman is not running on $port, run ./scripts/start-all.sh first"

url="$(service_url bomberman)"
log "opening $url"
open_url "$url"
