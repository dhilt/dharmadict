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
    request.get('/api/terms').end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  it('should not search term (no pattern)', (done) => {
    request.get('/api/terms').end(
      (err, res) => {
        assert.equal(500, res.body.code);
        assert.equal(true, res.body.error);
        assert.equal('Search error. Invalid pattern', res.body.message);
        done();
      }
    )
  });

  testTranslationsInTerm = (translations, term, testTermTranslation) => {
    // Testing 'translations' in 'term'
    assert.equal(true, !!translations);
    assert.notEqual(undefined, translations.length);
    assert.equal(true, translations.length === 2);
    const _firstTranslation = translations.find(elem => elem.translatorId === testTranslator.id);
    const _secondTranslation = translations.find(elem => elem.translatorId === testTranslator2.id);
    assert.equal(true, !!_firstTranslation);
    assert.equal(true, !!_secondTranslation);
    assert.equal(testTranslator.language, _firstTranslation.language);
    assert.equal(testTranslator2.language, _secondTranslation.language);
    // Continue testing 'translations' in 'term'. Now, "meanings"
    [_firstTranslation, _secondTranslation].forEach(translation => {
      const _meanings = translation.meanings;
      assert.equal(true, !!_meanings);
      assert.notEqual(undefined, _meanings.length);
      assert.equal(true, _meanings.length === 2);
      _meanings.forEach(meaning => {
        assert.equal(true, !!meaning.comment || meaning.comment === null);
        assert.equal(true, !!meaning.versions);
        assert.equal(true, !!meaning.versions_lower);
      });
      _meanings.forEach((_meaning, index) => {
        assert.equal(_meaning.comment, testTermTranslation.translation.meanings[index].comment);
        assert.equal( _meaning.versions.length, _meaning.versions_lower.length);
        for (let i = 0; i < _meaning.versions.length; i++) {
          assert.equal(_meaning.versions[i], testTermTranslation.translation.meanings[index].versions[i]);
          assert.equal(_meaning.versions_lower[i], testTermTranslation.translation.meanings[index].versions[i].toLowerCase());
        }
      });
    });
  };

  testSanskritsInTerm = (testTerm, initTerm) => {
    const checkingSanskrits = Object.keys(initTerm.sanskrit);
    checkingSanskrits.forEach(sanskritKey => {
      assert.equal(true, testTerm.hasOwnProperty(sanskritKey));
      assert.equal(true, testTerm.hasOwnProperty(sanskritKey + '_lower'));
      assert.equal(testTerm[sanskritKey], initTerm.sanskrit[sanskritKey]);
      assert.equal(testTerm[sanskritKey + '_lower'], initTerm.sanskrit[sanskritKey].toLowerCase());
    });
  };

  it('should search two test terms', (done) => {
    request.get('/api/terms?pattern=' + testTerm.name).end(
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

        testSanskritsInTerm(_firstTerm, testTerm);
        testSanskritsInTerm(_secondTerm, testTerm2);

        // Here testing translations in first term
        testTranslationsInTerm(_firstTerm.translations, testTerm, testTermTranslation);

        // Here testing translations in second term
        testTranslationsInTerm(_secondTerm.translations, testTerm2, testTermTranslation2);
        done();
      }
    )
  });

  it('should search one test term ("test term two")', (done) => {
    request.get('/api/terms?pattern=' + testTerm2.name).end(
      (err, res) => {
        let _term = res.body;
        assert.equal(true, !!_term);
        assert.notEqual(undefined, _term.length);
        assert.equal(true, _term.length === 1);
        _term = _term[0];
        assert.equal(_term.wylie, testTerm2.name);
        assert.equal(true, !!_term);
        assert.equal(_term.id, testTerm2.id);

        testSanskritsInTerm(_term, testTerm2);

        // Here testing translations in term
        testTranslationsInTerm(_term.translations, testTerm2, testTermTranslation2);
        done();
      }
    )
  });
});
