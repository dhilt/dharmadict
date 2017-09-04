let express = require('express');
let passwordHash = require('password-hash');
let bodyParser = require('body-parser');
let elasticsearch = require('elasticsearch');
let jwt = require('jsonwebtoken');
let Cookies = require('cookies');  // Delete this?
let path = require('path');
let logger = require('./log/logger');

let usersController = require('./controllers/users');
let getUserInfo = usersController.getUserInfo;

let app = express();
let port = 3000;
let secretKey = 'supersecret';
let accessTokenExpiration = 60 * 60 * 24 * 31; // 1 month

app.use(express.static(path.join(__dirname + '/client')));
app.use(bodyParser.json());

let elasticClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'info'
});

let responseError = (res, message, status, level = 'error') => {
  if (level === 'error') {
    logger.error(message);
  } else {
    logger.info(message);
  }
  //res.status(status);
  res.send({
    error: true,
    message: message
  });
};

let redirect302 = (res) => {
  res.statusCode = 302;
  res.send('Authorization is needed');
};

let getTokenFromRequest = (req) => {
  let authHeader = req.headers.authorization;
  if (!authHeader) {
    return;
  }
  let bearer = authHeader.substr(7);
  if (!bearer || bearer.length < 10) {
    return;
  }
  return bearer;
};

let authorize = (req, res, onSuccess) => {
  let token;
  if (!(token = getTokenFromRequest(req))) {
    return redirect302(res);
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return responseError(res, 'Authorization error. Missed token', 500);
    }
    let userId = decoded.id;
    usersController.findById(userId)
      .then(result => onSuccess(result))
      .catch(error => responseError(res, error, 500));
  });
};

app.get('/api/userInfo', function (req, res) {
  authorize(req, res, (user) => {
    logger.info('Authenticated as ' + user.login);
    return res.send(getUserInfo(user));
  });
});

app.post('/api/login', function (req, res) {
  const login = req.body.login;
  const password = req.body.password;
  usersController.doLogin(login, password)
    .then(user => {
      logger.info('Logged in as ' + user.login);
      const token = jwt.sign(user, secretKey, {
        expiresIn: accessTokenExpiration
      });
      res.send({user: getUserInfo(user), token});
    })
    .catch(error => responseError(res, `Can't login. ${error}`, 500));
});

app.get('/api/search', function (req, res) {
  logger.info('Searching terms by "' + req.query.pattern + '" pattern')
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
  }, (error, response, status) => {
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
  }, (error, response, status) => {
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

  authorize(req, res, (user) => {
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

  authorize(req, res, function (user) {
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

  authorize(req, res, function (user) {
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
  let newUser = req.body.user;
  usersController.create(newUser)
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
