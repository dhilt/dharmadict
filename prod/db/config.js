const config = {
  connection: {
    host: 'localhost:9200',
    log: 'info',
    apiVersion: '5.5'
  },
  index: 'dharmadict',
  size: {
    max: 10000,
    searchTerms: 30
  }
};

module.exports = config;
