const elasticsearch = require('elasticsearch');
const config = require('../../config.js');

let elasticClient = new elasticsearch.Client(config.db.connection);

let patchMethod = (func) => {
  const dbFunc = func;
  return function () {
    // old syntax (callback last argument)
    if (typeof arguments[arguments.length - 1] === 'function') {
      dbFunc.apply(this, arguments);
      return
    }
    // new promise syntax
    return new Promise((resolve, reject) => {
      const cb = (error, result) => {
        if (error) {
          reject(error)
        }
        else {
          resolve(result)
        }
      };
      const newArgs = [...arguments, cb];
      dbFunc.apply(this, newArgs)
    })
  }
};

// patch elasticClient methods. Make it promise-based if no callback passed
elasticClient.search = patchMethod(elasticClient.search);
elasticClient.index = patchMethod(elasticClient.index);
elasticClient.delete = patchMethod(elasticClient.delete);

module.exports = elasticClient;
