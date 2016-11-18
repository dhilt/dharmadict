var app, elasticClient, elasticsearch, express, port;

express = require('express');

app = express();

port = 3000;

elasticsearch = require('elasticsearch');

elasticClient = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'info'
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
