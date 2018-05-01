const config = require('../../config.js');
const { Process } = require('./process.js');

class Users {
  static run(client, users) {
    return new Promise((resolve, reject) => {
      const process = new Process(resolve, reject, users.length, 'users');
      users.forEach(user =>
        client.index({
          index: config.index,
          type: 'users',
          id: user.id,
          body: user.body
        })
        .then(() => process.done(), error => process.done(error || true))
      );
    });
  }
}

module.exports = {
  Users
};
