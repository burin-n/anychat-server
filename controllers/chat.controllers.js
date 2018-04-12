let Chat = require('mongoose').model('Chat');
// let User = require('mongoose').model('User');
var _ = require('lodash');
var sync = require('synchronize')

exports.joinGroup = (socket) => {
	return (userID, groupID) => {
		console.log('connecting...')
		socket.join(groupID);
		updateSession({userID, groupID}, (status) => {
			console.log(`${userID} join ${groupID} : ${status}`);
			const ret = {
				'status' : status,
			}
			socket.to(socket.id).emit('join', ret);
		});
	}
}

exports.sendMessage = (io) => {
	return function({msg,groupId}){
		// saveMsgToDB(() => {
			console.log(groupId + ' message ' + msg);
			// io.emit('chat message', msg);
			io.in(groupId).emit('chat message',msg);
		// })
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

function updateSession({userID,groupID}, callback){
	Chat.findById(groupID, 'members', function(err, chat){

	})
	callback(1);
}

function saveMsgTODB(callback){

}


function updateState(userID,groupID,lastMsg){

}

exports.register = function(req,res){
	Chat.create(req.body, (err,chat) =>{
		if(err){
			res.status(500).json({status:0, error:'error'});
		}
		else{
			var ret = {};
			var fields = ['name', 'members','_id'];
			fields.forEach( (field) => {
				if(field == '_id') ret['id'] = chat[field];
				else ret[field] = chat[field];
			});
			res.status(200).json(ret);
		}
	});
}

exports.modify = function(req,res){
	Chat.findByIdAndUpdate(req.groupId, req.body, {new: true}, function(err, chat) {
		if(err){
			res.status(500).json({status:0, error:"error"})
		}
		else{
			var ret = {};
			var fields = ['name', 'members','_id'];
			fields.forEach( (field) => {
				if(field == '_id') ret['id'] = chat[field];
				else ret[field] = chat[field];
			});
			res.status(200).json(ret);
		}
	});
}

exports.leaveGroup = function(req,res){
	
	new Promise( (resolve,reject) => {
		Chat.findById(req.groupId, function(err,chat){
			if(err){
				reject()
			}
			else{
				for(let i = 0; i<chat.members; i++){
					if(chat.members[i].id === req.userId){
						chat.members.splice(i, 1);
						break;
					}
				}
				_.unset(chat.state, userId);
				resolve()
			}
		});
	}).then( () => {
		// User.findById(userId, function(err,user){

	}).catch( () => {
		return new Promise.reject();
	}).then( () => {
		res.status(200).json({});
	}).catch( () => {
		res.status(500).json({status:0, error:'error'});	
	});

}