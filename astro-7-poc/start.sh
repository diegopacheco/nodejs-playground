#!/bin/bash
cd "$(dirname "$0")"
if [ -f app.pid ] && kill -0 "$(cat app.pid)" 2>/dev/null; then
  echo "already running with pid $(cat app.pid)"
  exit 0
fi
npm run dev -- --host 127.0.0.1 --port 4321 >/dev/null 2>&1 &
echo $! > app.pid
tries=0
until curl -sf http://127.0.0.1:4321 >/dev/null; do
  tries=$((tries + 1))
  if [ "$tries" -ge 30 ]; then
    echo "failed to start"
    exit 1
  fi
  sleep 1
done
echo "running at http://127.0.0.1:4321 with pid $(cat app.pid)"
