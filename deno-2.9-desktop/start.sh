#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
PID_FILE=".desktop.pid"

if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "Calculator already running (pid $(cat "$PID_FILE"))"
  exit 0
fi

if ! command -v deno >/dev/null 2>&1; then
  echo "deno not found. Install with: curl -fsSL https://deno.land/install.sh | sh"
  exit 1
fi

VERSION=$(deno --version | head -1 | awk '{print $2}')
MAJOR=$(echo "$VERSION" | cut -d. -f1)
MINOR=$(echo "$VERSION" | cut -d. -f2)
if [ "$MAJOR" -lt 2 ] || { [ "$MAJOR" -eq 2 ] && [ "$MINOR" -lt 9 ]; }; then
  echo "deno $VERSION found, but 'deno desktop' needs >= 2.9. Run: deno upgrade"
  exit 1
fi

deno desktop main.ts &
echo $! > "$PID_FILE"
echo "Calculator started (pid $(cat "$PID_FILE")). Use ./stop.sh to close it."
