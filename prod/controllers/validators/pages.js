const ApiError = require('../../helper').ApiError;

const update = (payload) => new Promise(resolve => {
  if (!payload || typeof payload !== 'object') {
    throw new ApiError('Invalid payload')
  }
  if (!payload.hasOwnProperty('title')) {
    throw new ApiError('No title')
  }
  if (!payload.hasOwnProperty('text')) {
    throw new ApiError('No text')
  }
  if (typeof payload.title !== 'string') {
    throw new ApiError('Invalid title')
  }
  if (typeof payload.text !== 'string') {
    throw new ApiError('Invalid text')
  }
  resolve(payload)
});

const create = (payload) => new Promise(resolve => {
  if (!payload || typeof payload !== 'object') {
    throw new ApiError('Invalid payload')
  }
  if (!payload.hasOwnProperty('url')) {
    throw new ApiError('No url')
  }
  if (!payload.hasOwnProperty('title')) {
    throw new ApiError('No title')
  }
  if (!payload.hasOwnProperty('text')) {
    throw new ApiError('No text')
  }
  if (typeof payload.url !== 'string') {
    throw new ApiError('Invalid url')
  }
  if (payload.url.indexOf('/') !== -1) {
    throw new ApiError(`Url can't contain next symbol: "/"`)
  }
  if (typeof payload.title !== 'string') {
    throw new ApiError('Invalid title')
  }
  if (typeof payload.text !== 'string') {
    throw new ApiError('Invalid text')
  }
  resolve(payload)
});

module.exports = {
  create,
  update
};
