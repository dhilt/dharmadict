const assert = require('assert');
const request = require('./_shared.js').request;
const shouldLogIn = require('./_shared.js').shouldLogIn;
const testAdmin = require('./_shared.js').testAdmin;
const testTranslator = require('./_shared.js').testTranslator;
const testTerm = require('./_shared.js').testTerm;
const testTerm2 = require('./_shared.js').testTerm2;
const languages = require('./_shared.js').languages.data;

describe('New term API', () => {

  it('should work', (done) => {
    request.post('/api/terms').end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  it('should not create new term (auth needed)', (done) => {
    request.post('/api/terms')
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
    request.post('/api/terms')
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

  it('should not create new term (no wylie)', (done) => {
    request.post('/api/terms')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't create new term. Invalid wylie");
          done();
        }
      )
  });

  it('should not create new term (bad wylie)', (done) => {
    request.post('/api/terms')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({term: 123})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't create new term. Invalid wylie");
          done();
        }
      )
  });

  it('should not create new term (no sanskrit)', (done) => {
    request.post('/api/terms')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({term: testTerm.name})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't create new term. Invalid sanskrit");
          done();
        }
      )
  });

  it('should not create new term (sanskrit versions amount does not match languagues amount)', (done) => {
    const sanskrit = JSON.parse(JSON.stringify(testTerm.sanskrit));
    delete sanskrit.sanskrit_rus;
    request.post('/api/terms')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({term: testTerm.name, sanskrit})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't create new term. Invalid sanskrit");
          done();
        }
      )
  });

  it('should not create new term (invalid sanskrit)', (done) => {
    const sanskrit = JSON.parse(JSON.stringify(testTerm.sanskrit));
    const invalidKey = 'sanskrit_rus';
    sanskrit[invalidKey] = true;
    request.post('/api/terms')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({term: testTerm.name, sanskrit})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't create new term. Invalid " + invalidKey);
          done();
        }
      )
  });

  it('should create new term', (done) => {
    request.post('/api/terms')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({term: testTerm.name, sanskrit: testTerm.sanskrit})
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.term.id, testTerm.id);
          languages.forEach(lang => {
            assert.equal(res.body.term['sanskrit_' + lang.id], testTerm.sanskrit['sanskrit_' + lang.id]);
            assert.equal(res.body.term['sanskrit_' + lang.id + '_lower'], testTerm.sanskrit['sanskrit_' + lang.id].toLowerCase());
          });
          done();
        }
      )
  });

  it('should create new term 2', (done) => {
    request.post('/api/terms')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({term: testTerm2.name, sanskrit: testTerm2.sanskrit})
      .end(
        (err, res) => {
          assert.equal(res.body.success, true);
          assert.equal(res.body.term.id, testTerm2.id);
          languages.forEach(lang => {
            assert.equal(res.body.term['sanskrit_' + lang.id], testTerm2.sanskrit['sanskrit_' + lang.id]);
            assert.equal(res.body.term['sanskrit_' + lang.id + '_lower'], testTerm2.sanskrit['sanskrit_' + lang.id].toLowerCase());
          });
          done();
        }
      )
  });

  it('should not create duplicate term', (done) => {
    request.post('/api/terms')
      .set('Authorization', 'Bearer ' + testAdmin.token)
      .send({term: testTerm.name, sanskrit: testTerm.sanskrit})
      .end(
        (err, res) => {
          assert.notEqual(res.body.success, true);
          assert.equal(res.body.message, "Can't create new term. Already exists");
          done();
        }
      )
  });
});
