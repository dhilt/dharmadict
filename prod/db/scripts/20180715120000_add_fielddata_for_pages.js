const config = require('../config.js');

const script = {
  title: `Add fielddata for pages`,
  run: (client) =>
    client.indices.putMapping({
      index: config.index,
      type: 'pages',
      body: {
        "properties": {
          "url": {
            "type": "keyword"
          },
          "title": {
            "type": "text",
            "fielddata": true
          },
          "text": {
            "type": "text"
          },
          "author": {
            "type": "text"
          },
          "bio": {
            "type": "boolean"
          }
        }
      }
    })
};

module.exports = script;
