var mongoose = require('./config/mongoose');
var express= require('./config/express');
var socket = require('./config/socket');

var db = mongoose();
var app = express();
var http = socket(app);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
