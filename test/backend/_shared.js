const assert = require('assert');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');

process.env.NODE_ENV = 'test';

const server = require('../../prod/server.js');
const usersController = require('../../prod/controllers/users.js');
const termsController = require('../../prod/controllers/terms.js');
const pagesController = require('../../prod/controllers/pages.js');
const languages = require('../../prod/helper').languages;

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
  language: "en",
  description: "...",
  password: "test-translator-pass"
};

const testTranslator2 = {
  id: "TEST-TRANSLATOR-2",
  role: "translator",
  login: "test-translator-2",
  name: "Тестовый переводчик 2",
  language: "ru",
  description: "...",
  password: "test-translator-pass-2"
};

const testTerm = {
  name: 'test term',
  id: 'test_term',
  sanskrit: {
    sanskrit_ru: 'Термин на санскрите, RUSSIAN',
    sanskrit_en: 'Sanskrit of test term, ENGLISH'
  }
};

const testTerm2 = {
  name: 'test term two',
  id: 'test_term_two',
  sanskrit: {
    sanskrit_ru: 'Термин 2 на санскрите, RUSSIAN',
    sanskrit_en: 'Sanskrit of test term 2, ENGLISH'
  }
};

const testPage = {
  // author: testAdmin.id, /* This is set in database through createPageSpec.js */
  url: 'test_page_url',
  title: 'test page title',
  text: 'test page text'
};

const testPage2 = {
  /* author: testTranslator.id, */
  url: 'test_page_url_two',
  title: 'test page title two',
  text: 'test page text two'
};

const testPage3 = {
  /* author: testTranslator2.id, */
  url: 'test   page   url   three',
  title: 'test page title three',
  text: 'test page text three'
};

const testTermTranslation = {
  termId: testTerm.id,
  translation: {
    translatorId: testTranslator.id,
    meanings: [
      {
        versions: [
          "Translation test term (1.1)",
          "Translation test term (1.2)",
          "Translation test term (1.3)"
        ],
        comment: "test term meaning 1 comment"
      },
      {
        versions: [
          "Translation test term (2.1)",
          "Translation test term (2.2)",
          "Translation test term (2.2)"
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
          "Translation test term 2 (1.1)",
          "Translation test term 2 (2.2)",
          "Translation test term 2 (3.3)"
        ],
        comment: "test term 2 meaning 1 comment"
      },
      {
        versions: [
          "Translation test term 2 (2.1)",
          "Translation test term 2 (2.2)",
          "Translation test term 2 (2.3)"
        ],
        comment: null
      }
    ]
  }
};

const forceCleanUp = () => {
  describe('Force cleanup', () => {
    it('may delete test data', (done) => {
      let ready = 0;
      const _done = () => {
        if (++ready === 4) {
          done();
        }
      };
      const logAndDone = (text) => {
        console.log(text);
        _done();
      };
      usersController.removeById(testAdmin.id)
        .then(() => logAndDone('Test admin user was successfully deleted'))
        .catch(_done);
      usersController.removeById(testTranslator.id)
        .then(() => logAndDone('Test translator user was successfully deleted'))
        .catch(_done);
      usersController.removeById(testTranslator2.id)
        .then(() => logAndDone('Test translator-2 user was successfully deleted'))
        .catch(_done);
      termsController.removeById(testTerm.id)
        .then(() => logAndDone('Test term was successfully deleted'))
        .catch(_done);
      termsController.removeById(testTerm2.id)
        .then(() => logAndDone('Test term 2 was successfully deleted'))
        .catch(_done);
      pagesController.removeByUrl(testPage.url)
        .then(() => logAndDone('Test page was successfully deleted'))
        .catch(_done);
      pagesController.removeByUrl(testPage2.url)
        .then(() => logAndDone('Test page 2 was successfully deleted'))
        .catch(_done);
      pagesController.removeByUrl(testPage3.url.replace(/ /g, '_'))
        .then(() => logAndDone('Test page 3 was successfully deleted'))
        .catch(_done);
    });
  });
};

forceCleanUp();

const shouldLogIn = (user, shouldFail) => {
  it(`should ${shouldFail ? 'not ' : ''}log in as ${user.login}`, (done) => {
    request.post('/api/login').send({
      login: user.login,
      password: user.password
    }).end(
      (err, res) => {
        user.token = res.body.token;
        if(shouldFail) {
          assert.equal(res.body.error, true);
          assert.equal(res.body.message, "Can't login. Wrong credentials");
        }
        else {
          assert.equal(res.body.user.login, user.login);
        }
        done();
      }
    )
  });
};

const shouldNotLogIn = (user) => shouldLogIn(user, true);

module.exports = {
  request,
  testAdmin,
  testTranslator,
  testTranslator2,
  testTerm,
  testTerm2,
  testPage,
  testPage2,
  testPage3,
  testTermTranslation,
  testTermTranslation2,
  shouldLogIn,
  shouldNotLogIn,
  languages
};
