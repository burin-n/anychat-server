let User = require('mongoose').model('User');
let Chat = require('mongoose').model('Chat');
<<<<<<< HEAD
=======
let _ = require('lodash');
>>>>>>> a08ec39b53e05940e2c47d8324c673abdd1d0c59

exports.createGroup = function(req,res){
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

exports.modifyGroup = function(req,res){
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

exports.getallgroup = (req,res) => {
	const user_id = req.query.id;
	let ret = [];
	Chat.find({})
	.then( (chats) => {
		chats.forEach( (chat) => {
			let group = {};
			group.id = chat._id;
			group.name = chat.name;
			group.n_member = chat.members.length;
			if( _.get(chat, ['state', user_id ] ) === undefined)
				group.ismember = false;
			else
				group.ismember = true;
			ret.push(group);
		});
		res.json(ret);
	}).catch( err => {
		console.error(err);
		res.staus(500).json({status:0,error:"error"});
	});
}

exports.getGroup = function(req,res){
	Chat.findById(req.query.groupId)
	.then( (chat) => {
		console.log(chat)
		const fields = ['name', 'members'];
		let ret = {};
		fields.forEach( (field) => {
			ret[field] = chat[field];
		});
		ret.id = chat._id;
		res.status(200).json({status:1, chat:ret});
	})
	.catch( (err) => {
		console.error(err);
		res.status(500).json({status:0, error:"error"});
	})
}


exports.deleteGroup = function(req,res){
	User.update({},
	{
		$pull : {
			"chats" : req.body.groupId
		}
	},{ multi: true })
		.then( (users) =>{
			return Chat.findByIdAndRemove(req.body.groupId);
		}).catch( (err) => {
			return Promise.reject(err);
		}).then( () => {
			res.status(200).json({status:1})
		}).catch( (err) => {
			console.error(err);
			res.status(500).json({status:0, error: 'error'})
		});
}

exports.joinGroup = function(req,res){
	const {userId, groupId} = req.body;
	new Promise( (resolve,reject) => {
		User.findById(userId, function(err,user){
			if(err) reject(err);
			else{
				if(groupId in user.chats){
					resolve(user);
		 		}
				else{
					user.chats.push(groupId);
					resolve(user);
				}
			}
		});
	}).catch( (err) => {
		return Promise.reject(err);
	}).then( (user) => {
		return new Promise( (resolve,reject) => {
			Chat.findById(groupId, function(err,chat){
				if(err) reject(err);
				else{
					let isMember = false;
					chat.members.forEach( (member) => {
						if(member.id === userId)
							isMember = true;
					});
					if(!isMember){
						chat.members.push({id:user._id, name:user.name});
						_.set(chat, ['state'] , null );
						resolve({user,chat});
					}
					else resolve({user,chat});
				}
			});
		});
	}).catch( (err) => {
		return Promise.reject(err);
	}).then( ({user,chat}) => {
		return new Promise( (resolve,reject) => {
			user.save( (err) => {
				if(err) reject();
				else resolve(chat);
			});
		});
	}).catch( (err) => {
		return Promise.reject(err);
	}).then( (chat) => {
		chat.save( (err) => {
			if(err) reject(err);
			else res.json({ status:1, mesage:"joined"});
		});
	}).catch( (err) => {
		console.error(err);
		res.status(500).json({status:0, error:"error"});
	});
}

exports.leaveGroup = function(req,res){

	new Promise( (resolve,reject) => {
		Chat.findById(req.groupId, function(err,chat){
			if(err){
				reject(err)
			}
			else{
				for(let i = 0; i<chat.members; i++){
					if(chat.members[i].id === req.userId){
						chat.members.splice(i, 1);
						break;
					}
				}
				_.unset(chat.state, userId);
				resolve(chat)
			}
		});
	}).catch( (err) => {
		return Promise.reject(err);
	}).then( (chat) => {
		User.findById(userId, function(err,user){
			if(err){
				reject(err);
			}
			else{
				user.chats.splice(user.chats.indexOf(groupId),1);
				resovle({chat,user});
			}
		});
	}).catch( (err) => {
		return Promise.reject(err);
	}).then( ({chat,user}) => {
		return new Promise((resolve,reject) => {
			chat.save( (err) => {
				if(err) reject(err);
				else resolve(user);
			});
		});
	}).catch( (err) => {
		return Promise.reject(err);
	}).then( (user) => {
		return new Promise((resolve,reject) => {
			user.save( (err,n_user) => {
				if(err) reject(err);
				else resolve(n_user);
			});
		});
	}).catch( (err) => {
		console.error(err);
		res.status(500).json({status:0, error:'error'});
	}).then( (n_user) => {
		n_user.id = n_user._id;
		n_user._id = undefined;
		res.status(200).json(n_user);
	});

}
