module.exports = function(){
	const mongoose = require('mongoose');	
	mongoose.set('debug',true);			// mode
	var db = mongoose.connect('mongodb://localhost:27017/myapp'); // connect to database

	// create collection
	require('../models/chat.models')
	require('../models/user.models')
	return db; // database with setting
}
