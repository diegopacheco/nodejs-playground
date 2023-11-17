### How to run

There are two scenarios here, the uncivilized('/') and the civilized('/civilized').
```
uncivilized('/'): Never shutdown the circuitr breaker, so has some background things like (getStats) running.
civilized('/civilized'): Shutdowns the circuitr breaker
```
The circuit breakers are being created for every single call.


uncivilized('/')
1. run the server in "uncivilized mode" call the endpoint that never properly shutdown the circuit breaker.
2. run `npm run profile`
3. in a different terminal run `npm run stress` (doing 12x) so you have 12k requests
4. get the summary `npm run summary` check the file processed.txt

civilized('/civilized')
1. run the server in "civilized mode" call the endpoint that never properly shutdown the circuit breaker.
2. run `npm run profile`
3. in a different terminal run `npm run stress_civilized` (doing 12x) so you have 12k requests
4. get the summary `npm run summary` check the file processed.txt

### Results

Uncivilized
```
Testing v8 version different from logging version
Statistical profiling result from isolate-0x564f260-91409-v8.log, (23538 ticks, 9 unaccounted, 0 excluded).

 [Shared libraries]:
   ticks  total  nonlib   name
   8669   36.8%          /home/diego/.nvm/versions/node/v18.15.0/bin/node
    277    1.2%          /usr/lib/x86_64-linux-gnu/libc.so.6
     16    0.1%          [vdso]
      8    0.0%          /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.30

 [JavaScript]:
   ticks  total  nonlib   name
    775    3.3%    5.3%  LazyCompile: *get stats /mnt/e35d88d4-42b9-49ea-bf29-c4c3b018d429/diego/git/diegopacheco/nodejs-playground/opossum-debug/node_modules/opossum/lib/status.js:99:13
     88    0.4%    0.6%  LazyCompile: *listOnTimeout node:internal/timers:517:25
     62    0.3%    0.4%  LazyCompile: *<anonymous> /mnt/e35d88d4-42b9-49ea-bf29-c4c3b018d429/diego/git/diegopacheco/nodejs-playground/opossum-debug/node_modules/opossum/lib/status.js:176:30
     26    0.1%    0.2%  LazyCompile: *<anonymous> /mnt/e35d88d4-42b9-49ea-bf29-c4c3b018d429/diego/git/diegopacheco/nodejs-playground/opossum-debug/node_modules/opossum/lib/status.js:84:7
     25    0.1%    0.2%  LazyCompile: *Status /mnt/e35d88d4-42b9-49ea-bf29-c4c3b018d429/diego/git/diegopacheco/nodejs-playground/opossum-debug/node_modules/opossum/lib/status.js:51:15
     20    0.1%    0.1%  LazyCompile: *Socket._writeGeneric node:net:899:42
```

Civilized
```
Testing v8 version different from logging version
Statistical profiling result from isolate-0x729b260-93391-v8.log, (8780 ticks, 9 unaccounted, 0 excluded).

 [Shared libraries]:
   ticks  total  nonlib   name
   5040   57.4%          /home/diego/.nvm/versions/node/v18.15.0/bin/node
    183    2.1%          /usr/lib/x86_64-linux-gnu/libc.so.6
      8    0.1%          [vdso]
      3    0.0%          /usr/lib/x86_64-linux-gnu/libstdc++.so.6.0.30

 [JavaScript]:
   ticks  total  nonlib   name
     23    0.3%    0.6%  LazyCompile: *get stats /mnt/e35d88d4-42b9-49ea-bf29-c4c3b018d429/diego/git/diegopacheco/nodejs-playground/opossum-debug/node_modules/opossum/lib/status.js:99:13
     21    0.2%    0.6%  LazyCompile: *Status /mnt/e35d88d4-42b9-49ea-bf29-c4c3b018d429/diego/git/diegopacheco/nodejs-playground/opossum-debug/node_modules/opossum/lib/status.js:51:15
     16    0.2%    0.5%  LazyCompile: *Socket._writeGeneric node:net:899:42
     15    0.2%    0.4%  LazyCompile: *next /mnt/e35d88d4-42b9-49ea-bf29-c4c3b018d429/diego/git/diegopacheco/nodejs-playground/opossum-debug/node_modules/express/lib/router/index.js:177:16
```     

I added and stop the break point time to time, and is always running "getStats"
<img src="getStats-runs-everry-1-sec.png"></img>

CPU never went down. Even when I stop sending requests, because getStats keep running.
<img src="CPU_dont_go_down.png"></img>

V8 Profiler points to the same conclusion <BR>
<img src="v8-profiler-summary.png"></img>