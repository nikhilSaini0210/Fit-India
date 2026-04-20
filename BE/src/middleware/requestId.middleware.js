const { randomUUID } = require("crypto");

const requestId = (req, res, next) => {
  req.id = randomUUID();
  next();
};

module.exports = requestId;
