const assert = require('assert');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');

process.env.NODE_ENV = 'test';

const server = require('../prod/server.js');
const usersController = require('../prod/controllers/users.js');

chai.use(chaiHttp);
const request = chai.request(server);

const testAdmin = {
  "id": "TEST-ADMIN",
  "role": "admin",
  "login": "test-admin",
  "name": "Test Admin",
  "description": "...",
  "password": "test-admin-pass"
};

const forceCleanUp = () => {
  describe('Force cleanup', () => {
    it('may delete test user', (done) => {
      usersController.removeById(testAdmin.id)
        .then(() => {
          console.log('Test user was successfully deleted');
          setTimeout(() => done(), 1500);
        })
        .catch(() => done())
    });
  });
};

forceCleanUp();

module.exports = {
  request,
  testAdmin
};