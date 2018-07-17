const config = require('../../config.js');
const { Process } = require('./process.js');

class Pages {
  static run(client, pages) {
    return new Promise((resolve, reject) => {
      const process = new Process(resolve, reject, pages.length, 'pages');
      pages.forEach(page =>
        client.index({
          index: config.index,
          type: 'pages',
          id: page.url,
          body: {
            title: page.title,
            text: page.text,
            author: page.hasOwnProperty('author') ? page.author : 'ADMIN',
            bio: page.hasOwnProperty('bio') ? page.bio : false
          }
        })
        .then(() => process.done(), error => process.done(error || true))
      );
    });
  }
}

module.exports = {
  Pages
};
