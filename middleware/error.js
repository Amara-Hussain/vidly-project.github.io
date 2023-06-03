const logger = require("../startup/logging");

module.exports = function (err, req, res, next) {
  logger.error(err.message, err);
  const status = res.status ? res.status : 500;
  res.status(status).send("Something Failed!!!!");
};
