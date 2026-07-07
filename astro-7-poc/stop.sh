#!/bin/bash
port=4600
pids=$(lsof -nP -tiTCP:$port -sTCP:LISTEN)
if [ -z "$pids" ]; then
  echo "not running"
  exit 0
fi
kill $pids
echo "stopped $pids"
