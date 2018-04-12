module.exports = function(app){
	const group = require('../controllers/group.controllers')
  app.route('/chat')
  	.get(group.getGroup)
  	.put(group.modifyGroup)
  	.delete(group.deleteGroup)
  	.post(group.createGroup);
	app.post('/chat/join', group.joinGroup);
}
