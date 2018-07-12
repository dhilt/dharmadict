const config = require('../config.js');
const { Pages } = require('./helpers/pages.js');

const translatorsWithExistedPage = [
  'DON', 'HOP', 'MM', 'RAG', 'ZAG', 'ZAG', // AK url equal AKT user id
  'TENGON', 'AK', 'AAT', 'MK', 'BEM' // AAT - this user doesnt exist
];

const script = {
  title: `Add field 'author' for all pages`,
  run: (client) =>
    client.search({
      index: config.index,
      size: config.size.max,
      type: 'pages'
    })
    .then(result => {
      const pages = result.hits.hits;
      const newPages = [];
      pages.forEach(page => {
        if (translatorsWithExistedPage.find(e => e === page['_id'])) {
          newPages.push({
            ...page['_source'],
            author: page['_id'],
            url: page['_id']
          })
        } else {
          newPages.push({
            ...page['_source'],
            author: 'ADMIN',
            url: page['_id']
          })
        }
      })
      return Promise.resolve(newPages)
    })
    .then(pages => Pages.run(client, pages))
};

module.exports = script;
