let Chat = require('mongoose').model('Chat');
let User = require('mongoose').model('User');
var _ = require('lodash');

exports.connectGroup = (socket) => {
	console.log('connecting...')
	return ({userId, groupId}) => {
		socket.join(groupId);
		updateSession({userId, groupId, socketId: socket.id}, (status) => {
			console.log(`${userId} connect to ${groupId} with sesion ${socket.id}: ${status}`);
			const ret = {
				'status' : status,
			}
			console.log('printintintin')
			// socket.to(socket.id).emit('joined', ret);
			socket.emit('joined',ret);
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
				io.in(groupId).emit('chat message',{msg,userId,userName,groupId,time});
			}
		});
	}
}

exports.getUnread = (req,res) => {
	let {userId, groupId} = req.body;
	
	Chat.findById(groupId)
	.then( (chat) => {
		let state = _.get(chat, ['state', userId, 'state','time'], null);
		let msg = _.get(chat, ['message']);
		console.log(chat)
		let i;
		if(state === null) i = msg.length-1;
		else{
			for( i = msg.length-1; i>=0 ; i--){
					if( msg[i].time < state)
						break;
			}
		}
		let read = [];	
		for( let j = 0 ; j<=i ;j++){
			read.push(msg.message[i]);
		}
		let unread = [];
		for( j = i+1; j < msg.length; j++){
			unread.push(msg[i]);
		}
		res.status(200).json({status:1 , read , unread});
	})
	.catch( (err) => {
		console.error(err);
		res.status(500).json({status:0, error: "error"});
	})
}


// update state
exports.notifyReceive = (req,res) => {
	let {userId,groupId,lastMsg} = req.body;
		
		Chat.findById(groupId, function(err, chat){
			if(err){
				console.error(err);
				req.json({err:'error'});
			}
			else{
				_.set(chat.state, [userId, 'state'], lastMsg);
				chat.save( (err) => {
					if(err){
						console.error(err);
						res.json({err:'error'});
					}
					else{
						res.json({
							msg: lastMsg
						});
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
			if(err) {
				console.error(err)
				callback(0);
			}
			else if(!chat){
				console.error('no chat')
				callback(0);
			}
			else{
				_.set(chat, ['state', userId, 'session'], socketId);
				_.set(chat, ['state', userId, 'online'], true);
				chat.save( (err) => {
					console.error(err)
					if(err) callback(0);
					else callback(1);	
				});
			}
		});
	}catch(e){
		console.error(e)
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
