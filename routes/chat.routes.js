module.exports = function(app){
	const chat = require('../controllers/chat.controllers')
  app.post('/chat/register', chat.register);
}