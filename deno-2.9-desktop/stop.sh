#!/usr/bin/env bash
set -uo pipefail
cd "$(dirname "$0")"
pkill -f "Calculator.app/Contents/MacOS/laufey_webview" 2>/dev/null || true
pkill -f "deno-2.app/Contents/MacOS/laufey_webview" 2>/dev/null || true
echo "Calculator stopped"
