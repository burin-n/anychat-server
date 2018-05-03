var express = require('express');
var app = express();
var heartbeat = require('http').Server(app);
var http = require('http');
var io = require('socket.io')(heartbeat);
var port = process.argv.slice(2);   
if(port==''){
	port = 3000;    
}
var server1Port = 3001; //set default port for main server
var server2Port = 3002; //set default port for second server
var pingInterval = 3000;    //ms
var available;
var destinationPort;
var server2down;
var cors = require('cors');
app.use(cors());

app.use(express.static('public'));

function testMainServerConnection(){
    var options = {
        host: 'localhost',
        port: server1Port,
    };
    var options2 = {
        host: 'localhost',
        port: server2Port,
    };
    //ping using http get
    let request = http.get(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        available = true;
    });
    request.on('error', function(e) {
        //console.log(e.name);
        available = false; 
    });
     let request2 = http.get(options2, function(res) {
        console.log('STATUS: ' + res.statusCode);
        server2down = false;
    });
     request2.on('error', function(e) {
        //console.log(e.name);
        server2down = true; 
    });
    //wait for one second after ping and then check if the server is available
    setTimeout(() => {
        
        if(available){
            console.log("success ping to port "+server1Port);   
            destinationPort = server1Port;  
        } 
        else if(server2down) {

            console.log("all server down ");
            destinationPort = null;

        }
        

        else{
            console.log("failed ping to port "+server2Port);
            destinationPort = server2Port;
        }
        console.log("heartbeat set port: "+destinationPort+" to client", new Date());
    }, 1000);
};

//check server every 300 msec
var id = setInterval(testMainServerConnection, pingInterval);


io.on('connection', function(socket){
    console.log(socket.id + ' joins the healthchecker');
});

heartbeat.listen(Number(port), function(){
    console.log('started healthchecker on port '+port);
});
app.get('/check', function(req, res){
    //what to send to client when they connect to healthchecker
    //here client will receive destination url they have to connect to
    testMainServerConnection();
    console.log('return : ',destinationPort);
    var d = new Date();
    var ds = d.toString();
    res.send({'destination' : 'http://localhost:'+destinationPort,
                'date': ds
    });
});


// exports.hbeat = (req,res) => {
//   res.send('working');

//    testMainServerConnection();
//     console.log('return : ',destinationPort);
//     var d = new Date();
// 	var ds = d.toString();
//     res.send({'destination' : 'http://localhost:'+destinationPort,
//     			'date': ds
// 	});

// }
