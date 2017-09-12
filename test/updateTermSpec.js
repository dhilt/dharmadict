const assert = require('assert');
const request = require('./_shared.js').request;
const shouldLogIn = require('./_shared.js').shouldLogIn;
const testAdmin = require('./_shared.js').testAdmin;
const testTranslator = require('./_shared.js').testTranslator;
const testTerm = require('./_shared.js').testTerm;
const testTermTranslation = require('./_shared.js').testTermTranslation;

describe('Update term API', () => {

  it('should work', (done) => {
    request.post('/api/update').end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  it('should not update term (auth needed)', (done) => {
    request.post('/api/update')
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
    request.post('/api/update')
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
    request.post('/api/update')
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
    request.post('/api/update')
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
    request.post('/api/update')
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
    request.post('/api/update')
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
    request.post('/api/update')
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
    request.post('/api/update')
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
    request.post('/api/update')
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

  it('should not update term (wrong termId)', (done) => {
    let term = JSON.parse(JSON.stringify(testTermTranslation));
    term.termId = testTerm.id + '___';
    request.post('/api/update')
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

  const addTestTranslation = (text) => {
    it(text, (done) => {
      let term = JSON.parse(JSON.stringify(testTermTranslation));
      term.termName = testTerm.name;
      request.post('/api/update')
        .set('Authorization', 'Bearer ' + testTranslator.token)
        .send(term)
        .end(
          (err, res) => {
            assert.equal(res.body.success, true);
            const translation = res.body.term.translation;
            const meanings = term.translation.meanings, _meanings = translation.meanings;
            assert.equal(translation.translatorId, testTranslator.id);
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

  addTestTranslation('should update term');

  it('should update term (add 1 more meaning)', (done) => {
    let term = JSON.parse(JSON.stringify(testTermTranslation));
    term.termName = testTerm.name;
    term.translation.meanings.push({versions: ["New test translation"], comment: "New test comment"});
    request.post('/api/update')
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

  addTestTranslation('should update term (remove meaning just added)');

  it('should update term (remove all meanings)', (done) => {
    let term = JSON.parse(JSON.stringify(testTermTranslation));
    term.termName = testTerm.name;
    term.translation.meanings = [];
    request.post('/api/update')
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

  addTestTranslation('should update term (get initial meanings back)');

  shouldLogIn(testAdmin);

  it('should update term by admin (change comment on first meaning)', (done) => {
    let term = JSON.parse(JSON.stringify(testTermTranslation));
    term.termName = testTerm.name;
    term.translation.meanings[0].comment = "New test comment by admin";
    request.post('/api/update')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send(term)
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          const translation = res.body.term.translation;
          const meanings = term.translation.meanings, _meanings = translation.meanings;
          assert.equal(JSON.stringify(meanings[0].versions), JSON.stringify(_meanings[0].versions));
          assert.equal(_meanings.length, meanings.length);
          assert.equal(translation.translatorId, term.translation.translatorId);
          done();
        }
      )
  });

/*  shouldLogIn(testTranslator2);

  it('should not update term (unpermitted access)', (done) => {
    let term = JSON.parse(JSON.stringify(testTermTranslation));
    term.termName = testTerm.name;
    request.post('/api/update')
      .set('Authorization', 'Bearer ' + testTranslator.token2)
      .send(term)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update term. Unpermitted access");
          done();
        }
      )
  });*/

});
