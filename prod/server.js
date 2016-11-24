var express = require('express');
var passwordHash = require('password-hash');
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');
var jwt = require('jsonwebtoken');
var Cookies = require('cookies');
var path = require('path');

var app = express();
var port = 3000;
var secretKey = 'supersecret';
var accessTokenExpiration = 60 * 60 * 24 * 31; // 1 month

app.use(express.static(path.join(__dirname + '/client')));
app.use(bodyParser.json());

var elasticClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'info'
});

var Users = [{
  id: 1,
  login: 'admin',
  hash: passwordHash.generate('pass')
}, {
  id: 2,
  login: 'user',
  hash: passwordHash.generate('password')
}];

var getUserInfo = function(user) {
  return {
    id: user.id,
    login: user.login
  }
}

var responseError = function(res, message, status) {
  console.log(message);
  //res.status(status);
  res.send({
    error: true,
    message: message
  });
};

var redirect302 = function(res) {
  res.statusCode = 302;
  res.send('Authorization is needed.');
};

var getTokenFromRequest = function(req) {
  var authHeader = req.headers.authorization;
  if (!authHeader) {
    return;
  }
  var bearer = authHeader.substr(7);
  if (!bearer || bearer.length < 10) {
    return;
  }
  return bearer;
};

app.get('/api/userInfo', function(req, res) {
  var token;
  if (!(token = getTokenFromRequest(req))) {
    return redirect302(res);
  }
  jwt.verify(token, secretKey, function(err, decoded) {
    if (!err) {
      userId = decoded.id;
      for (var i = 0; i < Users.length; i++) {
        if (Users[i].id == userId) {
          console.log('Authenticated as ' + Users[i].login);
          return res.send(getUserInfo(Users[i]));
        }
      }
      return responseError(res, 'Can not find user.', 404);
    } else {
      return responseError(res, 'Missed token.', 500);
    }
  })
});

app.post('/api/login', function(req, res) {
  var login = req.body.login;
  var password = req.body.password;

  // search user by login
  for (var i = 0; i < Users.length; i++) {
    if (Users[i].login === login) {
      if (passwordHash.verify(password, Users[i].hash)) {
        var user = getUserInfo(Users[i]);
        console.log('Logged in as ' + user.login + '.');
        var token = jwt.sign(user, secretKey, {
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

app.get('/api/search', function(req, res) {
  console.log('Searching by "' + req.query.pattern + '" pattern.')
  return elasticClient.search({
    index: "dharmadict",
    type: "terms",
    body: {
      query: {
        multi_match: {
          query: req.query.pattern,
          fields: ["wylie", "sanskrit_rus_lower", "sanskrit_eng_lower", "translation.meanings.versions_lower"]
        }
      }
    }
  }, function(error, response, status) {
    if (error) {
      console.log("Search error: " + error)
    } else {
      var result = [];
      response.hits.hits.forEach(function(hit) {
        result.push(hit);
      });
      console.log("Found items: " + result.length + ".");
      return res.json(result);
    }
  });
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/client/index.html'));
});

app.listen(port);

console.log('Listening on port ' + port);
