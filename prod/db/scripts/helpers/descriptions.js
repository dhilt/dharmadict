const config = require('../../config.js');
const { Process } = require('./process.js');

class Descriptions {
  static run(client, users) {
    return new Promise((resolve, reject) => {
      const process = new Process(resolve, reject, users.length, 'descriptions');
      users.forEach(user =>
        client.update({
          index: config.index,
          type: 'users',
          id: user.id,
          body: { doc: user.body }
        })
        .then(() => process.done(), error => process.done(error || true))
      );
    });
  }
}

module.exports = {
  Descriptions
};
