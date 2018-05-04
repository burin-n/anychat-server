module.exports = function(app){
	const group = require('../controllers/group.controllers')
	const chat = require('../controllers/chat.controllers')
	app.route('/chat')
  	.get(group.getGroup)
  	.put(group.modifyGroup)
  	.delete(group.deleteGroup)
  	.post(group.createGroup);
	app.post('/chat/join', group.joinGroup);
	app.get('/chat/all' , group.getallgroup);
	app.post('/chat/leave', group.leaveGroup);
	app.post('/unread', chat.getUnread);
}
