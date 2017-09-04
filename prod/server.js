const express = require('express');
const bodyParser = require('body-parser');
const elasticsearch = require('elasticsearch');
const path = require('path');
const logger = require('./log/logger');

const serverHelper = require('./controllers/helpers/serverHelper.js');
const usersController = require('./controllers/users');
const getUserInfo = usersController.getUserInfo;
const authController = require('./controllers/auth');
const responseError = require('./controllers/helpers/serverHelper').responseError;

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname + '/client')));
app.use(bodyParser.json());

let elasticClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'info'
});

const doAuthorize = (req, res) => {
  const token = authController.extractToken(req.headers.authorization);
  if (!token) {
    serverHelper.redirect302(res);
    throw null
  }
  return authController.parseToken(token)
    .then(login => usersController.findByLogin(login))
    .catch(error => {
      serverHelper.responseError(res, `Authorization error. ${error}`, 500);
      throw null
    })
};

app.get('/api/mytest', (req, res) => {
  usersController.findAll()
    .then(result => res.send({result}))
    .catch(error => res.send({error}))
});

app.get('/api/userInfo', (req, res) => {
  doAuthorize(req, res)
    .then(user => {
      logger.info('Authenticated as ' + user.login);
      res.send(getUserInfo(user));
    })
    .catch(err => null);
});

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
    index: 'dharmadict',
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

function getTermById(res, termId, successCallback) {
  elasticClient.search({
    index: 'dharmadict',
    type: 'terms',
    body: {
      query: {
        ids: {
          values: [termId]
        }
      }
    }
  }, (error, response) => {
    if (error) {
      logger.error('Get term by id (' + termId + ') error');
      return responseError(res, error.message, 500);
    }
    logger.info('A term was found by id ' + termId);
    return successCallback(response.hits.hits[0]);
  });
}

app.get('/api/translation', function (req, res) {
  if (!req.query.termId || !req.query.translatorId) {
    return responseError(res, 'Incorrect /api/term request params', 500, 'info');
  }
  logger.info('Requesting a translation by term id "' + req.query.termId + '" and translatorId "' + req.query.translatorId + '"');

  doAuthorize(req, res, (user) => {
    getTermById(res, req.query.termId, (hit) => {
      usersController.findByLogin(req.query.translatorId).then(translator => {
        if (!translator) {
          return responseError(res, 'Can not find a translator by translatorId', 500);
        }
        let term = hit ? hit._source : null;
        let translations = term ? term.translations : null;
        if (!translations) {
          return responseError(res, 'Can not find a translation by termId', 500);
        }
        let translation = translations.find(t => t.translatorId === translator.code);
        if (!translation) {
          return res.json({
            termId: hit._id,
            termName: term.wylie,
            translation: {
              translatorId: translator.id,
              language: translator.language,
              meanings: []
            }
          });
        }
        if ((user.code !== translation.translatorId || user.code !== translator.code) && user.role !== 'admin') {
          return responseError(res, 'Unpermitted access', 500);
        }
        logger.info('Term\'s translation was successfully found');
        res.json({
          termId: hit._id,
          termName: term.wylie,
          translation
        });
      }).catch(error => responseError(res, error, 500));
    });
  });
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
    getTermById(res, termId, (hit) => {
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
        index: 'dharmadict',
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
    getTermById(res, termId, (hit) => {
      let term = hit ? hit._source : null;
      if (term) {
        return responseError(res, 'Such term ("' + termId + '") already exists', 500);
      }
      term = {
        wylie: termName,
        translations: []
      };
      elasticClient.index({
        index: 'dharmadict',
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

app.post('/api/newUser', function (req, res) {
  usersController.create(req.body.user)
    .then(result => res.json(result))
    .catch(error => responseError(res, error, 500))
});

app.get('/api/users/:name', (req, res) =>
  usersController.findByLogin(req.params.name)
    .then(user => res.json({success: true, user: getUserInfo(user)}))
    .catch(error => responseError(res, `Can't find user. ${error}`, 500))
);

// serve static
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.listen(port);

logger.info('Listening on port ' + port + '...');
