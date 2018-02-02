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
                "type": "text"
              },
              "role": {
                "type": "keyword"
              },
              "login": {
                "type": "keyword"
              },
              "hash": {
                "type": "keyword"
              },
              "description": {
                "type": "text"
              }
            }
          },
          "terms": {
            "properties": {
              "sanskrit_en": {
                "type": "text"
              },
              "sanskrit_en_lower": {
                "type": "text"
              },
              "sanskrit_ru": {
                "type": "text"
              },
              "sanskrit_ru_lower": {
                "type": "text"
              },
              "translation": {
                "properties": {
                  "language": {
                    "type": "keyword"
                  },
                  "meanings": {
                    "properties": {
                      "comment": {
                        "type": "text"
                      },
                      "versions": {
                        "type": "text"
                      },
                      "versions_lower": {
                        "type": "text"
                      }
                    }
                  },
                  "translatorId": {
                    "type": "keyword"
                  }
                }
              },
              "translations": {
                "properties": {
                  "language": {
                    "type": "keyword"
                  },
                  "meanings": {
                    "properties": {
                      "comment": {
                        "type": "text"
                      },
                      "versions": {
                        "type": "text"
                      },
                      "versions_lower": {
                        "type": "text"
                      }
                    }
                  },
                  "translatorId": {
                    "type": "keyword"
                  }
                }
              },
              "wylie": {
                "type": "text"
              }
            }
          },
          "pages": {
            "properties": {
              "url": {
                "type": "keyword"
              },
              "title": {
                "type": "text"
              },
              "text": {
                "type": "text"
              }
            }
          }
        }
      }
    })
};

module.exports = script;
