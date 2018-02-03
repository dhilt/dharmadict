const assert = require('assert');
const request = require('./_shared.js').request;
const shouldLogIn = require('./_shared.js').shouldLogIn;
const testAdmin = require('./_shared.js').testAdmin;
const testTranslator = require('./_shared.js').testTranslator;
const testPage = require('./_shared.js').testPage;
const testPage2 = require('./_shared.js').testPage2;

describe('Update page API', () => {

  const updatePageUrl = '/api/pages?url=' + testPage.url;
  const updatePage2Url = '/api/pages?url=' + testPage2.url;
  const updateInexistentPageUrl = '/api/pages?url=inexistent_page_url';

  it('should work', (done) => {
    request.patch('/api/pages').end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  it('should not update page (auth needed)', (done) => {
    request.patch('/api/pages')
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update page. Authorization needed");
          done();
        }
      )
  });

  shouldLogIn(testTranslator);

  it('should not update page (admin only)', (done) => {
    request.patch('/api/pages')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update page. Admin only");
          done();
        }
      )
  });

  shouldLogIn(testAdmin);

  it('should not update page (incorrect query, no url)', (done) => {
    request.patch('/api/pages')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update page. Incorrect query, no url");
          done();
        }
      )
  });

  it('should not update page (incorrect query, no url) (2)', (done) => {
    request.patch('/api/pages?url=')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update page. Incorrect query, no url");
          done();
        }
      )
  });

  const copyPage = (page) => Object.assign({}, page);

  it('should not update page (no payload)', (done) => {
    request.patch(updatePageUrl)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update page. Invalid payload");
          done();
        }
      )
  });

  it('should not update page (invalid payload)', (done) => {
    request.patch(updatePageUrl)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({payload: 'not object'})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update page. Invalid payload");
          done();
        }
      )
  });

  it('should not update page (no title)', (done) => {
    let page = copyPage(testPage);
    delete page.title;
    request.patch(updatePageUrl)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({payload: page})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update page. No title");
          done();
        }
      )
  });

  it('should not update page (no text)', (done) => {
    let page = copyPage(testPage);
    delete page.text;
    request.patch(updatePageUrl)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({payload: page})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update page. No text");
          done();
        }
      )
  });

  it('should not update page (invalid title)', (done) => {
    let page = copyPage(testPage);
    page.title = { key: 'not a string' };
    request.patch(updatePageUrl)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({payload: page})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update page. Invalid title");
          done();
        }
      )
  });

  it('should not update page (invalid text)', (done) => {
    let page = copyPage(testPage);
    page.text = { key: 'not a string' };
    request.patch(updatePageUrl)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({payload: page})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update page. Invalid text");
          done();
        }
      )
  });

  it('should not update page (try find inexistent page url)', (done) => {
    request.patch(updateInexistentPageUrl)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({payload: testPage})
      .end(
        (err, res) => {
          assert.equal(res.body.code, 404);
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update page. No page found");
          done();
        }
      )
  });

  const updatePage = (pageUrl, page) => {
    it('should update page and return page with new data', (done) => {
      page.title = page.title + ' new words in title for ' + pageUrl;
      page.text = page.text + ' new words in text for ' + pageUrl;
      request.patch(pageUrl)
        .set('Authorization', 'Bearer ' + testAdmin.token)
        .send({payload: page})
        .end(
          (err, res) => {
            assert.equal(res.body.success, true);
            assert.equal(res.body.page.url, page.url);
            assert.equal(res.body.page.title, page.title);
            assert.equal(res.body.page.text, page.text);
            done();
          }
        )
    });
  };

  updatePage(updatePageUrl, testPage);
  updatePage(updatePage2Url, testPage2);
});
