const winston = require("winston");
require("express-async-errors");
require("winston-mongodb");

const logger = winston.createLogger({
  level: "error",
  transports: [
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "logfile.log" }),
    new winston.transports.MongoDB({
      db: "mongodb://127.0.0.1:27017/project",
      collection: "logs",
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "exceptionError.log" }),
  ],
});

module.exports = logger;
