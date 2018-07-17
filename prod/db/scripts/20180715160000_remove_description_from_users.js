const config = require('../config.js');

const tempIndex = "temp";
const newMapping = {
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
  }
};
let endResult = {
  before: null,
  after: null
};

const script = {
  title: `Remove description from users`,
  run: (client) =>
    client.indices.create({
      index: tempIndex,
      body: newMapping
    })
    .then(() =>
      client.reindex({
        refresh: true,
        body: {
          "source": {
            "index": config.index,
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
      console.log(`Before migration, Index "${config.index}" contains ${result.hits.hits.length} users`);
      endResult.before = result.hits.hits.length;
      const users = result.hits.hits.map(e => {
        const id = e['_id'];
        let user = e['_source'];
        delete user.description
        return {
          id: id,
          body: user
        }
      })
      return Promise.resolve(users)
    })
    .then(users => {
      let result = Promise.resolve();
      users.forEach(user =>
        result = client.index({
          refresh: true,
          index: tempIndex,
          type: 'users',
          id: user.id,
          body: user.body
        })
      )
      return result
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
    .then(() =>
      client.indices.delete({
        index: tempIndex
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
      console.log(`After migration, Index "${config.index}" contains ${result.hits.hits.length} users`);
      endResult.after = result.hits.hits.length;
      if (endResult.before !== endResult.after) {
        throw new Error('Wrong data length!')
      }
    })
};

module.exports = script;
