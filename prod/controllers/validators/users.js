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

const updateDescription = (userDescription) => new Promise(resolve => {
  if (!userDescription || (typeof userDescription !== 'object')) {
    throw new ApiError('Invalid data')
  }
  if (!userDescription.id) {
    throw new ApiError('No id')
  }
  if (!userDescription.description) {
    throw new ApiError('No description')
  }
  if (typeof userDescription.id !== 'string') {
    throw new ApiError('Invalid id')
  }
  if (typeof userDescription.description !== 'string') {
    throw new ApiError('Invalid description')
  }
  resolve(userDescription)
});

module.exports = {
  create,
  updateDescription
};
