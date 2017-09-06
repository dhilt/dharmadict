const request = require('./_shared.js').request;
const assert = require('./_shared.js').assert;

describe('Login API', () => {

  it('should work', (done) => {
    request.post('/api/login').end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    );
  });

  it('should not log in (no params)', (done) => {
    request.post('/api/login').end(
      (err, res) => {
        assert.notEqual(res.body.success, true);
        assert.equal(res.body.message, "Can't login. Invalid params");
        done();
      }
    );
  });

  it('should not log in (wrong login)', (done) => {
    request.post('/api/login').send({
      login: 'test',
      password: 'test'
    }).end(
      (err, res) => {
        assert.notEqual(res.body.success, true);
        assert.equal(res.body.message, "Can't login. No user found");
        done();
      }
    );
  });

});