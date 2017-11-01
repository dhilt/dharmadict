const assert = require('assert');
const request = require('./_shared.js').request;
const testTranslator = require('./_shared.js').testTranslator;
const testTranslator2 = require('./_shared.js').testTranslator2;

describe('Get common data API', () => {

  it('should work', (done) => {
    request.get('/api/common').end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  it('should take common translators and languages', (done) => {
    request.get('/api/common').end(
      (err, res) => {
        assert.equal(res.body.success, true)
        const translators = res.body.translators
        const languages = res.body.languages
        assert.equal(!!translators, true)
        assert.equal(!!languages, true)
        assert.equal(languages.length === 2, true)
        assert.equal(translators.length >= 2, true)
        assert.equal(true, !!translators.find(user => user.id === testTranslator.id))
        assert.equal(true, !!translators.find(user => user.id === testTranslator2.id))
        assert.equal(true, !!languages.find(lang => lang.id === 'ru'))
        assert.equal(true, !!languages.find(lang => lang.id === 'en'))
        done();
      }
    )
  });
});
