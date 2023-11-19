const express = require('express')
const app = express()

const logger = function (req, res, next) {
    var oldEnd = res.end;

    req.requestTime = Date.now()
    console.log('***');
    console.log(' Request        : ' + req.path);

    let send = res.send;
    res.send = c => {
        res.requestTime = Date.now();
        console.log(" Response.status: " + res.statusCode);
        console.log(" Response.body  : " + c);
        console.log(" Execution in   : " + (res.requestTime-req.requestTime) + " ms");
        res.send = send;
        return res.send(c);
    }

    next();    

};
app.use(logger);

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.get('/health', (req, res) => {
    res.send('200')
});

app.listen(3000)