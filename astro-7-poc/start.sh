#!/bin/bash
cd "$(dirname "$0")"
port=4600
if lsof -nP -iTCP:$port -sTCP:LISTEN >/dev/null 2>&1; then
  echo "already running at http://127.0.0.1:$port"
  exit 0
fi
./node_modules/.bin/astro dev --host 127.0.0.1 --port $port >/dev/null 2>&1 &
tries=0
until curl -sf "http://127.0.0.1:$port" >/dev/null; do
  tries=$((tries + 1))
  if [ "$tries" -ge 30 ]; then
    echo "failed to start"
    exit 1
  fi
  sleep 1
done
echo "running at http://127.0.0.1:$port"
