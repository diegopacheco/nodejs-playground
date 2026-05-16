#!/usr/bin/env bash
cd "$(dirname "$0")"
pkill -f "node src/server.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
if podman info >/dev/null 2>&1; then
  podman-compose down || true
else
  echo "[stop] podman machine not running — skipping compose down"
fi
echo "[stop] done"
