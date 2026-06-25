#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
APP="Calculator.app"

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

if pgrep -f "$APP/Contents/MacOS/laufey_webview" >/dev/null 2>&1; then
  echo "Calculator already running, bringing it to front."
  open "$APP"
  exit 0
fi

if [ ! -d "$APP" ] || [ main.ts -nt "$APP" ]; then
  echo "Building $APP ..."
  deno desktop --output "$APP" main.ts
fi

open "$APP"
echo "Calculator started. Use ./stop.sh to close it."
