var express = require('express');
var path = require('path');
var lodash = require('lodash');

var app = express();
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, '..'));

app.get('/', function(req, res) {
  res.send("Hello world!");
});

console.log("http://127.0.0.1:3000/");
app.listen(3000);