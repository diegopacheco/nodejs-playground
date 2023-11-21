/**
 * POC2 - Moving breaker outside of the method.
 */
const express = require('express')
const app = express()
const port = 8080

const CircuitBreaker = require('opossum');

function dummyProc(){
    console.log("I will return 200...");
    sleep(2000);
    return "200";
};

function asyncFunctionThatCouldFail(x, y) {
    return new Promise((resolve, reject) => {
      console.log("*** here!");
      console.log("Resolve: ", resolve);
      resolve();
    });
};

const options = {
    timeout: 3000,                // If our function takes longer than 3 seconds, trigger a failure
    errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
    resetTimeout: 30000           // After 30 seconds, try again.
};
const breaker = new CircuitBreaker(asyncFunctionThatCouldFail,options);

app.get('/', (req, res) => {
    breaker.fire(dummyProc())
        .then( r => console.log("Result:", r))
        .catch( e => console.error("Error:", e));
    res.send('Hello World stinky animal 2!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});