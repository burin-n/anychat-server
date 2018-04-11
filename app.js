var express= require('./config/express');
var mongoose = require('./config/mongoose');
var socket = require('./config/socket');

var app = express();
var db = mongoose();
var http = socket(app);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});