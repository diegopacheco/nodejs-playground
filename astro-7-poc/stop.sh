#!/bin/bash
cd "$(dirname "$0")"
if [ ! -f app.pid ]; then
  echo "not running"
  exit 0
fi
pid=$(cat app.pid)
if kill -0 "$pid" 2>/dev/null; then
  kill "$pid"
  pkill -P "$pid" 2>/dev/null
  echo "stopped pid $pid"
else
  echo "not running"
fi
rm -f app.pid
