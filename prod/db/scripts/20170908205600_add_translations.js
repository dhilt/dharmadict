const fs = require('fs');
const config = require('../config.js');
const parse = require('csv-parse');

const list = [{
  id: 'MK',
  file: 'MK.csv',
  lang: 'ru'
}, {
  id: 'AKT',
  file: 'AKT.csv',
  lang: 'ru'
}, {
  id: 'ZAG',
  file: 'ZAG.csv',
  lang: 'ru'
}, {
  id: 'DON',
  file: 'DON.csv',
  lang: 'ru'
}, {
  id: 'HOP',
  file: 'HOP.csv',
  lang: 'en'
}, {
  id: 'BRZ',
  file: 'BRZ.csv',
  lang: 'en'
}, {
  id: 'MM',
  file: 'MM.csv',
  lang: 'ru'
}, {
  id: 'RAG',
  file: 'RAG.csv',
  lang: 'ru'
}];

const processListItem = (client, listItem) => {
  const inputStream = fs.createReadStream(__dirname + '/../data/' + listItem.file);
  const parser = parse({columns: true, delimiter: ','});

  let lang = 'ru';

  const bulkObject = {
    body: []
  };

  const updateTerm = (term) => {
    if (term != null) {
      bulkObject.body.push({
        update: {
          _index: config.index,
          _type: 'terms',
          _id: term.wylie.split(' ').join('_')
        }
      });
      bulkObject.body.push({
        script: {
          inline: "if(!ctx._source.containsKey('translations')) { ctx._source.translations = [params.translation]} else { int idx = -1; for(int i = 0; i < ctx._source.translations.length; ++i) { if(ctx._source.translations[i].translatorId == params.authorId) { idx = i; break; } } if(idx == -1) { ctx._source.translations.add(params.translation); } else { ctx._source.translations[idx] = params.translation; } }",
          params: {
            translation: term.translation,
            authorId: term.translation.translatorId
          },
          "lang": "painless"
        },
        upsert: term
      });
    }
  };

  const readParser = () => {
    let record;
    while ((record = parser.read()) != null) {
      if (record.wylie == null) {
        continue;
      }
      if (!!record.translations) {
        let comments = record.comment ? record.comment.split('+') : [];
        let meanings = [];
        record.translations.split('+').map((val, i) => {
          let versions = val.split(';').map(v => v.trim());
          meanings.push({
            versions: versions,
            versions_lower: versions.map(v => v.toLowerCase()),
            comment: comments.length > i ? comments[i].trim() : ''
          })
        });
        updateTerm({
          wylie: record.wylie.toLowerCase(),
          translation: {
            translatorId: listItem.id,
            language: lang,
            meanings: meanings
          }
        });
      }
    }
  };

  return new Promise((resolve, reject) => {
    parser.on('readable', readParser);

    parser.on('finish', () => {
      client.bulk(bulkObject, err => {
        if (err) {
          reject(err);
        }
        resolve({text: 'really'});
      });
    });

    parser.on('error', (err) => {
      reject(err);
    });

    inputStream.pipe(parser);
  });
};

const script = {
  title: `Add translations`,
  run: (client) => new Promise((resolve, reject) => {

    let count = 0, countErrors = 0;
    const _done = () => {
      if (countErrors) {
        reject('ERROR');
      }
      else {
        resolve({text: 'really'});
      }
    };

    list.forEach((item, i) => {
      item.run = () =>
        processListItem(client, item).then(() => {
          count++;
          console.log(item.file + ' was processed successfully');
          if (i < list.length - 1) {
            list[i + 1].run();
          }
          else {
            _done();
          }
        }, error => {
          countErrors++;
          console.log(item.file + ' processing failed!');
          console.log(error);
          if (i < list.length - 1) {
            list[i + 1].run();
          }
          else {
            _done();
          }
        })
    });

    list[0].run();
  })
};

module.exports = script;
