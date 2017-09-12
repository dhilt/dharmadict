const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const config = require('./config.js');
const logger = require('./log/logger');

const ApiError = require('./helper').ApiError;
const sendApiError = require('./helper').sendApiError;
const authController = require('./controllers/auth');
const termsController = require('./controllers/terms');
const usersController = require('./controllers/users');

const app = express();
app.use(bodyParser.json());

const doAuthorize = (req) => {
  const token = authController.extractToken(req.headers.authorization);
  if (!token) {
    return Promise.reject(new ApiError('Authorization needed', 302));
  }
  return authController.parseToken(token)
    .then(login => usersController.findByLogin(login))
    .catch(error => {
      throw new ApiError(`Unauthorized access. ${error.text}`, error.code)
    })
};

app.get('/api/test', (req, res) => {
  const param = req.query.param;
  res.send({success: true, param});
});

app.get('/api/userInfo', (req, res) =>
  doAuthorize(req)
    .then(user => {
      logger.info('Authenticated as ' + user.login);
      res.send(usersController.getUserInfo(user));
    })
    .catch(error => sendApiError(res, 'Can\'t get user info.', error))
);

app.post('/api/login', (req, res) => {
  const {login, password} = req.body;
  usersController.canLogin(login, password)
    .then(user => {
      const _user = usersController.getUserInfo(user);
      const token = authController.generateToken(_user);
      res.send({user: _user, token})
    })
    .catch(error => sendApiError(res, 'Can\'t login.', error))
});

app.get('/api/search', (req, res) => {
  termsController.searchByPattern(req.query.pattern)
    .then(result => res.json(result))
    .catch(error => sendApiError(res, 'Search error', error))
});

app.get('/api/translation', (req, res) => {
  const {termId, translatorId} = req.query;
  if (!termId || !translatorId) {
    return sendApiError(res, 'Incorrect /api/term request params', null);
  }
  logger.info('Requesting a translation by term id "' + termId + '" and translatorId "' + translatorId + '"');
  let user, term, translations;
  doAuthorize(req)
    .then(result => {
      user = result;
      return termsController.findById(termId);
    })
    .then(_term => {
      term =_term;
      if (!(translations = term ? term.translations : null)) {
        throw 'Can not find a translation by termId'
      }
      return usersController.findById(translatorId)
    })
    .then(translator => {
      if (user.id !== translator.id && user.role !== 'admin') {
        throw 'Unpermitted access'
      }
      return termsController.findTranslations(translator, term, translations)
    })
    .then(result => res.json({result}))
    .catch(error => {
      console.log(error);
      sendApiError(res, `Can't get a translation.`, error)
    })
});

app.post('/api/update', (req, res) => {
  const {termId, translation} = req.body;
  doAuthorize(req)
    .then(user => termsController.update(user, termId, translation))
    .then(term => res.json({success: true, term}))
    .catch(error => sendApiError(res, 'Can\'t update term.', error))
});

app.post('/api/newTerm', (req, res) => {
  doAuthorize(req)
    .then(user => usersController.isAdmin(user))
    .then(() => termsController.create(req.body.term))
    .then(id => res.json({success: true, id: id}))
    .catch(error => sendApiError(res, 'Can\'t create new term.', error))
});

app.put('/api/newUser', (req, res) => {
  doAuthorize(req)
    .then(user => usersController.isAdmin(user))
    .then(user => usersController.create(req.body.user))
    .then(result => res.json({success: true, user: result}))
    .catch(error => sendApiError(res, 'Can\'t create new user.', error))
});

app.get('/api/users/:name', (req, res) =>
  usersController.findByLogin(req.params.name)
    .then(user => res.json({success: true, user: usersController.getUserInfo(user)}))
    .catch(error => sendApiError(res, 'Can\'t find user', error))
);

// serve static
app.use(express.static(path.join(__dirname + '/client')));
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.listen(config.app.port);

logger.info(`Listening on port ${config.app.port}...`);

module.exports = app;
