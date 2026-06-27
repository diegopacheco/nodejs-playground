#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

PORT="${PORT:-3000}"
BASE="http://localhost:${PORT}"

echo "GET ${BASE}/api/info"
curl -sf "${BASE}/api/info"
printf '\n\n'

echo "POST ${BASE}/api/notes"
curl -sf -X POST "${BASE}/api/notes" -H 'Content-Type: application/json' -d '{"text":"hello from nub"}'
printf '\n\n'

echo "GET ${BASE}/api/notes"
curl -sf "${BASE}/api/notes"
printf '\n\n'

echo "DELETE ${BASE}/api/notes"
curl -sf -X DELETE "${BASE}/api/notes" -o /dev/null -w 'status=%{http_code}\n'

echo "All checks passed"
