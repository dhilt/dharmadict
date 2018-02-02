const config = require('../config.js');
const {Process} = require('./helpers.js');

const users = [
  {id: 'AKT', body: {description: '/pages/AK'}},
  {id: 'DON', body: {description: '/pages/DON'}},
  {id: 'HOP', body: {description: '/pages/HOP'}},
  {id: 'MM', body: {description: '/pages/MM'}},
  {id: 'RAG', body: {description: '/pages/RAG'}}
];

const script = {
  title: `Add users descriptions`,
  run: (client) => new Promise((resolve, reject) => {
    const process = new Process(resolve, reject, users.length);
    users.forEach(user =>
      client.index({
        index: config.index,
        type: 'users',
        id: user.id,
        body: user.body
      })
      .then(() => process.done(), error => process.done(error || true))
    );
  })
};

module.exports = script;