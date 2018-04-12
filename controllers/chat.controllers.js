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

exports.getUnread = (io) => {
	return function(packet){
		console.log(packet)
	}
}

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
		updateState({socketId : socketId});
	}
}

function updateSession({userId,groupId, socketId}, callback){
	Chat.findById(groupId, function(err, chat){
		if(err) callback(0);
		else{
			_.set(chat, ['state', userId, 'session'], socketId);
			_.set(chat, ['state', userId, 'online'], true);
			chat.save( (err) => {
				if(err) callback(0);
				else callback(1);	
			});
		}
	});
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

function updateState(socketId){
	new Promise( (resolve,reject) => {
		Chat.findById(groupId, (err,chat) => {
			if(err){
				reject(err);
			}
			else{
				const userId = _.findKey(chat.state, {session : socketId});
				_.set(chat, ['state',userId,'online'], false);
				resolve(chat);
			}
		});
	}).then( (chat) => {
		return new Promise( (resolve,reject) => {
			chat.save( (err) => {
				if( err ) reject(err);
				else resolve();
			});
		});
	}).catch( (err) => {
		console.error(err);
	}).then( () => {

	});
}


