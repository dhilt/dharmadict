const winston = require('winston');

let logger;

if (process.env.NODE_ENV !== 'test') {
  logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({json: false, timestamp: true}),
      new winston.transports.File({filename: __dirname + '/debug.log', json: false})
    ],
    exceptionHandlers: [
      new (winston.transports.Console)({json: false, timestamp: true}),
      new winston.transports.File({filename: __dirname + '/exceptions.log', json: false})
    ],
    exitOnError: false
  });
}
else {
  logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({json: false, timestamp: true})
    ],
    exceptionHandlers: [
      new (winston.transports.Console)({json: false, timestamp: true})
    ],
    exitOnError: false
  });
}

module.exports = logger;