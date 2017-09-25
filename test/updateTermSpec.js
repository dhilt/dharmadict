const assert = require('assert');
const request = require('./_shared.js').request;
const shouldLogIn = require('./_shared.js').shouldLogIn;
const testAdmin = require('./_shared.js').testAdmin;
const testTranslator = require('./_shared.js').testTranslator;
const testTranslator2 = require('./_shared.js').testTranslator2;
const testTerm = require('./_shared.js').testTerm;
const testTerm2 = require('./_shared.js').testTerm2;
const testTermTranslation = require('./_shared.js').testTermTranslation;
const testTermTranslation2 = require('./_shared.js').testTermTranslation2;

describe('Update term API', () => {

  it('should work', (done) => {
    request.patch('/api/terms').end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  it('should not update term (auth needed)', (done) => {
    request.patch('/api/terms')
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update term. Authorization needed");
          done();
        }
      )
  });

  shouldLogIn(testTranslator);

  it('should not update term (no termId)', (done) => {
    let term = JSON.parse(JSON.stringify(testTermTranslation));
    delete term['termId'];
    request.patch('/api/terms')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(term)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update term. Incorrect termId");
          done();
        }
      )
  });

  it('should not update term (bad termId)', (done) => {
    let term = JSON.parse(JSON.stringify(testTermTranslation));
    term.termId = 123;
    request.patch('/api/terms')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(term)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update term. Incorrect termId");
          done();
        }
      )
  });

  it('should not update term (no translation)', (done) => {
    let term = JSON.parse(JSON.stringify(testTermTranslation));
    delete term['translation'];
    request.patch('/api/terms')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(term)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update term. Incorrect translation");
          done();
        }
      )
  });

  it('should not update term (no meanings)', (done) => {
    let term = JSON.parse(JSON.stringify(testTermTranslation));
    delete term['translation'].meanings;
    request.patch('/api/terms')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(term)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update term. Incorrect translation.meanings");
          done();
        }
      )
  });

  it('should not update term (bad meanings)', (done) => {
    let term = JSON.parse(JSON.stringify(testTermTranslation));
    term.translation.meanings = 123;
    request.patch('/api/terms')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(term)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update term. Invalid translation.meanings");
          done();
        }
      )
  });

  it('should not update term (no versions)', (done) => {
    let term = JSON.parse(JSON.stringify(testTermTranslation));
    delete term.translation.meanings[0].versions;
    request.patch('/api/terms')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(term)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update term. Invalid versions");
          done();
        }
      )
  });

  it('should not update term (bad versions)', (done) => {
    let term = JSON.parse(JSON.stringify(testTermTranslation));
    term.translation.meanings[0].versions = 123;
    request.patch('/api/terms')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(term)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update term. Invalid versions");
          done();
        }
      )
  });

  it('should not update term (bad comment)', (done) => {
    let term = JSON.parse(JSON.stringify(testTermTranslation));
    term.translation.meanings[0].comment = 123;
    request.patch('/api/terms')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(term)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update term. Invalid comment");
          done();
        }
      )
  });

  it('should not update term (term not found)', (done) => {
    let term = JSON.parse(JSON.stringify(testTermTranslation));
    term.termId = testTerm.id + '___';
    request.patch('/api/terms')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(term)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update term. No term found");
          done();
        }
      )
  });

  const updateTranslation = (text, term, translator, testTermTranslation) => {
    it(text, (done) => {
      let _term = JSON.parse(JSON.stringify(testTermTranslation));
      _term.termName = term;
      _term.translation.translatorId = translator.id;
      request.patch('/api/terms')
        .set('Authorization', 'Bearer ' + translator.token)
        .send(_term)
        .end(
          (err, res) => {
            assert.equal(res.body.success, true);
            const translation = res.body.term.translation;
            const meanings = _term.translation.meanings, _meanings = translation.meanings;
            assert.equal(translation.translatorId, translator.id);
            assert.equal(_meanings.length, testTermTranslation.translation.meanings.length);
            assert.equal(_meanings[0].comment, meanings[0].comment);
            assert.equal(_meanings[1].comment, meanings[1].comment);
            assert.equal(JSON.stringify(_meanings[0].versions), JSON.stringify(meanings[0].versions));
            assert.equal(JSON.stringify(_meanings[1].versions), JSON.stringify(meanings[1].versions));
            done();
          }
        )
    });
  };

  updateTranslation('should update term', testTerm, testTranslator, testTermTranslation);

  it('should update term (add 1 more meaning)', (done) => {
    let term = JSON.parse(JSON.stringify(testTermTranslation));
    term.termName = testTerm.name;
    term.translation.meanings.push({versions: ["New test translation"], comment: "New test comment"});
    request.patch('/api/terms')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(term)
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          const translation = res.body.term.translation;
          const meanings = term.translation.meanings, _meanings = translation.meanings;
          assert.equal(_meanings.length, testTermTranslation.translation.meanings.length + 1);
          assert.equal(_meanings[2].comment, meanings[2].comment);
          assert.equal(JSON.stringify(_meanings[2].versions), JSON.stringify(meanings[2].versions));
          done();
        }
      )
  });

  updateTranslation('should update term (remove meaning just added)', testTerm, testTranslator, testTermTranslation);

  it('should update term (remove all meanings)', (done) => {
    let term = JSON.parse(JSON.stringify(testTermTranslation));
    term.termName = testTerm.name;
    term.translation.meanings = [];
    request.patch('/api/terms')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(term)
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.term.translation.meanings.length, 0);
          done();
        }
      )
  });

  updateTranslation('should update term (get initial meanings back)', testTerm, testTranslator, testTermTranslation);

  shouldLogIn(testAdmin);

  it('should update term by admin (change comment on first meaning)', (done) => {
    let term = JSON.parse(JSON.stringify(testTermTranslation));
    term.termName = testTerm.name;
    term.translation.meanings[0].comment = "New test comment by admin";
    request.patch('/api/terms')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(term)
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          const meanings = term.translation.meanings, _meanings = res.body.term.translation.meanings;
          assert.equal(JSON.stringify(meanings[0].comment), JSON.stringify(_meanings[0].comment));
          done();
        }
      )
  });

  shouldLogIn(testTranslator2);

  it('should not update term (unpermitted access)', (done) => {
    let term = JSON.parse(JSON.stringify(testTermTranslation));
    term.termName = testTerm.name;
    request.patch('/api/terms')
      .set('Authorization', 'Bearer ' + testTranslator2.token)
      .send(term)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update term. Unpermitted access");
          done();
        }
      )
  });

  updateTranslation('should update term by ' + testTranslator.login, testTerm, testTranslator, testTermTranslation);
  updateTranslation('should update term by ' + testTranslator2.login, testTerm, testTranslator2, testTermTranslation);

  updateTranslation('should update term 2 by ' + testTranslator.login, testTerm2, testTranslator, testTermTranslation2);
  updateTranslation('should update term 2 by ' + testTranslator2.login, testTerm2, testTranslator2, testTermTranslation2);
});
