#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

require node
require_credentials

TARGET="$(env_file)"

CLIENT_ID="$(grep -E '^WORKOS_CLIENT_ID=' "$TARGET" | head -1 | cut -d= -f2- | tr -d '"'"'"' \r')"
API_KEY="$(grep -E '^WORKOS_API_KEY=' "$TARGET" | head -1 | cut -d= -f2- | tr -d '"'"'"' \r')"

[ -n "$CLIENT_ID" ] || fail "WORKOS_CLIENT_ID is empty in $TARGET"
[ -n "$API_KEY" ] || fail "WORKOS_API_KEY is empty in $TARGET"

CLIENT_ID="$CLIENT_ID" API_KEY="$API_KEY" node --input-type=module -e '
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

if (!paired) {
  console.log("verdict")
  console.log("  each credential is valid on its own but WorkOS refuses them together,")
  console.log("  so they come from different applications or different environments")
  console.log("")
  console.log("  the client id above is served by")
  console.log("    " + domain)
  console.log("")
  console.log("  open https://dashboard.workos.com, use the top left picker to select the")
  console.log("  environment whose AuthKit domain is the one above, then take BOTH from it:")
  console.log("    Applications, open your app      -> WORKOS_CLIENT_ID")
  console.log("    API Keys in the sidebar          -> WORKOS_API_KEY")
  console.log("")
  console.log("  if that environment lists more than one application, both values must")
  console.log("  come from the same application")
  console.log("")
  console.log("  every non production environment issues sk_test_ keys, so the sk_test_")
  console.log("  prefix does not prove the key came from the right one")
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
