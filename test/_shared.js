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

const testTranslator = {
  "id": "TEST-TRANSLATOR",
  "role": "translator",
  "login": "test-translator",
  "name": "Test Translator",
  "description": "...",
  "password": "test-translator-pass"
};

const forceCleanUp = () => {
  describe('Force cleanup', () => {
    it('may delete test user', (done) => {

      let ready = 0;
      const _done = (index) => {
        if(ready) {
          done();
        }
        ready = index;
      };

      usersController.removeById(testAdmin.id)
        .then(() => {
          console.log('Test admin user was successfully deleted');
          setTimeout(() => _done(1), 1000);
        })
        .catch(() => _done(1));

      usersController.removeById(testTranslator.id)
        .then(() => {
          console.log('Test translator user was successfully deleted');
          setTimeout(() => _done(2), 1000);
        })
        .catch(() => _done(2));
    });
  });
};

forceCleanUp();

const shouldLogIn = () => {
  it('should log in', (done) => {
    request.post('/api/login').send({
      login: testAdmin.login,
      password: testAdmin.password
    }).end(
      (err, res) => {
        let { user, token } = res.body;
        testAdmin.token = token;
        assert.notEqual(res.body.success, true);
        assert.equal(user.login, testAdmin.login);
        done();
      }
    )
  });
};

module.exports = {
  request,
  testAdmin,
  testTranslator,
  shouldLogIn
};