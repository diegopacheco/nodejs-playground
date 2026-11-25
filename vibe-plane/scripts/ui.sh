#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

port="$(service_port vibe-plane)"
[ -n "$port" ] || fail "vibe-plane is not declared in scripts/ports.env"
port_up "$port" || fail "vibe-plane is not running on $port, run ./scripts/start-all.sh first"

url="$(service_url vibe-plane)"
log "opening $url"
open_url "$url"
