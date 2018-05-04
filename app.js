var mongoose = require('./config/mongoose');
var express= require('./config/express');
var socket = require('./config/socket');
var port = process.argv.slice(2);
var db = mongoose();
var app = express();
var http = socket(app);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

if (port == '') 
    port = 3001;

http.listen(Number(port), function(){
    console.log('started on port ' + port);
});
