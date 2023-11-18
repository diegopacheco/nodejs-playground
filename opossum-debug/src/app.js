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

var log = require('why-is-node-running')
setTimeout(function () {
  log() // logs out active handles that are keeping node running
}, 100);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});