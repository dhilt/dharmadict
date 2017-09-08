const config = {
  connection: {
    host: 'localhost:9200',
    log: 'info',
    //apiVersion: '5.5'
    apiVersion: '1.7'
  },
  index: 'dharmadict',
};

module.exports = config;