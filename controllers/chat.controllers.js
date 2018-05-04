let Chat = require('mongoose').model('Chat');
let User = require('mongoose').model('User');
var _ = require('lodash');

exports.connectGroup = (socket) => {
	return ({userId, groupId}) => {
		socket.join(groupId);
		updateSession({userId, groupId, socketId: socket.id}, (status) => {
			console.log(`${userId} connect to ${groupId} with sesion ${socket.id}: ${status}`);
			const ret = {
				'status' : status,
			}
			socket.to(socket.id).emit('join', ret);
		});
	}
}

exports.sendMessage = (io,socket) => {
	return function({msg,userId,userName,groupId,time}){
		saveMsgToDB( {msg,userId,userName,groupId,time}, (status, ret) => {
			if(status == 0){
				console.error(ret);
				socket.to(socket.id).emit('error', 'send message error');
			}
			else{
				io.in(groupId).emit('chat message',msg);
			}
		});
	}
}

exports.getUnread = (socket) => {
	return function({userId, groupId}){
		Chat.findById(groupId)
		.then( (chat) => {
			state = _.get(chat, ['state', userId]);
			let i;
			for( i = state.length-1; i>=0 ; i--){
				if( state.message[i].time < state)
					break;
			}
			let read = [];	
			for( let j = 0 ; j<=i ;j++){
				read.push(state.message[i]);
			}
			let unread = [];
			for( j = i+1; j < state.length; j++){
				unread.push(state.message[i]);
			}
			res.status(200).json({status:1 , read , unread});
		})
		.catch( (err) => {
			console.error(err);
			res.status(500).json({status:0, error: "error"});
		})
	}
}

// update state
exports.notifyReceive = (io,socket) => {
	return function({userId,groupId,lastMsg}){
		Chat.findById(groupId, function(err, chat){
			if(err){
				console.error(err);
				socket.to(socket.id).emit('error', 'nofity error');
			}
			else{
				_.set(chat.state, [userId, 'state'], lastMsg);
				chat.save( (err) => {
					if(err){
						console.error(err);
						socket.to(socket.id).emit('error', 'nofity error');
					}
				});
			}
		});
	}
}

exports.disconnect = (socket) => {
	return function(){

	}
}

function updateSession({userId,groupId,socketId}, callback){
	try{
		Chat.findById(groupId, function(err, chat){
			if(err) callback(0);
			else if(!chat){
				callback(0);
			}
			else{
				_.set(chat, ['state', userId, 'session'], socketId);
				_.set(chat, ['state', userId, 'online'], true);
				chat.save( (err) => {
					if(err) callback(0);
					else callback(1);	
				});
			}
		});
	}catch(e){
		callback(0);
	}
}

function saveMsgToDB({msg,userId,userName,groupId,time},callback){
	const pack = { 
		userName,
		userId, 
		message: msg,
		time,
	};

	Chat.findByIdAndUpdate(groupId , {
		$push : {
			message: pack 
		}
	}, { 'new' : true },
	function(err, n_chat){
		if(err){
		 	callback(0,err);
		}
		else{
			callback(1,n_chat)
		}
	});
}
