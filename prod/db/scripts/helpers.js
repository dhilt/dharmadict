class Process {
  constructor(resolve, reject, total) {
    this.resolve = resolve;
    this.reject = reject;
    this.total = total;
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
        this.lastError.text = this.countError + ' errors have been occurred. Last error:';
        this.reject(this.lastError);
      }
      else {
        this.resolve({text: this.count + ' records have been processed'});
      }
    }
  }
}

module.exports = {
  Process
};