const assert = require('assert');
const request = require('./_shared.js').request;
const shouldLogIn = require('./_shared.js').shouldLogIn;
const testAdmin = require('./_shared.js').testAdmin;
const testTranslator = require('./_shared.js').testTranslator;
const testTerm = require('./_shared.js').testTerm;

describe('New term API', () => {

  it('should work', (done) => {
    request.post('/api/newTerm').end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  it('should not create new term (auth needed)', (done) => {
    request.post('/api/newTerm')
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't create new term. Authorization needed");
          done();
        }
      )
  });

  shouldLogIn(testTranslator);

  it('should not create new term (admin only)', (done) => {
    request.post('/api/newTerm')
      .set('Authorization', 'Bearer ' + testTranslator.token)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't create new term. Admin only");
          done();
        }
      )
  });

  shouldLogIn(testAdmin);

  it('should not create new term (no term name)', (done) => {
    request.post('/api/newTerm')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't create new term. Invalid params");
          done();
        }
      )
  });

  it('should not create new term (bad term name)', (done) => {
    request.post('/api/newTerm')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({term: 123})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't create new term. Invalid params");
          done();
        }
      )
  });

  it('should create new term', (done) => {
    request.post('/api/newTerm')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({term: testTerm.name})
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.id, testTerm.id);
          //setTimeout(() => done(), 1000);
          done();
        }
      )
  });

  /*it('should not create duplicate term', (done) => {
    request.post('/api/newTerm')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({term: testTerm.name})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't create new term. Already exists");
          done();
        }
      )
  });*/

});