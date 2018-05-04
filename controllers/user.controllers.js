const User = require('mongoose').model('User')

exports.register = function(req,res){
	User.create(req.body, (err, user) => {
		if(err){
			res.status(500).json({status:0, error:'username error'});
		}
		else{
			var ret = {};
			var fields = ['username', 'name', 'password','_id', 'picture'];
			fields.forEach( (field) => {
				if(field == '_id') ret['id'] = user[field];
				else ret[field] = user[field];
			});
			res.status(200).json(ret);
		}
	});
}

exports.login = function(req,res){
	User.findOne({'username': req.body.username}, 'username name password', (err, user) => {
		if(err){
			res.status(500).json({status:0, error:'login error'});
		} else if (!user){
			res.json({error: 'Incorrect Username'});
		} else if (req.body.password == user.password){
			var ret = {};
			var fields = ['username', 'name','_id'];
			fields.forEach( (field) => {
				if(field == '_id') ret['id'] = user[field];
				else ret[field] = user[field];
			});
			res.status(200).json(ret);
		} else {
			res.json({error: 'Incorrect Password'});
		}
	});
}

exports.getProfile = function(req,res){
	User.findOne({'username': req.query.username}, 'username name', (err, user) => {
		if(err){
			res.status(500).json({status:0, error:'get profile error'});
		} else {
			var ret = {};
			var fields = ['username', 'name','_id','picture'];
			fields.forEach( (field) => {
				if(field == '_id') ret['id'] = user[field];
				else ret[field] = user[field];
			});
			res.status(200).json(ret);
		}
	});
}
