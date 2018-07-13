const config = require('../config.js');
const { Pages } = require('./helpers/pages.js');

// [pageId]: [userId]
const pagesMap = {
  'TENGON': 'TENGON',
  'ZAG': 'ZAG',
  'MM': 'MM',
  'AK': 'AKT',
  'AKT': 'AKT',
  'RAG': 'RAG',
  'BEM': 'BEM',
  'HOP': 'HOP',
  'AAT': 'AKT',
  'MK': 'MK',
  'DON': 'DON',
}

const script = {
  title: `Add author to all pages`,
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
        newPages.push({
          ...page['_source'],
          author: pagesMap[page['_id']] || 'ADMIN',
          url: page['_id']
        })
      })
      return Promise.resolve(newPages)
    })
    .then(pages => Pages.run(client, pages))
};

module.exports = script;
