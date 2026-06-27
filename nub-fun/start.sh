#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

PORT="${PORT:-3000}"

if [ ! -d node_modules ]; then
  npm install
fi

if command -v nub >/dev/null 2>&1; then
  NUB="nub"
else
  NUB="./node_modules/.bin/nub"
fi

echo "Starting nub-fun with $($NUB --version) -> $NUB src/server.ts"
PORT="$PORT" "$NUB" src/server.ts >server.log 2>&1 &
echo $! >server.pid

for i in $(seq 1 30); do
  if curl -sf "http://localhost:${PORT}/api/info" >/dev/null 2>&1; then
    echo "nub-fun is up on http://localhost:${PORT}"
    exit 0
  fi
  sleep 1
done

echo "nub-fun failed to start, see server.log"
cat server.log
exit 1
