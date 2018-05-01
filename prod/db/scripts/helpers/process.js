class Process {
  constructor(resolve, reject, total, token) {
    this.resolve = resolve;
    this.reject = reject;
    this.total = total;
    this.token = token;
    this.count = 0;
    this.countError = 0;
    this.lastError = {};
  }

  done(error) {
    if (error) {
      this.countError++;
      this.lastError = error;
    }
    else {
      this.count++;
    }
    if (this.count + this.countError === this.total) {
      if (this.countError) {
        console.log('Fail! ' + this.countError + ' errors have been occurred');
        this.reject(this.lastError);
      }
      else {
        console.log(this.count + ' ' + (this.token ? this.token : 'records') + ' were processed successfully');
        this.resolve();
      }
    }
  }
}

module.exports = {
  Process
};
