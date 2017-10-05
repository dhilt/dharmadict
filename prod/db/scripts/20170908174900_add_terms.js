const fs = require('fs');
const config = require('../config.js');
const parse = require('csv-parse');

const inputStream = fs.createReadStream(__dirname + '/../data/Terms.csv');
const parser = parse({columns: true, delimiter: ','});

const bulkObject = {
  body: []
};

const addTerm = (term) => {
  if (term != null) {
    bulkObject.body.push({
      update: {
        _index: config.index,
        _type: 'terms',
        _id: term.wylie.split(' ').join('_')
      }
    });
    bulkObject.body.push({
      doc: term,
      doc_as_upsert: true
    });
  }
};

const readParser = () => {
  let record, results = [];
  while ((record = parser.read()) != null) {
    if (record.wylie == null) {
      continue;
    }
    results.push(addTerm({
      wylie: record.wylie.toLowerCase(),
      sanskrit_ru: record.sanskrit_ru,
      sanskrit_ru_lower: record.sanskrit_ru.toLowerCase(),
      sanskrit_en: record.sanskrit_en,
      sanskrit_en_lower: record.sanskrit_en.toLowerCase()
    }));
  }
};

const script = {
  title: `Add terms`,
  run: (client) => new Promise((resolve, reject) => {

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
  })
};

module.exports = script;