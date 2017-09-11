const assert = require('assert');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');

process.env.NODE_ENV = 'test';

const server = require('../prod/server.js');
const usersController = require('../prod/controllers/users.js');
const termsController = require('../prod/controllers/terms.js');

chai.use(chaiHttp);
const request = chai.request(server);

const testAdmin = {
  id: "TEST-ADMIN",
  role: "admin",
  login: "test-admin",
  name: "Test Admin",
  description: "...",
  password: "test-admin-pass"
};

const testTranslator = {
  id: "TEST-TRANSLATOR",
  role: "translator",
  login: "test-translator",
  name: "Test Translator",
  description: "...",
  password: "test-translator-pass"
};

const testTerm = {
  name: 'test term',
  id: 'test_term'
};

const testTermTranslation = {
  termId: testTerm.id,
  translation: {
    meanings: [
      {versions: ["a1", "b1", "c1"], comment: "comment1"},
      {versions: ["a2", "b2", "c2"], comment: null}],
    translatorId: testTranslator.id
  }
};

const forceCleanUp = () => {
  describe('Force cleanup', () => {
    it('may delete test data', (done) => {
      let ready = 0;
      const _done = () => {
        if (++ready === 3) {
          done();
        }
      };

      usersController.removeById(testAdmin.id)
        .then(() => {
          console.log('Test admin user was successfully deleted');
          _done();
        })
        .catch(_done);

      usersController.removeById(testTranslator.id)
        .then(() => {
          console.log('Test translator user was successfully deleted');
          _done();
        })
        .catch(_done);

      termsController.removeById(testTerm.id)
        .then(() => {
          console.log('Test term user was successfully deleted');
          _done();
        })
        .catch(_done);
    });
  });
};

forceCleanUp();

const shouldLogIn = (user) => {
  it('should log in', (done) => {
    request.post('/api/login').send({
      login: user.login,
      password: user.password
    }).end(
      (err, res) => {
        user.token = res.body.token;
        assert.notEqual(res.body.success, true);
        assert.equal(res.body.user.login, user.login);
        done();
      }
    )
  });
};

module.exports = {
  request,
  testAdmin,
  testTranslator,
  testTerm,
  testTermTranslation,
  shouldLogIn
};
