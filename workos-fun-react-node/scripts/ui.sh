#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

URL="http://localhost:$(service_port ui)"

if ! port_up "$(service_port ui)"; then
  log "ui is down, run ./scripts/start-all.sh first"
fi

log "opening $URL"
open_url "$URL"
