const chat = require('../controllers/chat.controllers')

module.exports = function(app){
	var http = require('http').Server(app);
	var io = require('socket.io')(http);
	
	io.on('connection', function(socket){
		console.log(socket.id)
		
		socket.on('get unread', chat.getUnread(io));
		// socket.on('chat message', chat.sendMessage(io));
		socket.on('disconnect', chat.disconnect(io));
	});

	return http;

}
