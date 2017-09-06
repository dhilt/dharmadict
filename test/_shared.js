const assert = require('assert');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');

process.env.NODE_ENV = 'test';
const server = require('../prod/server.js');

chai.use(chaiHttp);
const request = chai.request(server);

module.exports = {
  request,
  assert
};