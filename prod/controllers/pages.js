const elasticClient = require('../db/client');
const validator = require('./validators/pages.js');
const ApiError = require('./../helper').ApiError;
const logger = require('../log/logger');
const config = require('../config');

const findAll = () => new Promise((resolve, reject) => {
  elasticClient.search({
    index: config.db.index,
    type: 'pages'
  }).then(result => {
    const pages = result.hits.hits;
    if (!pages.length) {
      throw new ApiError(`No pages found`, 404)
    }
    resolve(pages.map(page => page._id))
  }, error => {
    logger.error(error.message);
    throw new ApiError('Database error')
  });
});

const findByUrl = pageUrl => new Promise((resolve, reject) => {
  logger.info(`Find page by url ${pageUrl}`);
  if (!pageUrl || typeof pageUrl !== 'string') {
    return reject(new ApiError('Invalid url'))
  }
  elasticClient.search({
    index: config.db.index,
    type: 'pages',
    body: {
      query: {
        ids: {
          values: [pageUrl]
        }
      }
    }
  }).then(response => {
      const result = response.hits.hits[0];
      if (!result || !result._source) {
        return reject(new ApiError('No page found', 404))
      }
      result._source.url = result._id;
      resolve(result._source)
    },
    error => {
      logger.error(error);
      reject(new ApiError('Database error'))
    })
});

const update = (pageUrl, payload) => validator.update(payload)
  .then(() => findByUrl(pageUrl))
  .then(page => {
    let result = Object.assign({}, page, payload);
    delete result.url;
    return result
  })
  .then(body =>
    elasticClient.index({
      index: config.db.index,
      type: 'pages',
      id: pageUrl,
      body,
      refresh: true
    }).then(() => {
      logger.info('Page was successfully updated');
      return pageUrl
    }, error => {
      logger.error(error.message);
      throw new ApiError('DB error')
    })
  )
  .then(findByUrl);

const removeByUrl = pageUrl => findByUrl(pageUrl)
  .then(page =>
    elasticClient.delete({
      index: config.db.index,
      type: 'pages',
      id: page.url,
      refresh: true
    }).then(() =>
      logger.info(`Page "${page.url}" was successfully deleted`)
    , error => {
      logger.error(error.message);
      throw new ApiError('DB error')
    })
  );

module.exports = {
  removeByUrl,
  findByUrl,
  findAll,
  update
};
