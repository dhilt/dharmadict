const elasticClient = require('../db/client.js');
const ApiError = require('./../helper.js').ApiError;
const logger = require('../log/logger');
const config = require('../config.js');
const validator = require('./validators/terms.js');

const findById = termId => new Promise((resolve, reject) => {
  if (!termId) {
    return reject(new ApiError('Invalid params.'))
  }
  elasticClient.search({
    index: config.db.index,
    type: 'terms',
    body: {
      query: {
        ids: {
          values: [termId]
        }
      }
    }
  }).then(response => {
    const result = response.hits.hits[0];
    if (!result || !result._source) {
      return reject(new ApiError('No term found', 404))
    }
    result._source.id = result._id;
    return resolve(result._source)
  }, error => {
    logger.error(error.message);
    return reject(new ApiError('Database error'))
  });
});

const findTranslations = (translator, term, translations) => new Promise((resolve, reject) => {
  let translation = translations.find(t => t.translatorId === translator.id);
  if (!translation) {
    return resolve({
      termId: term.id,
      termName: term.wylie,
      translation: {
        translatorId: translator.id,
        language: translator.language,
        meanings: []
      }
    });
  }
  if (translator.id !== translation.translatorId) {
    return reject(new ApiError('Unpermitted access', 302));
  }
  logger.info('Term\'s translation was successfully found');
  return resolve({
    termId: term._id,
    termName: term.wylie,
    translation
  });
});

const searchByPattern = (pattern) => validator.search(pattern).then(pattern => {
  logger.info('Searching terms by "' + pattern + '" pattern');
  return elasticClient.search({
    index: config.db.index,
    type: 'terms',
    body: {
      query: {
        multi_match: {
          query: pattern,
          type: 'most_fields',
          operator: 'and',
          fields: ['wylie', 'sanskrit_rus_lower', 'sanskrit_eng_lower', 'translations.meanings.versions_lower']
        }
      }
    }
  }).then(response => {
    let result = [];
    response.hits.hits.forEach(hit => {
      hit._source.id = hit._id; // add id field
      result.push(hit._source);
    });
    logger.info('Found items: ' + result.length);
    return Promise.resolve(result);
  }, error => {
    logger.error('Search error:', error.message);
    throw new ApiError('Database error');
  });
});

const create = (termName, sanskrit) => validator.create(termName, sanskrit)
  .then(termInfo => {
    const id = termInfo.name.replace(/ /g, '_');
    logger.info(`Term adding: name "${termInfo.name}", id "${id}"`);
    return Promise.resolve({name: termInfo.name, sanskrit: termInfo.sanskrit, id})
  })
  .then(termInfo =>
    findById(termInfo.id).then(() => {
      throw new ApiError('Already exists')
    }, error => {
      if (error.code === 404) {
        return Promise.resolve(termInfo)
      }
      throw error
    })
  )
  .then(termInfo => {
    const payload = Object.assign(termInfo.sanskrit, {wylie: termInfo.name}, {translations: []});
    return elasticClient.index({
      index: config.db.index,
      type: 'terms',
      id: termInfo.id,
      body: payload,
      refresh: true
    }).then(() => {
      logger.info('Term was successfully created');
      return Promise.resolve(termInfo.id)
    }, error => {
      logger.error(error.message);
      throw new ApiError('Database error')
    })
  });

const update = (user, termId, translation) => validator.update(termId, translation)
  .then(() => {
    if (!user || !user.id || !user.role) {
      throw new ApiError('Incorrect authorization info')
    }
    if (!(user.role === 'translator' && translation.translatorId === user.id) && user.role !== 'admin') {
      throw new ApiError('Unpermitted access')
    }
    return findById(termId)
  })
  .then(term => {
    if (user.role === 'translator') {
      translation.language = user.language
    }
    term.translations = term.translations || [];
    user.id = user.role === 'translator' ? user.id : translation.translatorId;
    let foundT = term.translations.find(t => t.translatorId === user.id);
    let isEmpty = !(translation.meanings && translation.meanings.length);
    if (!foundT && !isEmpty) {
      term.translations.push(translation);
    } else if (foundT) {
      if (isEmpty) {
        term.translations = term.translations.filter(t => t.translatorId !== user.id);
      } else {
        foundT.meanings = translation.meanings;
      }
    }
    translation.meanings.forEach(m => m.versions_lower = m.versions.map(v => v.toLowerCase()));
    delete term.id
    return Promise.resolve(term)
  })
  .then(term =>
    elasticClient.index({
      index: config.db.index,
      type: 'terms',
      id: termId,
      body: term,
      refresh: true
    }).then(() => {
      logger.info('Term was successfully updated');
      term.id = termId;
      return Promise.resolve(term)
    }, error => {
      logger.error(error.message);
      return new ApiError('Database error')
    })
  )
  .then(term => findById(term.id))
  .then(term => findTranslations(user, term, term.translations));

const removeById = termId => new Promise(resolve => {
  if (!termId || typeof termId !== 'string') {
    throw new ApiError('Invalid id')
  }
  resolve()
})
  .then(() => findById(termId))
  .then(() =>
    elasticClient.delete({
      index: config.db.index,
      type: 'terms',
      id: termId,
      refresh: true
    }).then(() => {
      logger.info('Term was successfully deleted');
      return Promise.resolve({
        success: true
      })
    }, error => {
      logger.error(error.message);
      throw new ApiError('DB error')
    })
  );

module.exports = {
  findById,
  findTranslations,
  searchByPattern,
  create,
  update,
  removeById
};
