let GroupChat = require('mongoose').model('Chat');

exports.joinGroup = (socket) => {
	return (room, userID) => {
		socket.join(room)
		console.log(`${userID} join ${room}`)
	}
}

exports.sendMessage = (io) => {
	return function({msg,groupId}){
		// saveMsgToDB()
		console.log(groupId + ' message ' + msg);
		// io.emit('chat message', msg);
		io.in(groupId).emit('chat message',msg);
	}
}


exports.getUnread = (io) => {
	return function(packet){
		console.log(packet)
	}
}

exports.disconnect = (io) => {
	return function(socket){
		//updateState(userID,groupID,lastMsg)
	}
}


function saveMsgTODB(){

}


function updateState(userID,groupID,lastMsg){

}