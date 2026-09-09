#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

require curl
require node
require_credentials

EMAIL="${1:-admin@gymlog.local}"
PASSWORD="${2:-$(node -e 'process.stdout.write(require("node:crypto").randomBytes(12).toString("base64url"))')}"
TARGET="$(env_file)"

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
chmod 700 "$WORK"

API_KEY="$(grep -E '^WORKOS_API_KEY=' "$TARGET" | head -1 | cut -d= -f2-)"
[ -n "$API_KEY" ] || fail "WORKOS_API_KEY not found in $TARGET, run ./scripts/configure-workos.sh first"

log "creating $EMAIL in your WorkOS environment"

EMAIL="$EMAIL" PASSWORD="$PASSWORD" node -e '
const body = {
  email: process.env.EMAIL,
  password: process.env.PASSWORD,
  first_name: "Gym",
  last_name: "Admin",
  email_verified: true
}
process.stdout.write(JSON.stringify(body))
' >"$WORK/body.json"

CODE="$(printf 'header = "Authorization: Bearer %s"\n' "$API_KEY" \
  | curl -s -K - \
      -X POST \
      -H 'content-type: application/json' \
      --data @"$WORK/body.json" \
      -o "$WORK/out.json" \
      -w '%{http_code}' \
      --max-time 20 \
      'https://api.workos.com/user_management/users' || echo 000)"

unset API_KEY

REPORT="$(CODE="$CODE" node -e '
const fs = require("fs")
let payload = {}
try { payload = JSON.parse(fs.readFileSync(process.argv[1], "utf8")) } catch {}
const code = process.env.CODE
const detail = () => {
  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    return payload.errors.map((e) => e.message ?? e.code ?? JSON.stringify(e)).join("; ")
  }
  return payload.message ?? payload.error_description ?? payload.error ?? "no detail returned"
}
if (code === "201" || code === "200") {
  console.log("OK|" + (payload.id ?? "unknown id"))
} else if ((code === "422" || code === "400") && /already|exists|unique|not available/i.test(detail())) {
  console.log("EXISTS|" + detail())
} else if (code === "000") {
  console.log("NET|could not reach WorkOS")
} else {
  console.log("ERR|HTTP " + code + ": " + detail())
}
' "$WORK/out.json")"

STATUS="${REPORT%%|*}"
DETAIL="${REPORT#*|}"

case "$STATUS" in
  OK)
    log ""
    log "user created"
    log "  email    $EMAIL"
    log "  password $PASSWORD"
    log ""
    log "this password is shown once and is stored nowhere, save it now"
    log "sign in with it at http://localhost:3000"
    ;;
  EXISTS)
    log ""
    log "$EMAIL already exists in this environment, nothing changed"
    log "sign in with it at http://localhost:3000"
    ;;
  NET)
    fail "could not reach WorkOS, check your connection and try again"
    ;;
  *)
    log ""
    log "WorkOS refused to create this user"
    log "  $DETAIL"
    log ""
    log "if the password was rejected, pass a stronger one:"
    log "  ./scripts/create-user.sh $EMAIL 'a-longer-password'"
    fail "user was not created"
    ;;
esac
