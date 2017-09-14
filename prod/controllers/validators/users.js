const ApiError = require('../../helper.js').ApiError;

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
  if (!payload || (typeof payload !== 'object')) {
    throw new ApiError('Invalid payload')
  }
  if (payload.hasOwnProperty('description')) {
    if (typeof payload.description !== 'string') {
      throw new ApiError('Invalid description')
    }
    payload.description = payload.description.trim();
  }
  resolve(userId, payload)
});

module.exports = {
  create,
  update
};
