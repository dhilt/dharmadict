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
        assert.equal(res.body.success, true);
        const translators = res.body.translators;
        const languages = res.body.languages;
        assert.notEqual(undefined, translators.find(elem => elem.id === testTranslator.id))
        assert.notEqual(undefined, translators.find(elem => elem.id === testTranslator2.id))
        assert.notEqual(undefined, languages.find(elem => elem.id === 'rus'))
        assert.notEqual(undefined, languages.find(elem => elem.id === 'eng'))
        done();
      }
    )
  });
});
