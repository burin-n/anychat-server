const user = require('../controllers/user.controllers')

module.exports = function(app){
  app.post('/user/register', user.register);
  app.post('/user/login', user.login);
  app.get('/user',user.getProfile);
}