var express = require('express');
var app = express();
var heartbeat = require('http').Server(app);
var http = require('http');
var io = require('socket.io')(heartbeat);
var port = process.argv.slice(2);
if(port==''){
	port = 5000;
}
var server1Port = 3001; //set default port for main server
var server2Port = 3002; //set default port for second server
var pingtime = 1000;    //ms
var serve1up;
var destinationPort;
var server2up;
var change = 0;
var cors = require('cors');
app.use(cors());

app.use(express.static('public'));

function testServer(socket){
    let info = {
        host: 'localhost',
        port: server1Port,
    };
    let info2 = {
        host: 'localhost',
        port: server2Port,
    };
    //ping using http get
    let request = http.get(info, function(res) {
        console.log('STATUS: ' + res.statusCode);
        serve1up = true;
        change = 1;
    });
    request.on('error', function(e) {
        serve1up = false;
        change = 1;
    });
     let request2 = http.get(info2, function(res) {
        console.log('STATUS: ' + res.statusCode);
        server2up = true;
    });
     request2.on('error', function(e) {
        server2up = false;
        change = 1;
    });
    //wait for one second after ping and then check if the server is serve1up
    setTimeout(() => {

        if(serve1up){
            console.log("success ping to port "+server1Port);
            destinationPort = server1Port;
            if (change){
                socket.emit('loadbalance',{
                    'destination' : 'http://localhost:'+destinationPort,
                    'timestamp' : new Date()
                });
                change = 0;
                };

        // check if 2 server down
        } else if(!server2up) {
            console.log("all server down ");
            destinationPort = null;
            if (change){
                socket.emit('loadbalance',{
                    'destination' : 'http://localhost:'+destinationPort,
                    'timestamp' : new Date()
                });
                change = 0;
            }
        } else{
            console.log("success ping to port "+server2Port);
            destinationPort = server2Port;
        }
        console.log("heartbeat set port: "+destinationPort+" to client", new Date());
    }, 1000);
};

//check server every 300 msec
var id = setInterval(testServer, pingtime);


heartbeat.listen(Number(port), function(){
    console.log('started healthchecker on port '+port);
});

app.get('/', function(req, res){
    // testServer();
    console.log('return : ',destinationPort);
    if(destinationPort === null){
        res.json({'destination' : null,
        'timestamp' : new Date()
        });
    }
    else{
    res.json({'destination' : 'http://localhost:'+destinationPort,
            'timestamp' : new Date()
        });
    }
});

io.on('connection', function(socket){
    testServer(socket)
    console.log('loadbalancer connected');
});


// exports.hbeat = (req,res) => {
//   res.send('working');

//    testServer();
//     console.log('return : ',destinationPort);
//     var d = new Date();
// 	var ds = d.toString();
//     res.send({'destination' : 'http://localhost:'+destinationPort,
//     			'date': ds
// 	});

// }
