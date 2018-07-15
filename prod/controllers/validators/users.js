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
  if (payload.hasOwnProperty('language')) {
    if (payload.language !== languages.getLang(payload.language).id) {
      throw new ApiError('Invalid language')
    }
  }

  if (payload.hasOwnProperty('password')) {
    if(!payload.hasOwnProperty('confirmPassword')) {
      throw new ApiError('No password confirmation')
    }
    if (typeof payload.password !== 'string') {
      throw new ApiError('Invalid password')
    }
    if (typeof payload.confirmPassword !== 'string') {
      throw new ApiError('Invalid password confirmation')
    }
    if (payload.password.length < 6) {
      throw new ApiError('Password is too short')
    }
    if (payload.password !== payload.confirmPassword) {
      throw new ApiError('Password not confirmed')
    }
  }
  resolve(userId, payload)
});

const updatePassword = (payload) => new Promise(resolve => {
  if (!payload || typeof payload !== 'object') {
    throw new ApiError('Invalid payload')
  }
  if(!payload.hasOwnProperty('currentPassword')) {
    throw new ApiError('No current password')
  }
  if (!payload.hasOwnProperty('newPassword')) {
    throw new ApiError('No new password')
  }
  if(!payload.hasOwnProperty('confirmPassword')) {
    throw new ApiError('No password confirmation')
  }
  if (typeof payload.currentPassword !== 'string') {
    throw new ApiError('Invalid current password')
  }
  if (typeof payload.newPassword !== 'string') {
    throw new ApiError('Invalid new password')
  }
  if (typeof payload.confirmPassword !== 'string') {
    throw new ApiError('Invalid password confirmation')
  }
  if (payload.newPassword.length < 6) {
    throw new ApiError('Password is too short')
  }
  if (payload.newPassword !== payload.confirmPassword) {
    throw new ApiError('Password is not confirmed')
  }
  resolve(payload)
});

module.exports = {
  create,
  update,
  updatePassword
};
