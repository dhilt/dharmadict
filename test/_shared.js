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
  language: "eng",
  description: "...",
  password: "test-translator-pass"
};

const testTranslator2 = {
  id: "TEST-TRANSLATOR-2",
  role: "translator",
  login: "test-translator-2",
  name: "Test Translator 2",
  language: "rus",
  description: "...",
  password: "test-translator-pass-2"
};

const testTerm = {
  name: 'test term',
  id: 'test_term',
  sanskrit: {
    sanskrit_rus: 'Sanskrit of test term, RUSSIAN',
    sanskrit_eng: 'Sanskrit of test term, ENGLISH'
  }
};

const testTerm2 = {
  name: 'test term two',
  id: 'test_term_two',
  sanskrit: {
    sanskrit_rus: 'Sanskrit of test term two, RUSSIAN',
    sanskrit_eng: 'Sanskrit of test term two, ENGLISH'
  }
};

const testTermTranslation = {
  termId: testTerm.id,
  translation: {
    translatorId: testTranslator.id,
    meanings: [
      {
        versions: [
          "Translation test term (1)",
          "Translation test term (2)",
          "Translation test term (3)"
        ],
        comment: "comment about test term"
      },
      {
        versions: [
          "Translation test term (4)",
          "Translation test term (5)",
          "Translation test term (6)"
        ],
        comment: null
      }
    ]
  }
};

const testTermTranslation2 = {
  termId: testTerm2.id,
  translation: {
    translatorId: testTranslator.id,
    meanings: [
      {
        versions: [
          "Translation test term 2 (1)",
          "Translation test term 2 (2)",
          "Translation test term 2 (3)"
        ],
        comment: "comment about test term 2"
      },
      {
        versions: [
          "Translation test term 2 (4)",
          "Translation test term 2 (5)",
          "Translation test term 2 (6)"
        ],
        comment: null
      }
    ]
  }
};

const languages = [
  {
    id: 'rus',
    name: 'русский',
    name_rus: 'русский',
    name_eng: 'russian',
    default: true
  },
  {
    id: 'eng',
    name: 'english',
    name_rus: 'английский',
    name_eng: 'english'
  }
];

const forceCleanUp = () => {
  describe('Force cleanup', () => {
    it('may delete test data', (done) => {
      let ready = 0;
      const _done = () => {
        if (++ready === 4) {
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

      usersController.removeById(testTranslator2.id)
        .then(() => {
          console.log('Test translator-2 user was successfully deleted');
          _done();
        })
        .catch(_done);

      termsController.removeById(testTerm.id)
        .then(() => {
          console.log('Test term was successfully deleted');
          _done();
        })
        .catch(_done);

      termsController.removeById(testTerm2.id)
        .then(() => {
          console.log('Test term 2 was successfully deleted');
          _done();
        })
        .catch(_done);
    });
  });
};

forceCleanUp();

const shouldLogIn = (user) => {
  it(`should log in as ${user.login}`, (done) => {
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
  testTranslator2,
  testTerm,
  testTerm2,
  testTermTranslation,
  testTermTranslation2,
  shouldLogIn,
  languages
};
