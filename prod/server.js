let express = require('express');
let passwordHash = require('password-hash');
let bodyParser = require('body-parser');
let elasticsearch = require('elasticsearch');
let jwt = require('jsonwebtoken');
let Cookies = require('cookies');
let path = require('path');

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

let users = require('./users.js');
let Users = users.Users;
let Roles = users.Roles;

let getUserInfo = (user) => ({
  id: user.id,
  code: user.code,
  login: user.login,
  role: user.role,
  roleId: user.roleId,
  name: user.name
})

let responseError = (res, message, status) => {
  console.log(message);
  //res.status(status);
  res.send({
    error: true,
    message: message
  });
};

let redirect302 = (res) => {
  res.statusCode = 302;
  res.send('Authorization is needed.');
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
    if (!err) {
      userId = decoded.id;
      for (let i = 0; i < Users.length; i++) {
        if (Users[i].id == userId) {
          return onSuccess(Users[i]);
        }
      }
      return responseError(res, 'Can not find user.', 404);
    } else {
      return responseError(res, 'Missed token.', 500);
    }
  })
};

app.get('/api/userInfo', function(req, res) {
  authorize(req, res, (user) => {
    console.log('Authenticated as ' + user.login);
    return res.send(getUserInfo(user));
  });
});

app.post('/api/login', function(req, res) {
  let login = req.body.login;
  let password = req.body.password;

  // search user by login
  for (let i = 0; i < Users.length; i++) {
    if (Users[i].login === login) {
      if (passwordHash.verify(password, Users[i].hash)) {
        let user = getUserInfo(Users[i]);
        console.log('Logged in as ' + user.login + '.');
        let token = jwt.sign(user, secretKey, {
          expiresIn: accessTokenExpiration
        });
        res.send({
          user: user,
          token: token
        });
        return;
      } else {
        responseError(res, 'Can not authenticate.', 401);
      }
    }
  }
  if (!user) {
    responseError(res, 'Can not find user.', 404);
  }
});

app.get('/api/test', function(req, res) {
  elasticClient.index({
    index: 'test',
    id: '1',
    type: 'terms',
    body: {
      "ConstituencyName": "Ipswich",
      "ConstituencyID": "E14000761",
      "ConstituencyType": "Borough",
      "Electorate": 74499,
      "ValidVotes": 1,
    }
  }, function(err, resp, status) {
    console.log(resp);
  });
});

let mockData = require('./mock.json');

app.get('/api/search_test', function(req, res) {
  res.send(mockData.results);
});

app.get('/api/search', function(req, res) {
  console.log('Searching terms by "' + req.query.pattern + '" pattern.')
  return elasticClient.search({
    index: "dharmadict",
    type: "terms",
    body: {
      query: {
        multi_match: {
          query: req.query.pattern,
          type: "most_fields",
          operator: "and",
          fields: ["wylie", "sanskrit_rus_lower", "sanskrit_eng_lower", "translation.meanings.versions_lower"]
        }
      }
    }
  }, (error, response, status) => {
    if (error) {
      console.log("Search error.");
      return responseError(res, error.message, 500);
    } else {
      let result = [];
      response.hits.hits.forEach((hit) => {
        hit._source.id = hit._id;
        result.push(hit._source);
      });
      console.log("Found items: " + result.length + ".");
      return res.json(result);
    }
  });
});

function getTermById(res, termId, successCallback) {
  elasticClient.search({
    index: "dharmadict",
    type: "terms",
    body: {
      query: {
        ids: {
          values: [termId]
        }
      }
    }
  }, (error, response, status) => {
    if (error) {
      console.log("Get term by id error.");
      responseError(res, error.message, 500);
    } else {
      successCallback(response.hits.hits[0]);
    }
  });
}

app.get('/api/translation', function(req, res) {
  if (!req.query.termId || !req.query.translatorId) {
    return responseError(res, 'Incorrect "/api/term" request params.', 500);
  }
  console.log('Requesting translation "' + req.query.termId + '" (' + req.query.translatorId + ') data.');

  authorize(req, res, (user) => {
    getTermById(res, req.query.termId, (hit) => {
      let term = hit ? hit._source : null;
      let ts = term ? term.translations : null;
      if (ts && ts.length) {
        for (let i = 0; i < ts.length; i++) {
          if (ts[i].translatorId === req.query.translatorId) {
            if (user.code === ts[i].translatorId || user.role === 'admin') {
              result = {
                termId: hit._id,
                termName: term.wylie,
                translation: ts[i]
              };
              break;
            } else {
              return responseError(res, 'Unpermitted access.', 500);
            }
          }
        }
      }
      if (!result) {
        responseError(res, 'Can not find term.', 404);
      } else {
        console.log('Term was successfully found.');
        res.json(result);
      }
    });
  });
});

app.post('/api/update', function(req, res) {
  let termId = req.body.termId;
  let translation = req.body.translation;
  let translatorId = req.body.translation.translatorId;
  if (!termId || !translation) {
    return responseError(res, 'Incorrect "/api/update" request params.', 500);
  }
  console.log('Updating translation. Term id = "' + termId + '", translator id = "' + translation.translatorId + '".');

  authorize(req, res, function(user) {
    getTermById(res, termId, (hit) => {
      let term = hit ? hit._source : null;
      let ts = term ? term.translations : null;
      let foundT = ts ? ts.find(t => t.translatorId === translatorId) : null;
      if (foundT) {
        console.log(JSON.stringify(foundT));
        console.log(JSON.stringify(translation));
      }

      return res.json({
        done: true
      });

      /*elasticClient.index({
        index: "dharmadict",
        type: "terms",
        id: termId,
        body: {

        }
      }, (error, response, status) => {
        if (error) {
          console.log("Search error.");
          return responseError(res, error.message, 500);
        } else {
          let result = null,
            hit = response.hits.hits[0];
          let term = hit ? hitresponse.hits.hits[0]._source : null;
          let ts = term ? term.translations : null;
          if (ts && ts.length) {
            for (let i = 0; i < ts.length; i++) {
              if (ts[i].translatorId === req.query.translatorId) {
                if (user.code === ts[i].translatorId || user.role === 'admin') {
                  result = {
                    termId: hit._id,
                    termName: term.wylie,
                    translation: ts[i]
                  };
                  break;
                } else {
                  return responseError(res, 'Unpermitted access.', 500);
                }
              }
            }
          }
          if (!result) {
            return responseError(res, 'Can not find term.', 404);
          } else {
            console.log("Term was successfully found.");
            return res.json(result);
          }
        }
      });*/
    });
  });
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.listen(port);

console.log('Listening on port ' + port);
