#!/usr/bin/env bash
cd "$(dirname "$0")"

if [ -f server.pid ]; then
  PID="$(cat server.pid)"
  kill "$PID" >/dev/null 2>&1 || true
  rm -f server.pid
  echo "nub-fun stopped (pid $PID)"
else
  echo "nub-fun is not running"
fi
