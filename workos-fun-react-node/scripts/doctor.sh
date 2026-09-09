#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

require node
require_credentials

FIND_CLIENT="no"
if [ "${1:-}" = "--find-client-id" ]; then FIND_CLIENT="yes"; fi

TARGET="$(env_file)"

for leaked in WORKOS_CLIENT_ID WORKOS_API_KEY; do
  if [ -n "${!leaked:-}" ]; then
    log "WARNING: $leaked is exported in your shell"
    log "  node keeps an already set variable and ignores the one in $TARGET,"
    log "  so the app would use the exported value. run: unset $leaked"
    log ""
  fi
done

CLIENT_ID="$(grep -E '^WORKOS_CLIENT_ID=' "$TARGET" | head -1 | cut -d= -f2- | tr -d '"'"'"' \r')"
API_KEY="$(grep -E '^WORKOS_API_KEY=' "$TARGET" | head -1 | cut -d= -f2- | tr -d '"'"'"' \r')"

[ -n "$CLIENT_ID" ] || fail "WORKOS_CLIENT_ID is empty in $TARGET"
[ -n "$API_KEY" ] || fail "WORKOS_API_KEY is empty in $TARGET"

CLIENT_ID="$CLIENT_ID" API_KEY="$API_KEY" FIND_CLIENT="$FIND_CLIENT" node --input-type=module -e '
const id = process.env.CLIENT_ID
const key = process.env.API_KEY
const pad = (s, n) => String(s).padEnd(n)

console.log("credentials")
console.log("  client id  " + id)
console.log("  api key    " + key.slice(0, 8) + "… " + key.length + " characters")
console.log("")

let domain = ""
console.log("checks")

const authorize = new URL("https://api.workos.com/user_management/authorize")
authorize.searchParams.set("client_id", id)
authorize.searchParams.set("redirect_uri", process.env.WORKOS_REDIRECT_URI ?? "http://localhost:3000/api/auth/callback")
authorize.searchParams.set("response_type", "code")
authorize.searchParams.set("provider", "authkit")
authorize.searchParams.set("state", "doctor")
const a = await fetch(authorize, { redirect: "manual" })
if (a.status >= 300 && a.status < 400) {
  domain = new URL(a.headers.get("location")).host
  console.log("  " + pad("client id alone", 22) + "ok, AuthKit domain " + domain)
} else {
  console.log("  " + pad("client id alone", 22) + "FAILED, HTTP " + a.status)
}

const u = await fetch("https://api.workos.com/user_management/users?limit=50", {
  headers: { authorization: "Bearer " + key }
})
const users = await u.json().catch(() => ({}))
if (u.ok) {
  console.log("  " + pad("api key alone", 22) + "ok, " + (users.data?.length ?? 0) + " users in its environment")
} else {
  console.log("  " + pad("api key alone", 22) + "FAILED, HTTP " + u.status)
}

const t = await fetch("https://api.workos.com/user_management/authenticate", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    grant_type: "authorization_code",
    client_id: id,
    client_secret: key,
    code: "doctor_probe_not_a_real_code"
  })
})
const tb = await t.json().catch(() => ({}))
const failure = tb.error ?? tb.code ?? ""
const paired = failure !== "invalid_client"
console.log("  " + pad("the two together", 22) + (paired ? "ok, they pair" : "FAILED, invalid_client"))
if (!paired && tb.error_description) console.log("  " + pad("", 22) + tb.error_description)
console.log("")

if (users.data?.length) {
  console.log("users the api key can see")
  for (const person of users.data) console.log("  " + person.email)
  console.log("")
}

if (!paired && process.env.FIND_CLIENT === "yes" && users.data?.length) {
  const target = users.data[0].email
  console.log("finding the application your api key belongs to")
  console.log("  asking WorkOS for a password reset link for " + target)
  console.log("  the link it returns carries that application client id")
  const pr = await fetch("https://api.workos.com/user_management/password_reset", {
    method: "POST",
    headers: { authorization: "Bearer " + key, "content-type": "application/json" },
    body: JSON.stringify({ email: target })
  })
  const prb = await pr.json().catch(() => ({}))
  if (prb.password_reset_url) {
    const found = new URL(prb.password_reset_url).searchParams.get("client_id")
    console.log("")
    console.log("  your api key belongs to   " + found)
    console.log("  your .env client id is    " + id)
    console.log("")
    if (found && found !== id) {
      console.log("  these are two different applications")
      console.log("  to keep " + id + ", open that application in the")
      console.log("  dashboard and copy ITS api key")
    }
  } else {
    console.log("  could not mint a reset link, HTTP " + pr.status)
  }
  console.log("")
}
else if (!paired && process.env.FIND_CLIENT !== "yes") {
  console.log("to find which application your api key belongs to, run")
  console.log("  ./scripts/doctor.sh --find-client-id")
  console.log("")
}

if (!paired) {
  console.log("verdict")
  console.log("  each credential is valid on its own, but WorkOS refuses the pair")
  console.log("")
  console.log("  the client id is served by")
  console.log("    " + domain)
  console.log("")
  console.log("  if the api key were from a different environment it could not see the")
  console.log("  users listed above, so the two are almost certainly in the SAME")
  console.log("  environment and belong to DIFFERENT applications inside it")
  console.log("")
  console.log("  fix it in https://dashboard.workos.com/environment/applications")
  console.log("  that environment has more than one application, so:")
  console.log("    open the application that issued the api key you are using")
  console.log("    copy ITS Client ID into WORKOS_CLIENT_ID")
  console.log("")
  console.log("  or the other way round, open the application whose Client ID is above")
  console.log("  and use the api key that belongs to that application")
  console.log("")
  console.log("  then run ./scripts/configure-workos.sh and restart:")
  console.log("    ./scripts/stop-all.sh && ./scripts/start-all.sh")
  process.exitCode = 1
} else {
  console.log("verdict")
  console.log("  credentials look correct, sign in should work")
  console.log("  if it still fails, restart so the api reloads them:")
  console.log("    ./scripts/stop-all.sh && ./scripts/start-all.sh")
}
'
