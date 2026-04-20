const User = require("../models/User.model");
const { sendError } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { verifyAccessToken } = require("../utils/tokenUtils");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return sendError(res, "Authentication required", 401);
  }

  let decoded;

  try {
    decoded = verifyAccessToken(token);
  } catch (error) {
    const message =
      error.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    return sendError(res, message, 401);
  }

  const user = await User.findById(decoded.sub).select(
    "-password -refreshToken",
  );

  if (!user || !user.isActive) {
    return sendError(res, "User not found or deactivated", 401);
  }

  if (decoded.tv !== user.tokenVersion) {
    return sendError(res, "Session expired. Please login again.", 401);
  }

  req.user = user;
  next();
});

const premiumOnly = (req, res, next) => {
  const isActivePremium =
    req.user.isPremium &&
    (!req.user.premiumExpiry || new Date(req.user.premiumExpiry) > new Date());

  if (!isActivePremium) {
    return sendError(res, "This feature requires a premium subscription", 403);
  }

  next();
};

const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendError(res, "You do not have permission for this action", 403);
    }
    next();
  };

const requireCompleteProfile = (req, res, next) => {
  if (!req.user.profileComplete) {
    return sendError(
      res,
      "Please complete your profile (age, gender, weight, height, goal) first",
      400,
    );
  }
  next();
};

module.exports = { protect, premiumOnly, restrictTo, requireCompleteProfile };
