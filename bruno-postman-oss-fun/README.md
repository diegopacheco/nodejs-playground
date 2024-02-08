### Install bruno CLI
```bash
npm install -g @usebruno/cli
```
### Run 
```bash
./run.sh
```
### Result
```
❯ bru run CatQuote/request.bru
Running Request

CatQuote/request (200 OK) - 361 ms
   ✓ assert: res.status: 200
   ✓ status code is 200

Requests:    1 passed, 1 total
Tests:       1 passed, 1 total
Assertions:  1 passed, 1 total
Ran all requests - 361 ms

```