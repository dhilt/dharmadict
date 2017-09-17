class ApiError {
  constructor(text, code = 500) {
    this.text = text;
    this.code = code;
  }
}

const sendApiError = (res, text, error) => {
  let code = 500;
  if (error instanceof ApiError) {
    text = text + ' ' + error.text;
    code = error.code
  }
  // res.statusCode = code ???
  res.send({
    error: true,
    code,
    message: text
  })
};

// responseSuccess ???

module.exports = {
  ApiError,
  sendApiError
};
