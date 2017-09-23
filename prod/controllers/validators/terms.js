const ApiError = require('../../helper.js').ApiError;

const create = (wylie, sanskrit) => new Promise(resolve => {
  if (typeof wylie !== 'string') {
    throw new ApiError('Invalid params')
  }
  wylie = wylie.trim();
  if (!wylie) {
    throw new ApiError('Invalid params')
  }
  if (typeof sanskrit !== 'object') {
    throw new ApiError('Invalid sanskrit')
  }
  Object.keys(sanskrit).forEach(key => {
    if (typeof sanskrit[key] !== 'string') {
      throw new ApiError('Invalid ' + sanskrit[key])
    }
    sanskrit[key].trim();
    sanskrit[key + '_lower'] = sanskrit[key].toLowerCase();
  });
  resolve({wylie, sanskrit})
});

const search = (pattern) => new Promise(resolve => {
  if (!pattern) {
    throw new ApiError('Invalid pattern')
  }
  resolve(pattern)
})

const update = (termId, translation) => new Promise(resolve => {
  if (!termId || typeof termId !== 'string') {
    throw new ApiError('Incorrect termId')
  }
  if (!translation) {
    throw new ApiError('Incorrect translation')
  }
  if (!translation.meanings) {
    throw new ApiError('Incorrect translation.meanings')
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
  resolve({termId, translation})
});

module.exports = {
  create,
  update,
  search
};
