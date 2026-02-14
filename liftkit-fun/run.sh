#!/bin/bash
cd "$(dirname "$0")"
python3 -m http.server 3000 &
SERVER_PID=$!
sleep 1
open "http://localhost:3000/index.html"
wait $SERVER_PID
