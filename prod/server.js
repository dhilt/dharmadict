var express = require('express');
var passwordHash = require('password-hash');
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');
var jwt = require('jsonwebtoken');
var Cookies = require('cookies');

var app = express();
var port = 3000;
var secretKey = 'supersecret';
var accessTokenExpiration = 60 * 60 * 24 * 31; // 1 month

app.use(bodyParser.json());

var elasticClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info'
});

var Users = [{
    login: 'admin',
    hash: passwordHash.generate('pass')
}, {
    login: 'admin2',
    hash: passwordHash.generate('pass2')
}];

var responseError = function(res, message, status) {
    console.log(message);
    //res.status(status);
    res.send({
        error: true,
        message: message
    });
}

app.post('/api/login', function(req, res) {
    var login = req.body.login;
    var password = req.body.password;

    // search user by login
    for (var i = 0; i < Users.length; i++) {
    console.log(login)
        if (Users[i].login === login) {
            if (passwordHash.verify(password, Users[i].hash)) {
                var user = Users[i];
                console.log('Log in user ' + user.login + '.');

                // generate token
                var token = jwt.sign({
                    id: user.id,
                    login: user.login
                }, secretKey, {
                    expiresIn: accessTokenExpiration
                });

                // store the token via cookie
                new Cookies(req, res).set('access_token', token, {
                    httpOnly: true
                });

                res.send(user);
                return;
            }
            else {
                return responseError(res, 'Can not authenticate.', 401);
            }
        }
    }
    if (!user) {
        return responseError(res, 'Can not find user.', 404);
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

app.configure(function() {
    app.use(express["static"](__dirname + '/client'));
    app.get('/api/terms', function(req, res) {
        return elasticClient.search({
            index: "dharmadict",
            type: "terms",
            body: {
                query: {
                    multi_match: {
                        query: req.query.searchPattern,
                        type: "most_fields",
                        operator: "and",
                        fields: ["wylie", "sanskrit_rus_lower", "sanskrit_eng_lower", "translations.meanings.versions_lower"]
                    }
                }
            }
        }).then(function(result) {
            var hit;

            return res.json((function() {
                var _i, _len, _ref, _results;

                _ref = result.hits.hits;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    hit = _ref[_i];
                    _results.push(hit._source);
                }
                return _results;
            })());
        });
    });
});

app.listen(port);

console.log('Listening on port ' + port);
