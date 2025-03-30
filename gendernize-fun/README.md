### Result

```bash
npm run run
```

```bash
curl -i http://localhost:3000/genderize?name=john
```

```bash
❯ curl -i http://localhost:3000/genderize\?name\=john
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 63
ETag: W/"3f-LZbvNtVYsJuObdL1ZKkxKLp6jeo"
Date: Sun, 30 Mar 2025 04:35:27 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"count":2692560,"name":"john","gender":"male","probability":1}%                                                                 
```