const ApiError = require('../../helper.js').ApiError;
const languages = require('../../helper').languages;

const create = (user) => new Promise(resolve => {
  if (!user) {
    throw new ApiError('Invalid data')
  }
  if (!user.id) {
    throw new ApiError('Invalid id')
  }
  if (!user.role) {
    throw new ApiError('Invalid role')
  }
  if (!user.login) {
    throw new ApiError('Invalid login')
  }
  if (!user.name) {
    throw new ApiError('Invalid name')
  }
  if (!user.password) {
    throw new ApiError('Invalid password')
  }
  if (!user.description) {
    throw new ApiError('Invalid description')
  }
  resolve(user)
});

const update = (userId, payload) => new Promise(resolve => {
  if (!userId || typeof userId !== 'string') {
    throw new ApiError('Invalid id')
  }
  if (!payload || typeof payload !== 'object') {
    throw new ApiError('Invalid payload')
  }
  if (payload.hasOwnProperty('name')) {
    if (typeof payload.name !== 'string') {
      throw new ApiError('Invalid name')
    }
    payload.name = payload.name.trim();
    if(!payload.name) {
      throw new ApiError('Invalid name')
    }
  }
  else {
    throw new ApiError('Invalid name')
  }
  if (payload.hasOwnProperty('language')) {
    if (payload.language !== languages.getLang(payload.language).id) {
      throw new ApiError('Invalid language')
    }
  }
  else {
    throw new ApiError('Invalid language')
  }
  if (payload.hasOwnProperty('description')) {
    if (typeof payload.description !== 'string') {
      throw new ApiError('Invalid description')
    }
    payload.description = payload.description.trim();
  }
  if (payload.hasOwnProperty('password') && payload.hasOwnProperty('confirmPassword')) {
    if (typeof payload.password !== 'string') {
      throw new ApiError('Invalid password')
    }
    if (typeof payload.confirmPassword !== 'string') {
      throw new ApiError('Invalid confirm password')
    }
    if (payload.password !== payload.confirmPassword) {
      throw new ApiError('Password not confirmed')
    }
  }
  resolve(userId, payload)
});

module.exports = {
  create,
  update
};
