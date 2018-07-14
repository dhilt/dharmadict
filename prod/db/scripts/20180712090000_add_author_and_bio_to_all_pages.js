const config = require('../config.js');
const { Pages } = require('./helpers/pages.js');

// [pageId]: [userId]
const bioPagesMap = {
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
  title: `Add author and bio to all pages`,
  run: (client) =>
    client.indices.putMapping({
      index: config.index,
      type: "pages",
      body: {
        "properties": {
          "url": {
            "type": "keyword"
          },
          "title": {
            "type": "text"
          },
          "text": {
            "type": "text"
          },
          "author": {
            "type": "text"
          },
          "bio": {
            "type": "boolean"
          }
        }
      }
    })
    .then(() =>
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
            author: bioPagesMap[page['_id']] || 'ADMIN',
            bio: Object.keys(bioPagesMap).some(pageId => pageId === page['_id']),
            url: page['_id']
          })
        })
        return Promise.resolve(newPages)
      })
      .then(pages => Pages.run(client, pages)))
};

module.exports = script;
