const assert = require('assert');
const request = require('./_shared.js').request;
const shouldLogIn = require('./_shared.js').shouldLogIn;
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

  it('should update term', (done) => {
    let term = JSON.parse(JSON.stringify(testTermTranslation));
    term.termName = testTerm.name;
    request.post('/api/update')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(term)
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          let translation = res.body.term.translation;
          console.log(translation);
          assert.equal(translation.translatorId, testTranslator.id);
          assert.equal(translation.meanings.length, 2);
          assert.equal(translation.meanings[0].comment, term.translation.meanings[0].comment);
          assert.equal(translation.meanings[1].comment, term.translation.meanings[1].comment);
          assert.equal(JSON.stringify(translation.meanings[0].versions), JSON.stringify(term.translation.meanings[0].versions));
          assert.equal(JSON.stringify(translation.meanings[1].versions), JSON.stringify(term.translation.meanings[1].versions));
          done();
        }
      )
  });
/*
  it('should update term (added new meanings)', (done) => {
    let term = JSON.parse(JSON.stringify(testTermTranslation));
    term.termName = testTerm.name;
    term.translation.meanings.push({versions: ["New test translation"], comment: "New test comment"});
    request.post('/api/update')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(term)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, false);
          assert.equal(res.body.term, term);
          done();
        }
      )
  });

  it('should update term (it will remove third meaning)', (done) => {
    let term = JSON.parse(JSON.stringify(testTermTranslation));
    term.termName = testTerm.name;
    request.post('/api/update')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(term)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, false);
          assert.equal(res.body.term, term);
          done();
        }
      )
  });

  it('should update term (it will remove all meaning)', (done) => {
    let term = JSON.parse(JSON.stringify(testTermTranslation));
    term.termName = testTerm.name;
    term.translation.meanings = [];
    request.post('/api/update')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(term)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, false);
          assert.equal(res.body.term.translation.meanings, []);
          done();
        }
      )
  });*/
});
