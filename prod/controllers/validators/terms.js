const ApiError = require('../helpers/serverHelper.js').ApiError;

const create = (name) => new Promise(resolve => {
  if (typeof name !== 'string') {
    throw new ApiError('Invalid params')
  }
  name = name.trim();
  if (!name) {
    throw new ApiError('Invalid params')
  }
  resolve(name)
});

const update = (user, termId, translation) => new Promise(resolve => {
  if (!user || !user.id) {
    throw new ApiError('Incorrect authorization info')
  }
  if (!termId) {
    throw new ApiError('Incorrect termId')
  }
  if (!translation) {
    throw new ApiError('Incorrect translation')
  }
  if (!translation.meanings) {
    throw new ApiError('Incorrect translation.meanings')
  }
  if (typeof termId !== 'string') {
    throw new ApiError('Invalid termId')
  }
  if (typeof translation !== 'object') {
    throw new ApiError('Invalid translation')
  }
  if (!Array.isArray(translation.meanings)) {
    throw new ApiError('Invalid translation.meanings')
  }
  translation.meanings.forEach(elem => {
    if (!elem.hasOwnProperty('versions')) {
      throw new ApiError('Invalid versions')
    }
    if (elem.hasOwnProperty('comment') && elem.comment !== null) {
      if ((typeof elem.comment !== 'string')) {
        throw new ApiError('Invalid comment')
      }
    }
    if (!Array.isArray(elem.versions)) {
      throw new ApiError('Invalid versions')
    }
  });
  resolve({user, termId, translation})
});

module.exports = {
  create,
  update
};