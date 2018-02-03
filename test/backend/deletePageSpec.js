const assert = require('assert');
const request = require('./_shared.js').request;
const shouldLogIn = require('./_shared.js').shouldLogIn;
const testAdmin = require('./_shared.js').testAdmin;
const testTranslator = require('./_shared.js').testTranslator;
const testPage = require('./_shared.js').testPage;
const testPage2 = require('./_shared.js').testPage2;
const testPage3 = require('./_shared.js').testPage3;

describe('Delete page API', () => {

  const removePageUrl = '/api/pages?url=' + testPage.url;
  const removePage2Url = '/api/pages?url=' + testPage2.url;
  const removePage3Url = '/api/pages?url=' + testPage3.url;
  const removeInexistentPageUrl = '/api/pages?url=inexistent_page_url';

  it('should work', (done) => {
    request.delete(removePageUrl).end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  it('should not delete page (auth needed)', (done) => {
    request.delete(removePageUrl)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't delete page. Authorization needed");
          done();
        }
      )
  });

  shouldLogIn(testTranslator);

  it('should not delete page (admin only)', (done) => {
    request.delete(removePageUrl)
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't delete page. Admin only");
          done();
        }
      )
  });

  shouldLogIn(testAdmin);

  it('should not delete page (invalid url)', (done) => {
    request.delete('/api/pages')
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
    request.delete(removeInexistentPageUrl)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't delete page. No page found");
          done();
        }
      )
  });

  it('should delete "' + testPage.url + '" page', (done) => {
    request.delete(removePageUrl)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          done();
        }
      )
  });

  it('should delete "' + testPage2.url + '" page', (done) => {
    request.delete(removePage2Url)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          done();
        }
      )
  });

  it('should delete "' + testPage3.url + '" page', (done) => {
    request.delete(removePage3Url)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          done();
        }
      )
  });
});
