#!/bin/bash
cd "$(dirname "$0")"

if [ -f .vite.pid ]; then
  kill "$(cat .vite.pid)" 2>/dev/null
  rm -f .vite.pid
fi

pkill -f "vite.*5180" 2>/dev/null

echo "TS7 Tamagotchi stopped"
