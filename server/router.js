const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/stats', mid.requiresLogin, controllers.Account.statsPage);
  app.get('/getStats', mid.requiresLogin, controllers.Account.getStats);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getDecks', mid.requiresLogin, controllers.Deck.getDecks);
  app.get('/getCards', mid.requiresLogin, controllers.Deck.getCards);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Deck.makerPage);
  app.get('/create', mid.requiresLogin, controllers.Deck.createPage);
  app.post('/create', mid.requiresLogin, controllers.Deck.make);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.put('/change', mid.requiresLogin, controllers.Account.changePassword);
};

module.exports = router;
