const assert = require('assert');
const request = require('./_shared.js').request;
const shouldLogIn = require('./_shared.js').shouldLogIn;
const testAdmin = require('./_shared.js').testAdmin;

describe('New term API', () => {

  it('should work', (done) => {
    request.post('/api/newTerm').end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  shouldLogIn();

  it('should work', (done) => {
    request.post('/api/newTerm')
      .set('Authorization', testAdmin.token)
      .end(
        (err, res) => {
          console.log(res.body)
          done();
        }
      )
  });

});