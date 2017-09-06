const request = require('./_shared.js').request;
const assert = require('./_shared.js').assert;

describe('Common', () => {

  it('API should work', (done) => {
    request.get('/api/test?param=test')
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          assert.equal(res.body.success, true);
          assert.equal(res.body.param, 'test');
          done();
        }
      );
  });

});

