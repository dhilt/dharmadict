const config = require('../config.js');

const script = {
  title: `Create ${config.index} index`,
  run: (client) =>
    client.indices.create({
      index: config.index,
      body: {
        "mappings": {
          "users": {
            "properties": {
              "name": {
                "type": "string"
              },
              "role": {
                "type": "string",
                "index": "not_analyzed"
              },
              "login": {
                "type": "string",
                "index": "not_analyzed"
              },
              "hash": {
                "type": "string",
                "index": "not_analyzed"
              },
              "description": {
                "type": "string"
              }
            }
          },
          "terms": {
            "properties": {
              "sanskrit_eng": {
                "type": "string"
              },
              "sanskrit_eng_lower": {
                "type": "string"
              },
              "sanskrit_rus": {
                "type": "string"
              },
              "sanskrit_rus_lower": {
                "type": "string"
              },
              "translation": {
                "properties": {
                  "language": {
                    "type": "string"
                  },
                  "meanings": {
                    "properties": {
                      "comment": {
                        "type": "string"
                      },
                      "versions": {
                        "type": "string"
                      },
                      "versions_lower": {
                        "type": "string"
                      }
                    }
                  },
                  "translatorId": {
                    "type": "string"
                  }
                }
              },
              "translations": {
                "properties": {
                  "language": {
                    "type": "string"
                  },
                  "meanings": {
                    "properties": {
                      "comment": {
                        "type": "string"
                      },
                      "versions": {
                        "type": "string"
                      },
                      "versions_lower": {
                        "type": "string"
                      }
                    }
                  },
                  "translatorId": {
                    "type": "string"
                  }
                }
              },
              "wylie": {
                "type": "string"
              }
            }
          }
        }
      }
    })
};

module.exports = script;
