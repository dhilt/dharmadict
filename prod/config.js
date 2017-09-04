const config = {
  app: {
    port: 3000
  },
  db: {
    connection: {
      host: 'localhost:9200',
      log: 'info'
    },
    index: 'dharmadict',
  },
  token: {
    secretKey: 'supersecret',
    expiration: 60 * 60 * 24 * 31  // 1 month
  }
};

module.exports = config;