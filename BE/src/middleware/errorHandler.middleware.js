const { env } = require("../config/env");
const logger = require("../utils/logger");

const sanitizeBody = (body) => {
  if (!body) return body;

  const cloned = { ...body };

  ["password", "refreshToken", "token"].forEach((field) => {
    if (cloned[field]) cloned[field] = "***";
  });

  return cloned;
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  if (err.name === "ValidationError") {
    statusCode = 422;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  logger.error(
    `${statusCode} - ${message} - ${req.method} ${req.originalUrl}`,
    {
      requestId: req.id,
      userId: req.user?._id,
      ip: req.ip,
      body: sanitizeBody(req.body),
      stack: env.isProduction ? undefined : err.stack,
    },
  );

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.isProduction ? {} : { stack: err.stack }),
  });
};

const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

module.exports = { errorHandler, notFound };
