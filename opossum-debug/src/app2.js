const express = require('express')
const app = express()
const port = 8080

const CircuitBreaker = require('opossum');

function dummyProc(){
    console.log("I will return 200...");
    return "200";
};

const options = {
    timeout: 3000,                // If our function takes longer than 3 seconds, trigger a failure
    errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
    resetTimeout: 30000           // After 30 seconds, try again.
};
const breaker = new CircuitBreaker(dummyProc,options);

app.get('/', (req, res) => {
    breaker.fire(dummyProc())
        .then( r => console.log("Result:", r))
        .catch( e => console.error("Error:", e));
    res.send('Hello World stinky animal 2!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});