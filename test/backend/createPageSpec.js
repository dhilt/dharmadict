const assert = require('assert');
const request = require('./_shared.js').request;
const shouldLogIn = require('./_shared.js').shouldLogIn;
const testAdmin = require('./_shared.js').testAdmin;
const testTranslator = require('./_shared.js').testTranslator;
const testPage = require('./_shared.js').testPage;
const testPage2 = require('./_shared.js').testPage2;
const testPage3 = require('./_shared.js').testPage3;

describe('Create page API', () => {

  it('should work', (done) => {
    request.post('/api/pages').end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  it('should not create new page (auth needed)', (done) => {
    request.post('/api/pages')
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't create new page. Authorization needed");
          done();
        }
      )
  });

  shouldLogIn(testTranslator);

  it('should not create new page (admin only)', (done) => {
    request.post('/api/pages')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't create new page. Admin only");
          done();
        }
      )
  });

  shouldLogIn(testAdmin);

  it('should not create new page (no payload)', (done) => {
    request.post('/api/pages')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't create new page. Invalid payload");
          done();
        }
      )
  });

  it('should not create new page (invalid payload)', (done) => {
    request.post('/api/pages')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({payload: 'not object'})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't create new page. Invalid payload");
          done();
        }
      )
  });

  const copyPage = (page) => Object.assign({}, page);

  it('should not create new page (no url)', (done) => {
    let page = copyPage(testPage);
    delete page.url;
    request.post('/api/pages')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({payload: page})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't create new page. No url");
          done();
        }
      )
  });

  it('should not create new page (invalid url)', (done) => {
    let page = copyPage(testPage);
    page.url += '/slash';
    request.post('/api/pages')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({payload: page})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, `Can't create new page. Url can't contain next symbol: "/"`);
          done();
        }
      )
  });

  it('should not create new page (no title)', (done) => {
    let page = copyPage(testPage);
    delete page.title;
    request.post('/api/pages')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({payload: page})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't create new page. No title");
          done();
        }
      )
  });

  it('should not create new page (no text)', (done) => {
    let page = copyPage(testPage);
    delete page.text;
    request.post('/api/pages')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({payload: page})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't create new page. No text");
          done();
        }
      )
  });

  it('should not create new page (invalid url)', (done) => {
    let page = copyPage(testPage);
    page.url = { key: 'value' };
    request.post('/api/pages')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({payload: page})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't create new page. Invalid url");
          done();
        }
      )
  });

  it('should not create new page (invalid title)', (done) => {
    let page = copyPage(testPage);
    page.title = 1234;
    request.post('/api/pages')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({payload: page})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't create new page. Invalid title");
          done();
        }
      )
  });

  it('should not create new page (invalid text)', (done) => {
    let page = copyPage(testPage);
    page.text = [1, 2, 3, 4];
    request.post('/api/pages')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({payload: page})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't create new page. Invalid text");
          done();
        }
      )
  });

  it('should create new page', (done) => {
    request.post('/api/pages')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({payload: testPage})
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.page.url, testPage.url);
          assert.equal(res.body.page.title, testPage.title);
          assert.equal(res.body.page.text, testPage.text);
          done();
        }
      )
  });

  it('should create new page 2', (done) => {
    request.post('/api/pages')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({payload: testPage2})
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.page.url, testPage2.url);
          assert.equal(res.body.page.title, testPage2.title);
          assert.equal(res.body.page.text, testPage2.text);
          done();
        }
      )
  });

  it('should create new page with valid url', (done) => {
    let page = copyPage(testPage3);
    const expectedUrl = page.url.replace(/ /g, '_');
    request.post('/api/pages')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({payload: page})
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.page.url, expectedUrl);
          assert.equal(res.body.page.title, testPage3.title);
          assert.equal(res.body.page.text, testPage3.text);
          done();
        }
      )
  });

  it('should not create duplicate page', (done) => {
    request.post('/api/pages')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({payload: testPage})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't create new page. Already exists");
          done();
        }
      )
  });
});
