const assert = require('assert');
const request = require('./_shared.js').request;
const testTranslator = require('./_shared.js').testTranslator;
const testTranslator2 = require('./_shared.js').testTranslator2;
const testTerm = require('./_shared.js').testTerm;
const testTerm2 = require('./_shared.js').testTerm2;
const testTermTranslation = require('./_shared.js').testTermTranslation;
const testTermTranslation2 = require('./_shared.js').testTermTranslation2;

describe('Search terms API (find all terms)', () => {

  it('should work', (done) => {
    request.get('/api/terms/all').end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  it('should find all terms (at minimum 2 testTerms)', (done) => {
    request.get('/api/terms/all').end(
      (err, res) => {
        const terms = res.body.terms;
        const testedTerms = [testTerm, testTerm2];
        assert.equal(terms.length > testedTerms.length, true);
        testedTerms.forEach(term => {
          const foundTerm = terms.find(e => e.wylie === term.name);
          assert.equal(!!foundTerm, true);
          assert.equal(foundTerm.hasOwnProperty('wylie'), true);
          assert.equal(foundTerm.hasOwnProperty('sanskrit_ru'), true);
          assert.equal(foundTerm.hasOwnProperty('sanskrit_en'), true);
          assert.equal(foundTerm['wylie'], term['name']);
          assert.equal(foundTerm['sanskrit_ru'], term.sanskrit['sanskrit_ru']);
          assert.equal(foundTerm['sanskrit_en'], term.sanskrit['sanskrit_en']);
        });
        done();
      }
    )
  });
});

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

  it('should not search term (empty pattern)', (done) => {
    request.get('/api/terms?pattern=').end(
      (err, res) => {
        assert.equal(500, res.body.code);
        assert.equal(true, res.body.error);
        assert.equal('Search error. Invalid pattern', res.body.message);
        done();
      }
    )
  });

  it('should find nothing (unmatched pattern)', (done) => {
    request.get('/api/terms?pattern=xxx').end(
      (err, res) => {
        assert.equal(!!res.body, true);
        assert.equal(typeof res.body, 'object'); // Array
        assert.equal(res.body.length, 0);
        done();
      }
    )
  });

  testSanskrits = (source, target) =>
    Object.keys(target).forEach(key => {
      assert.equal(!!source[key], true);
      assert.equal(!!source[key + '_lower'], true);
      assert.equal(source[key], target[key]);
      assert.equal(source[key + '_lower'], target[key].toLowerCase());
    });

  testTranslations = (source) => {
    source = source.translations;
    assert.equal(!!source, true);
    assert.equal(source.length, 2);
    const translation1 = source.find(elem => elem.translatorId === testTranslator.id);
    const translation2 = source.find(elem => elem.translatorId === testTranslator2.id);
    assert.equal(!!translation1, true);
    assert.equal(!!translation2, true);
    assert.equal(testTranslator.language, translation1.language);
    assert.equal(testTranslator2.language, translation2.language);
  };

  testMeanings = (source, target) => {
    target = target.translation;
    source.translations.forEach(translation => {
      const _meanings = translation.meanings;
      assert.equal(!!_meanings, true);
      assert.equal(_meanings.length, 2);
      _meanings.forEach((meaning, index) => {
        assert.equal(!!meaning.versions, true);
        assert.equal(!!meaning.versions_lower, true);
        assert.equal(meaning.comment, target.meanings[index].comment);
        assert.equal(meaning.versions.length, target.meanings[index].versions.length);
        assert.equal(meaning.versions.length, meaning.versions_lower.length);
        target.meanings[index].versions.forEach(version => {
          assert.notEqual(meaning.versions.indexOf(version), -1);
          assert.notEqual(meaning.versions_lower.indexOf(version.toLowerCase()), -1);
        })
      });
    });
  };

  it('should find two test terms (shallow)', (done) => {
    request.get('/api/terms?pattern=' + testTerm.name).end(
      (err, res) => {
        const terms = res.body;
        assert.equal(!!terms, true);
        assert.equal(terms.length, 2);
        const foundTerm1 = terms.find(term => term.wylie === testTerm.name);
        const foundTerm2 = terms.find(term => term.wylie === testTerm2.name);
        assert.equal(!!foundTerm1, true);
        assert.equal(!!foundTerm2, true);
        assert.equal(testTerm.id, foundTerm1.id);
        assert.equal(testTerm2.id, foundTerm2.id);

        testSanskrits(foundTerm1, testTerm.sanskrit);
        testSanskrits(foundTerm2, testTerm2.sanskrit);
        done();
      }
    )
  });

  it('should find two test terms again (deep)', (done) => {
    request.get('/api/terms?pattern=' + testTerm.name).end(
      (err, res) => {
        const foundTerm1 = res.body.find(term => term.wylie === testTerm.name);
        const foundTerm2 = res.body.find(term => term.wylie === testTerm2.name);

        testTranslations(foundTerm1);
        testMeanings(foundTerm1, testTermTranslation);

        testTranslations(foundTerm2);
        testMeanings(foundTerm2, testTermTranslation2);
        done();
      }
    )
  });

  it('should search one test term (shallow)', (done) => {
    request.get('/api/terms?pattern=' + testTerm2.name).end(
      (err, res) => {
        const terms = res.body;
        assert.equal(!!terms, true);
        assert.equal(terms.length, 1);
        const foundTerm = terms[0];
        assert.equal(!!foundTerm, true);
        assert.equal(foundTerm.wylie, testTerm2.name);
        assert.equal(foundTerm.id, testTerm2.id);

        testSanskrits(foundTerm, testTerm2.sanskrit);
        done();
      }
    )
  });

  it('should search one test term again (deep)', (done) => {
    request.get('/api/terms?pattern=' + testTerm2.name).end(
      (err, res) => {
        const foundTerm = res.body[0];

        testTranslations(foundTerm);
        testMeanings(foundTerm, testTermTranslation2);
        done();
      }
    )
  });
});
