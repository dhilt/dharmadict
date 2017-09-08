const fs = require('fs');
const config = require('../config.js');
const parse = require('csv-parse');

const list = [{
  id: 'MK',
  file: 'MK.csv',
  lang: 'rus'
}, {
  id: 'AKT',
  file: 'AKT.csv',
  lang: 'rus'
}, {
  id: 'ZAG',
  file: 'ZAG.csv',
  lang: 'rus'
}, {
  id: 'DON',
  file: 'DON.csv',
  lang: 'rus'
}, {
  id: 'HOP',
  file: 'HOP.csv',
  lang: 'eng'
}, {
  id: 'BRZ',
  file: 'BRZ.csv',
  lang: 'eng'
}];

const processListItem = (client, listItem) => {
  const inputStream = fs.createReadStream(__dirname + '/../data/' + listItem.file);
  const parser = parse({columns: true, delimiter: ','});

  let authorId = 'DON';
  let lang = 'rus';

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
        script: "if (ctx._source.containsKey('translations')) {def idx = ctx._source.translations.findIndexOf {t -> t.translatorId == authorId}; if (idx == -1) ctx._source.translations += translation; else ctx._source.translations[idx] = translation;} else {ctx._source.translations = [translation]}",
        upsert: term,
        params: {
          translation: term.translation,
          authorId: term.translation.translatorId
        }
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