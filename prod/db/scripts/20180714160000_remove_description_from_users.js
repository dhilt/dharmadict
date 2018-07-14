const config = require('../config.js');
const tempIndex = "temp";

const script = {
  title: `Remove description from users`,
  run: (client) =>
    // client.indices.delete({
    //   index: tempIndex
    // })
    client.indices.create({
      index: tempIndex,
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
    .then(() =>
      client.reindex({
        refresh: true,
        body: {
          "source": {
            "index": "dharmadict",
            "type": ["pages", "terms"]
          },
          "dest": {
            "index": tempIndex
          }
        }
      })
    )
    .then(() =>
      client.search({
        index: config.index,
        size: config.size.max,
        type: 'users'
      })
    )
    .then(result => {
      const users = result.hits.hits.map(e => {
        let user = e['_source'];
        delete user.description
        return user
      })
      return Promise.resolve(users)
    })
    .then(users => {
      users.forEach(user =>
        client.index({
          refresh: true,
          index: tempIndex,
          type: 'users',
          id: user.id,
          body: user
        })
      )
      return Promise.resolve()
    })
    .then(() =>
      client.indices.delete({
        index: config.index
      })
    )
    .then(() =>
      client.reindex({
        refresh: true,
        body: {
          "source": {
            "index": tempIndex,
            "type": ["pages", "terms", "users"]
          },
          "dest": {
            "index": config.index
          }
        }
      })
    )
};

module.exports = script;
