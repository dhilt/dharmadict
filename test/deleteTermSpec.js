const assert = require('assert');
const request = require('./_shared.js').request;
const shouldLogIn = require('./_shared.js').shouldLogIn;
const testAdmin = require('./_shared.js').testAdmin;
const testTranslator = require('./_shared.js').testTranslator;
const testTerm = require('./_shared.js').testTerm;
const testTerm2 = require('./_shared.js').testTerm2;

describe('Delete term API', () => {

  const queryForFirstTerm = '/api/terms/' + testTerm.id;
  const queryForSecondTerm = '/api/terms/' + testTerm2.id;
  const queryForUnexistentTerm = '/api/terms/unexistent_term';

  it('should work', (done) => {
    request.delete(queryForFirstTerm).end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  it('should not delete term (auth needed)', (done) => {
    request.delete(queryForSecondTerm)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't delete term. Authorization needed");
          done();
        }
      )
  });

  shouldLogIn(testTranslator);

  it('should not delete term (admin only)', (done) => {
    request.delete(queryForFirstTerm)
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't delete term. Admin only");
          done();
        }
      )
  });

  shouldLogIn(testAdmin);

  it('should not delete term (no term id)', (done) => {
    request.delete('/api/terms/')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          res.should.have.status(404);
          done();
        }
      )
  });

  it('should not delete term (term with that id doesn\'t exist)', (done) => {
    request.delete(queryForUnexistentTerm)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't delete term. No term found");
          done();
        }
      )
  });

  it('should delete term: "test_term"', (done) => {
    request.delete(queryForFirstTerm)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          done();
        }
      )
  });

  it('should delete term: "test_term_two"', (done) => {
    request.delete(queryForSecondTerm)
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          done();
        }
      )
  });
});
