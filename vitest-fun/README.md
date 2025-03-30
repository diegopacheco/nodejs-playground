## Install

```bash
npm install -D vitest
```

### Results

```bash
❯ ./tests.sh

> vitest-fun@1.0.0 test
> vitest


 DEV  v3.0.9 /mnt/e35d88d4-42b9-49ea-bf29-c4c3b018d429/diego/git/diegopacheco/nodejs-playground/vitest-fun

 ✓ sum.test.js (1 test) 2ms
   ✓ adds 1 + 2 to equal 3

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  21:12:00
   Duration  320ms (transform 22ms, setup 0ms, collect 19ms, tests 2ms, environment 0ms, prepare 96ms)

 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

### Coverage Report

```
❯ npm run coverage

> vitest-fun@1.0.0 coverage
> vitest run --coverage


 RUN  v3.0.9 /mnt/e35d88d4-42b9-49ea-bf29-c4c3b018d429/diego/git/diegopacheco/nodejs-playground/vitest-fun
      Coverage enabled with v8

 ✓ sum.test.js (1 test) 3ms
   ✓ adds 1 + 2 to equal 3

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  21:14:19
   Duration  448ms (transform 36ms, setup 0ms, collect 17ms, tests 3ms, environment 0ms, prepare 132ms)

 % Coverage report from v8
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
All files |     100 |      100 |     100 |     100 |
 sum.js   |     100 |      100 |     100 |     100 |
----------|---------|----------|---------|---------|-------------------
```