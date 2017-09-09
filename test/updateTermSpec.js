const assert = require('assert');
const request = require('./_shared.js').request;
const shouldLogIn = require('./_shared.js').shouldLogIn;
const testTranslator = require('./_shared.js').testTranslator;

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

  // Incoming data from client
  const testUpdateTerm = {
    termId: "chos",
    translation: {
      translatorId: "MK",
      language: "rus",
      meanings:
        [  { versions: ["a1", "b1", "c1"], comment: "comment1" },
           { versions: ["a1", "b1", "c1"], comment: null }  ]
    }
  };

  it('should not update term (Missing termId)', (done) => {
    let term = Object.assign({}, testUpdateTerm);
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
    let term = Object.assign({}, testUpdateTerm);
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

  // it('should not update term (Missing translation.meanings)', (done) => {
  //   let term = Object.assign({}, testUpdateTerm);
  //   delete term['translation'].meanings;
  //   request.post('/api/update')
  //     .set('Authorization', 'Bearer ' + testTranslator.token)
  //     .send(term)
  //     .end(
  //       (err, res) => {
  //         assert.notEqual(res.body.success, true);
  //         assert.equal(res.body.message, "Can't update term. Incorrect translation.meanings");
  //         done();
  //       }
  //     )
  // });

  it('should not update term (Missing translation.language)', (done) => {
    let term = Object.assign({}, testUpdateTerm);
    delete term['translation'].language;
    request.post('/api/update')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .send(term)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't update term. Incorrect translation.language");
          done();
        }
      )
  });

  // it('should not update term (Invalid termId)', (done) => {
  //   let term = Object.assign({}, testUpdateTerm);
  //   term.termId = 123;
  //   console.log(term);
  //   request.post('/api/update')
  //     .set('Authorization', 'Bearer ' + testTranslator.token)
  //     .send(term)
  //     .end(
  //       (err, res) => {
  //         assert.notEqual(res.body.success, true);
  //         assert.equal(res.body.message, "Can't update term. Invalid termId");
  //         done();
  //       }
  //     )
  // });

  // it('should not update term (Invalid translation)', (done) => {
  //   let term = Object.assign({}, testUpdateTerm);
  //   term.translation = 123;
  //   request.post('/api/update')
  //     .set('Authorization', 'Bearer ' + testTranslator.token)
  //     .send(term)
  //     .end(
  //       (err, res) => {
  //         assert.notEqual(res.body.success, true);
  //         assert.equal(res.body.message, "Can't update term. Invalid translation");
  //         done();
  //       }
  //     )
  // });

  // it('should not update term (Invalid translation.meanings)', (done) => {
  //   let term = Object.assign({}, testUpdateTerm);
  //   term.translation.meanings = 123;
  //   request.post('/api/update')
  //     .set('Authorization', 'Bearer ' + testTranslator.token)
  //     .send(term)
  //     .end(
  //       (err, res) => {
  //         assert.notEqual(res.body.success, true);
  //         assert.equal(res.body.message, "Can't update term. Invalid translation.meanings");
  //         done();
  //       }
  //     )
  // });

})
