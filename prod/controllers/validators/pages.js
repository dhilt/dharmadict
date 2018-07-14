const ApiError = require('../../helper').ApiError;

const update = (pageUrl, payload) => new Promise(resolve => {
  if (!pageUrl) {
    throw new ApiError('Incorrect query, no url')
  }
  if (!payload || typeof payload !== 'object') {
    throw new ApiError('Invalid payload')
  }
  if (!payload.hasOwnProperty('title')) {
    throw new ApiError('No title')
  }
  if (!payload.hasOwnProperty('text')) {
    throw new ApiError('No text')
  }
  if (!payload.hasOwnProperty('bio')) {
    throw new ApiError('No bio')
  }
  if (typeof payload.title !== 'string') {
    throw new ApiError('Invalid title')
  }
  if (typeof payload.text !== 'string') {
    throw new ApiError('Invalid text')
  }
  if (typeof payload.bio !== 'boolean') {
    throw new ApiError('Invalid bio')
  }
  resolve({pageUrl, payload})
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
  if (!payload.hasOwnProperty('bio')) {
    throw new ApiError('No bio')
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
  if (typeof payload.bio !== 'boolean') {
    throw new ApiError('Invalid bio')
  }
  resolve(payload)
});

module.exports = {
  create,
  update
};
