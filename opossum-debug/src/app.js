const express = require('express')
const app = express()
const port = 8080

const CircuitBreaker = require('opossum');

function asyncFunctionThatCouldFail(x, y) {
    return new Promise((resolve, reject) => {
      console.log("*** here!");
      console.log(resolve);
      console.log(reject);
    });
};

function dummyProc(){
    if (1+1==2){
        console.log("ok");
    }
};

app.get('/status', (req, res) => {
    const options = {
        timeout: 3000,
        errorThresholdPercentage: 50,
        resetTimeout: 30000
    };
    console.log("Status",CircuitBreaker.newStatus(options));
    res.send(CircuitBreaker.newStatus(options));
});

app.get('/', (req, res) => {
  
    const options = {
        timeout: 3000,                // If our function takes longer than 3 seconds, trigger a failure
        errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
        resetTimeout: 30000           // After 30 seconds, try again.
    };
    const breaker = new CircuitBreaker(asyncFunctionThatCouldFail, options);
    
    breaker.fire(dummyProc())
        .then(console.log)
        .catch(console.error);

    res.send('Hello World stinky animal!');
});

app.get('/civilized', (req, res) => {
  
    const options = {
        timeout: 3000,                // If our function takes longer than 3 seconds, trigger a failure
        errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
        resetTimeout: 30000           // After 30 seconds, try again.
    };
    const breaker = new CircuitBreaker(asyncFunctionThatCouldFail, options);
    
    breaker.fire(dummyProc())
        .then(console.log)
        .catch(console.error);
    
    breaker.shutdown();

    res.send('Hello World stinky animal!');
});

app.get('/heap', (req, res) => {
    const v8 = require('v8');
    res.send(v8.getHeapStatistics());
});

app.get('/heap-dump', (req, res) => {
    var heapdump = require('heapdump');
    var filename = '/' + Date.now() + '.heapsnapshot';
    heapdump.writeSnapshot(filename);
    heapdump.writeSnapshot(function (err, filename) {
        console.log('dump written to', filename);
    });
    res.send(filename + " written!");
});

var log = require('why-is-node-running')
setTimeout(function () {
  log() // logs out active handles that are keeping node running
}, 100);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});