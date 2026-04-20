const sanitize = require("mongo-sanitize");

const sanitizeObject = (o) => {
  if (!o || typeof o !== "object") return o;

  if (Array.isArray(o)) {
    return o.map((item) => sanitizeObject(item));
  }

  const sanitized = {};
  for (const key in o) {
    if (!Object.prototype.hasOwnProperty.call(o, key)) continue;

    const value = o[key];

    sanitized[key] =
      typeof value === "object" ? sanitizeObject(value) : sanitize(value);
  }

  return sanitized;
};

const sanitizer = (req, res, next) => {
  try {
    if (req.body) {
      req.body = sanitizeObject(req.body);
    }

    if (req.params) {
      req.params = sanitizeObject(req.params);
    }

    if (req.query) {
      req.sanitizedQuery = sanitizeObject(req.query);
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = sanitizer;
