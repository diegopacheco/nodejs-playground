#!/usr/bin/env bash
set -euo pipefail
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

require curl

OFFLINE="no"
case "${1:-}" in
  --offline) OFFLINE="yes" ;;
  --steps) workos_steps; exit 0 ;;
  "") ;;
  *) fail "unknown option ${1}, use --offline or --steps" ;;
esac

TARGET="$(env_file)"
REDIRECT_URI="http://localhost:3000/api/auth/callback"
APP_URL="http://localhost:3000"
API_PORT="$(service_port api)"

describe_secret() {
  local value prefix
  value="$1"
  prefix="$(printf '%s' "$value" | cut -c1-8)"
  printf "%s… %s characters\n" "$prefix" "${#value}"
}

check_client_id() {
  local id url code
  id="$1"
  url="https://api.workos.com/user_management/authorize?client_id=${id}&redirect_uri=${REDIRECT_URI}&response_type=code&provider=authkit&state=probe"
  code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$url" || echo 000)"
  case "$code" in
    3*) log "  client id accepted by WorkOS, redirect uri is registered"; return 0 ;;
    400|401|404|422)
      log "  WorkOS refused this client id with HTTP $code"
      log "  check the client id, and that $REDIRECT_URI is a registered redirect uri"
      return 1 ;;
    000) log "  could not reach WorkOS, keeping the value without a live check"; return 0 ;;
    *) log "  WorkOS answered HTTP $code, keeping the value without a live check"; return 0 ;;
  esac
}

check_api_key() {
  local key code
  key="$1"
  code="$(printf 'header = "Authorization: Bearer %s"\n' "$key" \
    | curl -s -K - -o /dev/null -w '%{http_code}' --max-time 15 \
      'https://api.workos.com/user_management/users?limit=1' || echo 000)"
  case "$code" in
    200) log "  api key accepted by WorkOS"; return 0 ;;
    401|403)
      log "  WorkOS rejected this api key with HTTP $code"
      return 1 ;;
    000) log "  could not reach WorkOS, keeping the value without a live check"; return 0 ;;
    *) log "  WorkOS answered HTTP $code, keeping the value without a live check"; return 0 ;;
  esac
}

ask_client_id() {
  local value tries
  tries=3
  while [ "$tries" -gt 0 ]; do
    tries=$((tries - 1))
    printf "WORKOS_CLIENT_ID (starts with client_): " >&2
    read -r value || fail "no input received"
    value="$(printf '%s' "$value" | tr -d '[:space:]')"
    if ! printf '%s' "$value" | grep -qE '^client_[A-Za-z0-9]{16,}$'; then
      log "  that does not look like a client id, expected client_ followed by at least 16 characters" >&2
      continue
    fi
    log "  got $value" >&2
    if [ "$OFFLINE" = "yes" ] || check_client_id "$value" >&2; then
      printf '%s' "$value"
      return 0
    fi
  done
  fail "could not get a valid WORKOS_CLIENT_ID"
}

ask_api_key() {
  local value tries
  tries=3
  while [ "$tries" -gt 0 ]; do
    tries=$((tries - 1))
    printf "WORKOS_API_KEY (starts with sk_, input is hidden): " >&2
    read -rs value || fail "no input received"
    printf "\n" >&2
    value="$(printf '%s' "$value" | tr -d '[:space:]')"
    if ! printf '%s' "$value" | grep -qE '^sk_(test|live)_[A-Za-z0-9]{16,}$'; then
      log "  that does not look like an api key, expected sk_test_ or sk_live_ followed by at least 16 characters" >&2
      continue
    fi
    log "  got $(describe_secret "$value")" >&2
    if [ "$OFFLINE" = "yes" ] || check_api_key "$value" >&2; then
      printf '%s' "$value"
      return 0
    fi
  done
  fail "could not get a valid WORKOS_API_KEY"
}

[ -t 0 ] || fail "this script needs a terminal, run it directly"

log "configuring WorkOS credentials for $TARGET"
log ""

if [ -f "$TARGET" ] && ! grep -q 'replace_me' "$TARGET"; then
  printf "%s already holds credentials, overwrite them? [y/N] " "$TARGET"
  read -r answer
  case "$answer" in
    y|Y|yes|YES) ;;
    *) log "left unchanged"; exit 0 ;;
  esac
  log ""
fi

workos_steps
log ""
log "paste the two values below, nothing is echoed for the api key"
log ""

CLIENT_ID="$(ask_client_id)"
log ""
API_KEY="$(ask_api_key)"
log ""

umask 077
{
  printf 'WORKOS_CLIENT_ID=%s\n' "$CLIENT_ID"
  printf 'WORKOS_API_KEY=%s\n' "$API_KEY"
  printf 'WORKOS_REDIRECT_URI=%s\n' "$REDIRECT_URI"
  printf 'APP_URL=%s\n' "$APP_URL"
  printf 'API_PORT=%s\n' "$API_PORT"
} >"$TARGET"
chmod 600 "$TARGET"

unset API_KEY

log "wrote $TARGET with permissions $(stat -f '%Lp' "$TARGET" 2>/dev/null || stat -c '%a' "$TARGET")"

if git -C "$ROOT" check-ignore -q "$TARGET"; then
  log "git ignores it, the key will not be committed"
else
  fail "$TARGET is NOT ignored by git, add .env to .gitignore before committing"
fi

log ""
log "next: ./scripts/start-all.sh"
