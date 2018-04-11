let GroupChat = require('mongoose').model('Chat');

exports.sendMessage = (io) => {
	return function(msg){
		console.log('message ' + msg);
		io.emit('chat message', msg);
	}
}


exports.getUnread = (io) => {
	return function(){

	}
}

exports.disconnect = (io) => {
	return function(socket){
		console.log('user disconnect', socket.id);
	}
}
