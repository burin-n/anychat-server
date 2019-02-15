var cors = require('cors')
var get = require('http').get;
var port = process.argv.slice(2);

if(port==''){
	port = 5000;
}
//--config-------------------------------------
var server1Prefix = 'http://';
var server2Prefix = 'http://';
var server1Domain = 'localhost';
var server2Domain = 'localhost';
var server1Port = 3001; //set default port for main server
var server2Port = 3002; //set default port for second server
var pingtime = 10;    //ping interval in
var serve1up;
//---------------------------------------------
var server2up;
var prevURL = null;
var activeURL = null;


var app = require('express')();

app.use(cors());

app.get('/', function(req, res){
    
    console.log('return : ',activeURL)
    res.json({
        'destination' : activeURL,
        'timestamp' : new Date()
    });
});



var http = require('http').Server(app);
var io = require('socket.io')(http);
var id = setInterval( () => testServer(), pingtime);

io.on('connection', function(socket){
  
    socket.emit('loadbalance',{
        destination: activeURL,
        'timestamp' : new Date()
    });
    setInterval( () => checkEmit(socket), pingtime )
});
  
http.listen(port, function(){
    console.log('listening on', port);
});

 
function checkEmit(socket){
    
    if (prevURL != activeURL){
        io.emit('loadbalance',{
            destination: activeURL,
            'timestamp' : new Date()
        });
        prevURL = activeURL;
    }
}



function testServer(){
    let info = {
        host: server1Domain,
        port: server1Port,
    };
    let info2 = {
        host: server2Domain,
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
            activeURL = server1Prefix+server1Domain+':'+server1Port;
        } else if(!server2up) {
            activeURL = null;
            
        } else{
            activeURL = server2Prefix+server2Domain+':'+server2Port;
        }
        console.log('activeURL', activeURL, new Date());
    }, 1000);
}