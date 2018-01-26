const ApiError = require('../../helper').ApiError;

const update = (payload) => new Promise(resolve => {
  if (!payload || typeof payload !== 'object') {
    throw new ApiError('Invalid payload')
  }
  if(!payload.hasOwnProperty('title')) {
    throw new ApiError('No title')
  }
  if (!payload.hasOwnProperty('text')) {
    throw new ApiError('No text')
  }
  resolve(payload)
});

module.exports = {
  update
};