const config = require('../config.js');

const script = {
  title: `Delete ${config.index} index`,
  run: (client) =>
    client.indices.delete({
      index: config.index
    }).catch(error => {
      if (error.body.status === 404) {
        return Promise.resolve({ text: 'No index found...' });
      }
      throw error;
    })
};

module.exports = script;
