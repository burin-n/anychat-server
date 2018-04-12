module.exports = function(app){
  const user = require('../controllers/user.controllers')
  app.post('/user/register', user.register);
  app.post('/user/login', user.login);
  app.get('/user',user.getProfile);
}