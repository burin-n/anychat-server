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

let reserveserver;
http.listen(Number(port), function(){
    console.log('started on port ' + port);
});
if (port == 3001){
    reserveserver = 3002;
}else{
    reserveserver = 3001;
}

//console.log('connect to',anotherserver);

let socketserver = require('socket.io-client')('http://localhost:'+reserveserver);
socketserver.on('connect', ()=>{
    console.log('created' , port);
});


// http.listen(3001, function(){
//   console.log('listening on *:3001');
// });
