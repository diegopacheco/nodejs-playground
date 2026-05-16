#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

echo "[test] registry system info"
curl -fsS http://localhost:8080/apis/registry/v3/system/info | head -c 400; echo

echo "[test] registered artifacts in group movie-rental"
curl -fsS "http://localhost:8080/apis/registry/v3/groups/movie-rental/artifacts" | head -c 400; echo

echo "[test] backend health"
curl -fsS http://localhost:3001/health; echo

echo "[test] openapi document title"
curl -fsS http://localhost:3001/openapi.json | node -e "let s='';process.stdin.on('data',c=>s+=c).on('end',()=>{const d=JSON.parse(s);console.log(d.info.title,d.info.version,'paths:',Object.keys(d.paths).join(','))})"

echo "[test] list movies"
curl -fsS http://localhost:3001/movies | head -c 400; echo

echo "[test] rent movie m1 to Alice for 2 days"
RENTAL=$(curl -fsS -X POST http://localhost:3001/rentals -H "Content-Type: application/json" -d '{"movieId":"m1","customer":"Alice","days":2}')
echo "$RENTAL"
RID=$(echo "$RENTAL" | node -e "let s='';process.stdin.on('data',c=>s+=c).on('end',()=>console.log(JSON.parse(s).id))")

echo "[test] list rentals"
curl -fsS http://localhost:3001/rentals | head -c 400; echo

echo "[test] return rental $RID"
curl -fsS -X DELETE "http://localhost:3001/rentals/$RID" | head -c 400; echo

echo "[test] zod validation rejects bad input"
curl -s -o /dev/null -w "status=%{http_code}\n" -X POST http://localhost:3001/rentals -H "Content-Type: application/json" -d '{"movieId":"m1","days":0}'

echo "[test] done"
