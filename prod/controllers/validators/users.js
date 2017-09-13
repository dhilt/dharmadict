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

const updateDescription = (data) => new Promise(resolve => {
  if (!data || (typeof data !== 'object')) {
    throw new ApiError('Invalid data')
  }
  if (!data.id || typeof data.id !== 'string') {
    throw new ApiError('Invalid id')
  }
  if (!data.description || typeof data.description !== 'string') {
    throw new ApiError('Invalid description')
  }
  resolve(data)
});

module.exports = {
  create,
  updateDescription
};
