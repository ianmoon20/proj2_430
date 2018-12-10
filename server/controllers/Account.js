const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const statsPage = (req, res) => {
  res.render('stats', { csrfToken: req.csrfToken() });
};

const missingPage = (req, res) => {
  res.render('missing');
};

const getStats = (request, response) => {
  const req = request;
  const res = response;

  const stats = {
    username: req.session.account.username,
    createdDate: req.session.account.createdDate,
    _id: req.session.account._id,
  };

  return res.json({ stats });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${request.body.username}`;
  req.body.pass = `${request.body.pass}`;
  req.body.pass2 = `${request.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };
    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

const changePassword = (req, res) => {
  if (!req.body.password3 || !req.body.password2) {
    return res.status(400).json({ error: 'All fields required!' });
  }
  if (req.body.password2 !== req.body.password3) {
    return res.status(400).json({ error: 'Incorrect password confirmation!' });
  }
  Account.AccountModel.findOne({ username: req.session.account.username }).exec((err, result) => {
    if (result) {
      const currAccount = result;
      Account.AccountModel.generateHash(req.body.password3, (salt, hash) => {
        currAccount.password = hash;
        currAccount.salt = salt;
        currAccount.save(() => {
          if (err) {
            console.log(err);
          }
        }).then(() => res.json({ redirect: '/maker' }));
      });
    }
  });
  return res.status(200);
};

module.exports.loginPage = loginPage;
module.exports.statsPage = statsPage;
module.exports.missingPage = missingPage;
module.exports.getStats = getStats;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.changePassword = changePassword;
