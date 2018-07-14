const assert = require('assert');
const request = require('./_shared.js').request;
const shouldLogIn = require('./_shared.js').shouldLogIn;
const testAdmin = require('./_shared.js').testAdmin;
const testTranslator = require('./_shared.js').testTranslator;
const testTranslator2 = require('./_shared.js').testTranslator2;
const testPage = require('./_shared.js').testPage;
const testPage2 = require('./_shared.js').testPage2;
const testPage3 = require('./_shared.js').testPage3;

describe('Update page API', () => {

  const getQuery = url => `/api/pages?url=${url}`;

  it('should work', (done) => {
    request.patch('/api/pages').end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  it('should not update page (auth needed)', (done) => {
    request.patch(getQuery(testPage.url))
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update page. Authorization needed");
          done();
        }
      )
  });

  shouldLogIn(testAdmin);

  it('should not update page (no payload)', (done) => {
    request.patch(getQuery(testPage.url))  // testPage.author = id of admin
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update page. Invalid payload");
          done();
        }
      )
  });

  it('should not update page (no payload, but admin can edit page with author = id of translator)', (done) => {
    request.patch(getQuery(testPage2.url)) // testPage2.author = id of translator
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update page. Invalid payload");
          done();
        }
      )
  });

  shouldLogIn(testTranslator);

  it('should not update page (correct role, but id wrong)', (done) => {
    request.patch(getQuery(testPage.url))
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update page. Unpermitted success");
          done();
        }
      )
  });

  it('should not update page (correct role, id correct, but no payload)', (done) => {
    request.patch(getQuery(testPage2.url))
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update page. Invalid payload");
          done();
        }
      )
  });

  shouldLogIn(testAdmin);

  it('should not update page (invalid payload)', (done) => {
    request.patch(getQuery(testPage.url))
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

  const copyPage = (page) => Object.assign({}, page);

  it('should not update page (no title)', (done) => {
    let page = copyPage(testPage);
    delete page.title;
    request.patch(getQuery(testPage.url))
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
    request.patch(getQuery(testPage.url))
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

  it('should not update page (no bio)', (done) => {
    let page = copyPage(testPage);
    delete page.bio;
    request.patch(getQuery(testPage.url))
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({payload: page})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update page. No bio");
          done();
        }
      )
  });

  it('should not update page (invalid title)', (done) => {
    let page = copyPage(testPage);
    page.title = { key: 'not a string' };
    request.patch(getQuery(testPage.url))
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
    request.patch(getQuery(testPage.url))
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

  it('should not update page (invalid bio)', (done) => {
    let page = copyPage(testPage);
    page.bio = { key: 'not a boolean' };
    request.patch(getQuery(testPage.url))
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({payload: page})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update page. Invalid bio");
          done();
        }
      )
  });

  it('should not update page (try find nonexistent page url)', (done) => {
    request.patch(getQuery('nonexistent'))
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

  const updatePage = (page, user) => {
    it('should update page and return page with new data', (done) => {
      page.title = page.title + ' new words in title for ' + page.url;
      page.text = page.text + ' new words in text for ' + page.url;
      page.bio = !page.bio;
      request.patch(getQuery(page.url))
        .set('Authorization', 'Bearer ' + user.token)
        .send({payload: page})
        .end(
          (err, res) => {
            assert.equal(res.body.success, true);
            assert.equal(res.body.page.url, page.url);
            assert.equal(res.body.page.title, page.title);
            assert.equal(res.body.page.text, page.text);
            assert.equal(res.body.page.bio, page.bio);
            if (user.role === 'translator') {
              assert.equal(res.body.page.author, user.id)
            }
            done();
          }
        )
    });
  };

  updatePage(testPage, testAdmin);
  updatePage(testPage2, testAdmin);

  shouldLogIn(testTranslator);
  updatePage(testPage2, testTranslator);

  shouldLogIn(testTranslator2);
  updatePage(testPage3, testTranslator2);

  shouldLogIn(testAdmin);

  it('should update page author (admin only)', (done) => {
    const page = Object.assign({}, testPage);
    const newAuthor = 'some new author';
    page.author = newAuthor;
    request.patch(getQuery(page.url))
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({payload: page})
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.page.author, newAuthor);
          done();
        }
      )
  });

  shouldLogIn(testTranslator);

  it('should not update page author (admin only)', (done) => {
    const page = Object.assign({}, testPage2);
    const newAuthor = 'some new author';
    page.author = newAuthor;
    request.patch(getQuery(page.url))
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send({payload: page})
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.page.author === newAuthor, false);
          done();
        }
      )
  });
});
