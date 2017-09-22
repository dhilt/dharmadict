const assert = require('assert');
const request = require('./_shared.js').request;
const testTranslator = require('./_shared.js').testTranslator;
const testTranslator2 = require('./_shared.js').testTranslator2;
const testTerm = require('./_shared.js').testTerm;
const testTerm2 = require('./_shared.js').testTerm2;
const testTermTranslation = require('./_shared.js').testTermTranslation;
const testTermTranslation2 = require('./_shared.js').testTermTranslation2;

describe('Search term API', () => {

  it('should work', (done) => {
    request.get('/api/search').end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  it('should not search term (no pattern)', (done) => {
    request.get('/api/search').end(
      (err, res) => {
        assert.equal(500, res.body.code);
        assert.equal(true, res.body.error);
        assert.equal('Search error. Invalid pattern', res.body.message);
        done();
      }
    )
  });

  it('should search two test terms', (done) => {
    request.get('/api/search?pattern=' + testTerm.name).end(
      (err, res) => {
        const terms = res.body;
        assert.equal(true, !!terms);
        assert.notEqual(undefined, terms.length);
        assert.equal(true, terms.length === 2);
        const _firstTerm = terms.find(term => term.wylie === testTerm.name);
        const _secondTerm = terms.find(term => term.wylie === testTerm2.name);
        assert.equal(true, !!_firstTerm);
        assert.equal(true, !!_secondTerm);
        assert.equal(testTerm.id, _firstTerm.id);
        assert.equal(testTerm2.id, _secondTerm.id);

        // Here testing translations in first term
        const _firstTermTranslations = _firstTerm.translations;
        assert.equal(true, !!_firstTermTranslations);
        assert.notEqual(undefined, _firstTermTranslations.length);
        assert.equal(true, _firstTermTranslations.length === 2);
        let _firstTranslation = _firstTermTranslations.find(elem => elem.translatorId === testTranslator.id);
        let _secondTranslation = _firstTermTranslations.find(elem => elem.translatorId === testTranslator2.id);
        assert.equal(true, !!_firstTranslation);
        assert.equal(true, !!_secondTranslation);
        assert.equal(testTranslator.language, _firstTranslation.language);
        assert.equal(testTranslator2.language, _secondTranslation.language);
        // Continue testing translations in first term. Now, "meanings"
        let _meanings = _firstTranslation.meanings;
        assert.equal(true, !!_meanings);
        assert.notEqual(undefined, _meanings.length);
        assert.equal(true, _meanings.length === 2);
        _meanings.forEach(meaning => {
          assert.equal(true, !!meaning.comment || meaning.comment === null);
          assert.equal(true, !!meaning.versions);
          assert.equal(true, !!meaning.versions_lower);
        });
        for (let i = 0; i < _meanings.length; i++) {
          for (let j = 0; j < _meanings[i].versions.length; j++) {
            assert.equal(_meanings[i].versions[j], testTermTranslation.translation.meanings[i].versions[j]);
            assert.equal(_meanings[i].versions_lower[j], testTermTranslation.translation.meanings[i].versions[j].toLowerCase());
            // assert.equal(_meanings[i].comment, testTermTranslation.translation.meanings[i].comment);
            // Should work. Some problem on updateTermSpec.js. Comments in _shared.js are rewrited.
          }
        }

        // Here testing translations in second term
        const _secondTermTranslations = _secondTerm.translations;
        assert.equal(true, !!_secondTermTranslations);
        assert.notEqual(undefined, _secondTermTranslations.length);
        assert.equal(true, _secondTermTranslations.length === 2);
        _firstTranslation = _secondTermTranslations.find(elem => elem.translatorId === testTranslator.id);
        _secondTranslation = _secondTermTranslations.find(elem => elem.translatorId === testTranslator2.id);
        assert.equal(true, !!_firstTranslation);
        assert.equal(true, !!_secondTranslation);
        assert.equal(testTranslator.language, _firstTranslation.language);
        assert.equal(testTranslator2.language, _secondTranslation.language);
        // Continue testing translations in second term. Now, "meanings"
        _meanings = _firstTranslation.meanings;
        assert.equal(true, !!_meanings);
        assert.notEqual(undefined, _meanings.length);
        assert.equal(true, _meanings.length === 2);
        _meanings.forEach(meaning => {
          assert.equal(true, !!meaning.comment || meaning.comment === null);
          assert.equal(true, !!meaning.versions);
          assert.equal(true, !!meaning.versions_lower);
        });
        for (let i = 0; i < _meanings.length; i++) {
          for (let j = 0; j < _meanings[i].versions.length; j++) {
            assert.equal(_meanings[i].versions[j], testTermTranslation2.translation.meanings[i].versions[j]);
            assert.equal(_meanings[i].versions_lower[j], testTermTranslation2.translation.meanings[i].versions[j].toLowerCase());
            assert.equal(_meanings[i].comment, testTermTranslation2.translation.meanings[i].comment);
          }
        }
        done();
      }
    )
  });

  it('should search one test term ("test term two")', (done) => {
    request.get('/api/search?pattern=' + testTerm2.name).end(
      (err, res) => {
        let _term = res.body;
        assert.equal(true, !!_term);
        assert.notEqual(undefined, _term.length);
        assert.equal(true, _term.length === 1);
        _term = _term[0];
        assert.equal(_term.wylie, testTerm2.name);
        assert.equal(true, !!_term);
        assert.equal(_term.id, testTerm2.id);

        // Here testing translations in term
        const _termTranslations = _term.translations;
        assert.equal(true, !!_termTranslations);
        assert.notEqual(undefined, _termTranslations.length);
        assert.equal(true, _termTranslations.length === 2);
        let _firstTranslation = _termTranslations.find(elem => elem.translatorId === testTranslator.id);
        let _secondTranslation = _termTranslations.find(elem => elem.translatorId === testTranslator2.id);
        assert.equal(true, !!_firstTranslation);
        assert.equal(true, !!_secondTranslation);
        assert.equal(testTranslator.language, _firstTranslation.language);
        assert.equal(testTranslator2.language, _secondTranslation.language);
        // Continue testing translations in term. Now, "meanings"
        let _meanings = _firstTranslation.meanings;
        assert.equal(true, !!_meanings);
        assert.notEqual(undefined, _meanings.length);
        assert.equal(true, _meanings.length === 2);
        _meanings.forEach(meaning => {
          assert.equal(true, !!meaning.comment || meaning.comment === null);
          assert.equal(true, !!meaning.versions);
          assert.equal(true, !!meaning.versions_lower);
        });
        for (let i = 0; i < _meanings.length; i++) {
          for (let j = 0; j < _meanings[i].versions.length; j++) {
            assert.equal(_meanings[i].versions[j], testTermTranslation2.translation.meanings[i].versions[j]);
            assert.equal(_meanings[i].versions_lower[j], testTermTranslation2.translation.meanings[i].versions[j].toLowerCase());
            assert.equal(_meanings[i].comment, testTermTranslation2.translation.meanings[i].comment);
          }
        }
        done();
      }
    )
  });
});
