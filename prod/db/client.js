const elasticsearch = require('elasticsearch');
const config = require('./config.js');

const elasticClient = new elasticsearch.Client(config.connection);

module.exports = elasticClient;