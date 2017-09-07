const assert = require('assert');
const request = require('./_shared.js').request;
const testAdmin = require('./_shared.js').testAdmin;

describe('Login API', () => {

  it('should work', (done) => {
    request.post('/api/login').end(
      (err, res) => {
        res.should.have.status(200);
        done();
      }
    )
  });

  it('should not log in (no params)', (done) => {
    request.post('/api/login').end(
      (err, res) => {
        assert.notEqual(res.body.success, true);
        assert.equal(res.body.message, "Can't login. Invalid params");
        done();
      }
    )
  });

  it('should not log in (wrong login)', (done) => {
    request.post('/api/login').send({
      login: '...',
      password: '...'
    }).end(
      (err, res) => {
        assert.notEqual(res.body.success, true);
        assert.equal(res.body.message, "Can't login. No user found");
        done();
      }
    )
  });

  it('should not log in (wrong password)', (done) => {
    request.post('/api/login').send({
      login: testAdmin.login,
      password: testAdmin.password + '...'
    }).end(
      (err, res) => {
        assert.notEqual(res.body.success, true);
        assert.equal(res.body.message, "Can't login. Wrong credentials");
        done();
      }
    )
  });

  it('should log in', (done) => {
    request.post('/api/login').send({
      login: testAdmin.login,
      password: testAdmin.password
    }).end(
      (err, res) => {
        let user = res.body.user;
        assert.notEqual(res.body.success, true);
        assert.equal(user.login, testAdmin.login);
        done();
      }
    )
  });

});