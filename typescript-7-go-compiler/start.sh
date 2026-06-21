#!/bin/bash
set -e
cd "$(dirname "$0")"

PORT=5180

if [ ! -d node_modules ]; then
  npm install
fi

npm run dev > vite.log 2>&1 &
echo $! > .vite.pid

for i in $(seq 1 60); do
  if curl -s "http://localhost:$PORT" | grep -q "TS7 Tamagotchi"; then
    echo "TS7 Tamagotchi running at http://localhost:$PORT"
    exit 0
  fi
  sleep 1
done

echo "Server failed to start, see vite.log"
cat vite.log
exit 1
