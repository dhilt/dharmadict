var app, elasticClient, elasticsearch, express, port;

express = require('express');

app = express();

port = 3000;

elasticsearch = require('elasticsearch');

elasticClient = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'info'
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
