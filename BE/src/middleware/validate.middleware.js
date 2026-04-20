const { sendError } = require("../utils/apiResponse");
const logger = require("../utils/logger");

const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
      convert: true,
    });

    if (error) {
      const errors = error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message.replace(/["]/g, ""),
      }));

      logger.warn("Validation failed", {
        requestId: req.id,
        userId: req.user?._id,
        errors,
        path: req.originalUrl,
      });

      return sendError(res, "Validation failed", 422, errors);
    }

    req[source] = value;
    next();
  };

module.exports = validate;
