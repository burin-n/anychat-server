var mongoose = require('mongoose');

module.exports = function(){

	mongoose.set('debug');			// mode
	var db = mongoose.connect('mongodb://localhost:27017'); // connect to database

	// create collection
	require('../models/chat.models')
	require('../models/user.models')
	return db; // database with setting
}
