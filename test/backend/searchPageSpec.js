const assert = require('assert');
const request = require('./_shared.js').request;
const testAdmin = require('./_shared.js').testAdmin;
const testTranslator = require('./_shared.js').testTranslator;
const testTranslator2 = require('./_shared.js').testTranslator2;
const testPage = require('./_shared.js').testPage;
const testPage2 = require('./_shared.js').testPage2;
const testPage3 = require('./_shared.js').testPage3;

describe('Search page API (find all pages)', () => {

  it('should work', (done) => {
    request.get('/api/pages/all').end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  it('should find all pages (at minimum 3 testPages)', (done) => {
    request.get('/api/pages/all').end(
      (err, res) => {
        const pages = res.body;
        const testedPages = [testPage, testPage2, testPage3];
        assert.equal(pages.length > testedPages.length, true);
        testedPages.forEach(page => {
          const foundPage = pages.find(e => e.url === page.url);
          assert.equal(!!foundPage, true);
          assert.equal(foundPage.hasOwnProperty('url'), true);
          assert.equal(foundPage.hasOwnProperty('title'), true);
          assert.equal(foundPage.hasOwnProperty('text'), false);
          assert.equal(foundPage.hasOwnProperty('bio'), true);
          assert.equal(foundPage.url, page.url);
          assert.equal(foundPage.title, page.title);
          assert.equal(foundPage.bio, page.bio);
        });
        done();
      }
    )
  });
});

describe('Search page API (find one page by url)', () => {

  it('should work', (done) => {
    request.get('/api/pages').end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  it('should not search page (no url)', (done) => {
    request.get('/api/pages').end(
      (err, res) => {
        assert.equal(res.body.message, "Search error. Invalid url");
        done();
      }
    )
  });

  it('should not search page (no url) (2)', (done) => {
    request.get('/api/pages?url=').end(
      (err, res) => {
        assert.equal(res.body.message, "Search error. Invalid url");
        done();
      }
    )
  });

  it('should not search page (inexistent page url)', (done) => {
    const inexistent_page_url = '/api/pages?url=inexistent_page_url';
    request.get(inexistent_page_url).end(
      (err, res) => {
        assert.equal(res.body.message, "Search error. No page found");
        done();
      }
    )
  });

  const findPage = (_testPage) => {
    it(`should find page with url: ${_testPage.url}`, (done) => {
      request.get('/api/pages?url=' + _testPage.url).end(
        (err, res) => {
          assert.equal(res.body.url, _testPage.url);
          assert.equal(res.body.title, _testPage.title);
          assert.equal(res.body.text, _testPage.text);
          assert.equal(res.body.bio, _testPage.bio);
          done();
        }
      )
    });
  };

  [testPage, testPage2, testPage3].forEach(page => findPage(page));
});
