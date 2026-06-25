#!/usr/bin/env bash
set -uo pipefail
cd "$(dirname "$0")"
PID_FILE=".desktop.pid"

if [ -f "$PID_FILE" ]; then
  kill "$(cat "$PID_FILE")" 2>/dev/null || true
  rm -f "$PID_FILE"
fi

pkill -f "deno desktop main.ts" 2>/dev/null || true
pkill -f "laufey_webview" 2>/dev/null || true
echo "Calculator stopped"
