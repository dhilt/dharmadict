const assert = require('assert');
const request = require('./_shared.js').request;
const shouldLogIn = require('./_shared.js').shouldLogIn;
const testAdmin = require('./_shared.js').testAdmin;
const testTranslator = require('./_shared.js').testTranslator;
const testTranslator2 = require('./_shared.js').testTranslator2;
const testPage = require('./_shared.js').testPage;
const testPage2 = require('./_shared.js').testPage2;
const testPage3 = require('./_shared.js').testPage3;

describe('Delete page API', () => {

  const getQuery = url => `/api/pages?url=${url}`;

  it('should work', (done) => {
    request.delete(getQuery(testPage.url))
      .end((err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  it('should not delete page (auth needed)', (done) => {
    request.delete(getQuery(testPage.url))
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't delete page. Authorization needed");
          done();
        }
      )
  });

  shouldLogIn(testTranslator);

  it('should not delete page (wrong user)', (done) => {
    request.delete(getQuery(testPage.url))
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't delete page. Unpermitted success");
          done();
        }
      )
  });

  shouldLogIn(testAdmin);

  it('should not delete page (invalid url)', (done) => {
    request.delete(getQuery(''))
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .end(
        (err, res) => {
          assert.equal(res.body.message, "Can't delete page. Invalid url");
          assert.equal(res.body.error, true);
          assert.equal(res.body.code, 500);
          done();
        }
      )
  });

  it('should not delete page (page with that url doesn\'t exist)', (done) => {
    request.delete(getQuery('nonexistent'))
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't delete page. No page found");
          done();
        }
      )
  });

  it(`should delete page by translator, url=${testPage2.url}`, (done) => {
    request.delete(getQuery(testPage2.url))
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          done();
        }
      )
  });

  it(`should delete page by admin, url=${testPage.url}`, (done) => {
    request.delete(getQuery(testPage.url))
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          done();
        }
      )
  });

  it(`should delete page (created by translator) by admin, url=${testPage3.url}`, (done) => {
    request.delete(getQuery(testPage3.url))
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          done();
        }
      )
  });
});
