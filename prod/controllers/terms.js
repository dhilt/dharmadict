const elasticClient = require('./helpers/db.js');
const logger = require('../log/logger');
const config = require('../config.js');

const findById = termId => new Promise((resolve, reject) => {
  return elasticClient.search({
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
      return reject('No term found')
    }
    result._source.id = result._id;
    return resolve(result._source)
  }, error => {
    logger.error(error.message);
    return reject('Database error')
  });
});

const findTranslations = (translator, term, translations) => new Promise((resolve, reject) => {
  let translation = translations.find(t => t.translatorId === translator.id);
  if (!translation) {
    return reject({
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
    return reject('Unpermitted access');
  }
  logger.info('Term\'s translation was successfully found');
  return resolve({
    termId: term._id,
    termName: term.wylie,
    translation
  });
});

const searchByPattern = (pattern) => new Promise((resolve, reject) => {
  logger.info('Searching terms by "' + pattern + '" pattern');
  elasticClient.search({
    index: config.db.index,
    type: 'terms',
    body: {
      query: {
        multi_match: {
          query: pattern,
          type: 'most_fields',
          operator: 'and',
          fields: ['wylie', 'sanskrit_rus_lower', 'sanskrit_eng_lower', 'translation.meanings.versions_lower']
        }
      }
    }
  }).then(response => {
    let result = [];
    response.hits.hits.forEach((hit) => {
      hit._source.id = hit._id; // add id field
      result.push(hit._source);
    });
    logger.info('Found items: ' + result.length);
    return resolve(result);
  }, error => {
    logger.error('Search error:', error.message);
    return reject(error);
  })
})

module.exports = {
  findById,
  findTranslations,
  searchByPattern
};
