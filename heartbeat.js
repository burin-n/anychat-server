
var cors = require('cors')
var get = require('http').get;
var port = process.argv.slice(2);

if(port==''){
	port = 5000;
}

var server1Port = 3001; //set default port for main server
var server2Port = 3002; //set default port for second server
var pingtime = 1000;    //ms
var serve1up;
var destinationPort = null;
var server2up;
var prevPort = null;


var app = require('express')();

app.use(cors());
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



var http = require('http').Server(app);
var io = require('socket.io')(http);
var id = setInterval( () => testServer(), pingtime);

io.on('connection', function(socket){
    if(destinationPort === null) destination = null;
    else destination = 'http://localhost:'+destinationPort;
    socket.emit('loadbalance',{
        destination,
        'timestamp' : new Date()
    });
    setInterval( () => checkEmit(socket), pingtime )
});
  
http.listen(port, function(){
    console.log('listening on', port);
});

 
function checkEmit(socket){
    
    if (prevPort != destinationPort){

        if(destinationPort === null) destination = null;
        else destination = 'http://localhost:'+destinationPort;
        
        io.emit('loadbalance',{
            destination,
            'timestamp' : new Date()
        });
        prevPort = destinationPort;

    }
}



function testServer(){
    // console.log(socket)
    

    let info = {
        host: 'localhost',
        port: server1Port,
    };
    let info2 = {
        host: 'localhost',
        port: server2Port,
    };
    //ping using http get
    let request = get(info, function(res) {
        serve1up = true;
    });
    request.on('error', function(e) {
        serve1up = false;
        print = 0;
    });
     let request2 = get(info2, function(res) {
        server2up = true;
    });
     request2.on('error', function(e) {
        server2up = false;
        print = 0;
    });

    setTimeout(() => {
        
        if(serve1up){
            destinationPort = server1Port;
        } else if(!server2up) {
            console.log("all server down ");
            destinationPort = null;
            
        } else{
            console.log("success ping to port "+server2Port);
            destinationPort = server2Port;
        }
        console.log("heartbeat set port: "+destinationPort+" to client", new Date());
    }, 1000);
};
