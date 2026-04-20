const { default: rateLimit, ipKeyGenerator } = require("express-rate-limit");
const { sendError } = require("../utils/apiResponse");

const keyGenerator = (req) => {
  if (req.user?._id) {
    return `user:${req.user._id.toString()}`;
  }

  return ipKeyGenerator(req);
};

const createLimiter = (windowMs, max, message) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator,
    handler: (req, res) => sendError(res, message, 429),
  });

// General API limiter: 100 req / 15 min
const apiLimiter = createLimiter(
  15 * 60 * 1000,
  100,
  "Too many requests, please try again later",
);

// Auth routes: 10 attempts / 15 min (prevent brute force)
const authLimiter = createLimiter(
  15 * 60 * 1000,
  10,
  "Too many login attempts. Please try again after 15 minutes",
);

// AI generation: 5 plans / hour (cost control)
const aiLimiter = createLimiter(
  60 * 60 * 1000,
  5,
  "AI generation limit reached. Please try again after an hour",
);

// OTP / verification: 3 attempts / 10 min
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,

  keyGenerator: (req) => {
    if (req.body?.phone) {
      return `otp:${req.body.phone}`;
    }
    return ipKeyGenerator(req);
  },

  handler: (req, res) =>
    sendError(res, "Too many OTP requests. Try again later 10 minutes", 429),
});

// 💎 Premium-aware limiter (dynamic)
const premiumAwareLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: (req) => {
    if (req.user?.isPremium) return 300;
    return 100;
  },

  keyGenerator,

  handler: (req, res) => sendError(res, "Rate limit exceeded", 429),
});

module.exports = {
  apiLimiter,
  authLimiter,
  aiLimiter,
  otpLimiter,
  premiumAwareLimiter,
};
