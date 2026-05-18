#!/usr/bin/env bash
set -e
PORT=5173
PID=$(lsof -ti tcp:$PORT || true)
if [ -n "$PID" ]; then
  kill $PID
  for i in 1 2 3 4 5; do
    if ! lsof -ti tcp:$PORT >/dev/null; then
      exit 0
    fi
    sleep 1
  done
  kill -9 $PID || true
fi
