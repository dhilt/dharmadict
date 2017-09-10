const assert = require('assert');
const request = require('./_shared.js').request;
const shouldLogIn = require('./_shared.js').shouldLogIn;
const testTranslator = require('./_shared.js').testTranslator;
const testTerm = require('./_shared.js').testTerm;
const testTermTranslation = require('./_shared.js').testTermTranslation;

const goclone = source => {
  if (Object.prototype.toString.call(source) === '[object Array]') {
    let clone = [];
    for (let i=0; i<source.length; i++) {
      clone[i] = goclone(source[i]);
    }
    return clone;
  } else if (typeof(source)=="object") {
    let clone = {};
    for (let prop in source) {
      if (source.hasOwnProperty(prop)) {
        clone[prop] = goclone(source[prop]);
      }
    }
    return clone;
  } else {
    return source;
  }
}

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

  it('should not update term (Missing termId)', (done) => {
    let term = goclone(testTermTranslation);
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

  it('should not update term (Missing translation)', (done) => {
    let term = goclone(testTermTranslation);
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

  it('should not update term (Missing translation.meanings)', (done) => {
    let term = goclone(testTermTranslation);
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

  it('should not update term (Invalid termId)', (done) => {
    let term = goclone(testTermTranslation);
    term.termId = 123;
    request.post('/api/update')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(term)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update term. Invalid termId");
          done();
        }
      )
  });

  it('should not update term (Invalid translation.meanings)', (done) => {
    let term = goclone(testTermTranslation);
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

  it('should not update term (Invalid versions)', (done) => {
    let term = goclone(testTermTranslation);
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

  it('should not update term (Invalid comment)', (done) => {
    let term = goclone(testTermTranslation);
    delete term.translation.meanings[0].comment;
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

  it('should not update term (Invalid versions)', (done) => {
    let term = goclone(testTermTranslation);
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

  it('should not update term (Invalid comment)', (done) => {
    let term = goclone(testTermTranslation);
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

  /*it('should not update term (This term doesn\'t exist)', (done) => {
    let term = goclone(testUpdateTerm);
    term.termId = "UNEXISTENT_TERM!!!";
    request.post('/api/update')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(term)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update term. This term doesn\'t exist");
          done();
        }
      )
  });*/

});
