const logger = require("./logger");

const asyncHandler = (fn) => {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      err.requestId = req.id;
      err.userId = req.user?._id;

      logger.error("Async error caught", {
        requestId: req.id,
        userId: req.user?._id,
        message: err.message,
      });

      next(err);
    });
  };
};

module.exports = asyncHandler;
