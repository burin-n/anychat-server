module.exports = function(app){
	const chat = require('../controllers/chat.controllers')
	var http = require('http').Server(app);
	var io = require('socket.io')(http);
	
	io.on('connection', function(socket){
		socket.on('joinGroup', chat.joinGroup(socket));
		socket.on('send message', chat.sendMessage(io));
		socket.on('get unread', chat.getUnread(io));
		socket.on('disconnect', chat.disconnect(io));
	});
	return http;
}
