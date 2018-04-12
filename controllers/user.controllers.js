const User = require('mongoose').model('User')

exports.register = function(req,res){
	User.create(req.body, (err, user) => {
		if(err){

		}
		else{
			
		}
	});
}

exports.login = function(req,res){

}

exports.getProfile = function(req,res){
	res.json({ok:"OK"})
}