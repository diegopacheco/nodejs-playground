#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

if ! podman info >/dev/null 2>&1; then
  echo "[run] starting podman machine..."
  podman machine start
  until podman info >/dev/null 2>&1; do sleep 1; done
fi

podman-compose up -d

echo ""
echo "================================================================"
echo "  Apicurio Registry UI:  http://localhost:8888"
echo "  Apicurio Registry API: http://localhost:8080/apis/registry/v3"
echo "  Backend API:           http://localhost:3001"
echo "    /health"
echo "    /movies"
echo "    /rentals"
echo "    /openapi.json"
echo "    /openapi/problems"
echo "  Frontend:              http://localhost:5173"
echo "================================================================"
echo ""

echo "[run] waiting for Apicurio Registry (first boot can take 30-60s)..."
until curl -fsS http://localhost:8080/apis/registry/v3/system/info >/dev/null 2>&1; do
  sleep 1
done
echo "[run] registry is up"

if [ ! -d backend/node_modules ]; then
  (cd backend && npm install)
fi
if [ ! -d frontend/node_modules ]; then
  (cd frontend && npm install)
fi

(cd backend && npm start) &
BACK_PID=$!
echo "[run] backend pid=$BACK_PID"

until curl -fsS http://localhost:3001/health >/dev/null 2>&1; do
  sleep 1
done
echo "[run] backend is up"

(cd frontend && npm run dev) &
FRONT_PID=$!
echo "[run] frontend pid=$FRONT_PID"

echo ""
echo "Apicurio Registry UI: http://localhost:8888"
echo "Backend API:          http://localhost:3001"
echo "Frontend:             http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop."

trap "kill $BACK_PID $FRONT_PID 2>/dev/null; podman-compose down" INT TERM
wait
