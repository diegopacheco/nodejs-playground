#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
if [ ! -f reports/index.html ]; then
  ./run.sh
fi
case "$(uname -s)" in
  Darwin) open reports/index.html ;;
  Linux) xdg-open reports/index.html ;;
  *) printf '%s\n' "$(pwd)/reports/index.html" ;;
esac
