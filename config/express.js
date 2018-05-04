var express = require('express');
var morgan = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var cors = require('cors');

module.exports = function(){

	var app = express();
	app.use(cors());
	// setting environment ---------------------------------------
	app.use(compression());


	app.use(bodyParser.urlencoded({
		limits: '10mb',
		extended: true
	}));

	app.use(bodyParser.json());

	// app.use(function(request, response, next){
	// 	passport.authenticate('jwt', {session : false},
	// 		function(err, user, info){
	// 			request.authentication_info = info;
	// 		  if(user){
	// 				request.user = user;
	// 			}
	// 			next();
	// 		})(request, response);
	// });

  //setting up routing -------------------------------------
  require('../routes/user.routes')(app);
	require('../routes/group.routes')(app);
	//end setting up routing -------------------------------------
 //
	return app;
}
