const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const config = require('./config.js');
const logger = require('./log/logger');
const elasticClient = require('./controllers/helpers/db.js');

const serverHelper = require('./controllers/helpers/serverHelper.js');
const usersController = require('./controllers/users');
const getUserInfo = usersController.getUserInfo;
const authController = require('./controllers/auth');
const responseError = require('./controllers/helpers/serverHelper').responseError;
const ApiError = require('./controllers/helpers/serverHelper').ApiError;
const sendApiError = require('./controllers/helpers/serverHelper').sendApiError;
const termsController = require('./controllers/terms');

const app = express();
app.use(bodyParser.json());

const doAuthorize = (req) => {
  const token = authController.extractToken(req.headers.authorization);
  if (!token) {
    return Promise.reject('Authorization needed');
  }
  return authController.parseToken(token)
    .then(login => usersController.findByLogin(login))
    .catch(error => {
      throw new ApiError(`Unauthorized access. ${error.text}`, error.code)
    })
};

app.get('/api/mytest', (req, res) =>
  usersController.findAll()
    .then(result => res.send({result}))
    .catch(error => res.send({error}))
);

app.get('/api/userInfo', (req, res) =>
  doAuthorize(req)
    .then(user => {
      logger.info('Authenticated as ' + user.login);
      res.send(getUserInfo(user));
    })
    .catch(error => responseError(res, `Can't get user info. ${error}`, 500))
);

app.post('/api/login', (req, res) => {
  const {login, password} = req.body;
  usersController.canLogin(login, password)
    .then(user => {
      const {token} = authController.generateToken(user);
      res.send({user: getUserInfo(user), token})
    })
    .catch(error => responseError(res, `Can't login. ${error}`, 500))
});

app.get('/api/search', function (req, res) {
  logger.info('Searching terms by "' + req.query.pattern + '" pattern');
  return elasticClient.search({
    index: config.db.index,
    type: 'terms',
    body: {
      query: {
        multi_match: {
          query: req.query.pattern,
          type: 'most_fields',
          operator: 'and',
          fields: ['wylie', 'sanskrit_rus_lower', 'sanskrit_eng_lower', 'translation.meanings.versions_lower']
        }
      }
    }
  }, (error, response) => {
    if (error) {
      logger.error('Search error');
      return responseError(res, error.message, 500);
    }
    let result = [];
    response.hits.hits.forEach((hit) => {
      hit._source.id = hit._id; // add id field
      result.push(hit._source);
    });
    logger.info('Found items: ' + result.length);
    return res.json(result);
  });
});

app.get('/api/translation', (req, res) => {
  const {termId, translatorId} = req.query;
  if (!termId || !translatorId) {
    return responseError(res, 'Incorrect /api/term request params', 500, 'info');
  }
  logger.info('Requesting a translation by term id "' + termId + '" and translatorId "' + translatorId + '"');
  let user, term, translations;
  doAuthorize(req)
    .then(result => {
      user = result;
      return termsController.findById(termId);
    })
    .then(term => {
      if (!(translations = term ? term.translations : null)) {
        throw 'Can not find a translation by termId'
      }
      return usersController.findByLogin(translatorId)
    })
    .then(translator => {
      if(user.id !== translator.id && user.role !== 'admin') {
        throw 'Unpermitted access'
      }
      return termsController.findTranslations(translator, term, translations)
    })
    .then(result => res.json({result}))
    .catch(error => responseError(res, `Can't get a translation. ${error}`, 500))
});

app.post('/api/update', function (req, res) {
  let termId = req.body.termId;
  let translation = req.body.translation;
  if (!termId || !translation) {
    return responseError(res, 'Incorrect /api/update request params', 500, 'info');
  }
  let translatorId = req.body.translation.translatorId;
  logger.info('Term updating. Term id = "' + termId + '", translator id = "' + translation.translatorId + '"');

  doAuthorize(req, res, function (user) {
    termsController.findById(res, termId, (hit) => {
      let term = hit ? hit._source : null;
      if (!term) {
        return responseError(res, 'Can\'t request term to update', 500);
      }
      term.translations = term.translations || [];
      let foundT = term.translations.find(t => t.translatorId === translatorId);
      let isEmpty = !(translation.meanings && translation.meanings.length);
      if (!foundT && !isEmpty) {
        term.translations.push(translation);
      } else if (foundT) {
        if (isEmpty) {
          term.translations = term.translations.filter(t => t.translatorId !== translatorId);
        } else {
          foundT.meanings = translation.meanings;
        }
      }
      translation.meanings.forEach(m => m.versions_lower = m.versions.map(v => v.toLowerCase()));
      elasticClient.index({
        index: config.db.index,
        type: 'terms',
        id: termId,
        body: term
      }, (error, response, status) => {
        if (error) {
          logger.error('Update term error');
          return responseError(res, error.message, 500);
        }
        logger.info('Term was successfully updated');
        term.id = termId; // add id field
        return res.json({
          success: true,
          term: term
        });
      });
    });
  });
});

app.post('/api/newTerm', function (req, res) {
  let termName = req.body.term.trim();
  if (!termName) {
    return responseError(res, 'Incorrect /api/newTerm request params', 500);
  }
  let termId = termName.replace(/ /g, '_');
  logger.info('Term adding: name "' + termName + '", id "' + termId + '"');

  doAuthorize(req, res, function (user) {
    if (user.role !== 'admin') {
      return responseError(res, 'Only superadmin can create new terms', 500);
    }
    termsController.findById(res, termId, (hit) => {
      let term = hit ? hit._source : null;
      if (term) {
        return responseError(res, 'Such term ("' + termId + '") already exists', 500);
      }
      term = {
        wylie: termName,
        translations: []
      };
      elasticClient.index({
        index: config.db.index,
        type: 'terms',
        id: termId,
        body: term
      }, (error, response, status) => {
        if (error) {
          logger.error('Create term error');
          return responseError(res, error.message, 500);
        }
        logger.info('Term was successfully created');
        return res.json({
          success: true
        });
      });
    });
  });
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
    .then(user => res.json({success: true, user: getUserInfo(user)}))
    .catch(error => responseError(res, `Can't find user. ${error}`, 500))
);

// serve static
app.use(express.static(path.join(__dirname + '/client')));
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.listen(config.app.port);

logger.info(`Listening on port ${config.app.port}...`);
