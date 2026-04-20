const User = require("../../models/User.model");
const logger = require("../../utils/logger");
const {
  generateTokenPair,
  verifyRefreshToken,
  hashToken,
  generateResetToken,
} = require("../../utils/tokenUtils");

const buildError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const register = async ({ name, email, phone, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await User.findOne({
    $or: [{ email: normalizedEmail }, { phone }],
  });

  if (existing) {
    throw buildError("Email or phone already registered", 409);
  }

  const user = await User.create({
    name,
    email: normalizedEmail,
    phone,
    password,
  });

  const { accessToken, refreshToken } = generateTokenPair(
    user._id,
    "user",
    user.tokenVersion,
  );

  user.refreshToken = hashToken(refreshToken);
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  logger.info(`New user registered: ${normalizedEmail}`);

  return {
    user: user.toJSON(),
    accessToken,
    refreshToken,
  };
};

const login = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password +refreshToken",
  );

  if (!user || !(await user.comparePassword(password))) {
    throw buildError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw buildError("Account has been deactivated", 403);
  }

  const { accessToken, refreshToken } = generateTokenPair(
    user._id,
    "user",
    user.tokenVersion,
  );

  user.refreshToken = hashToken(refreshToken);
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  logger.info(`User logged in: ${normalizedEmail}`);

  return {
    user: user.toJSON(),
    accessToken,
    refreshToken,
  };
};

const refreshTokens = async (incomingRefreshToken) => {
  let decoded;

  try {
    decoded = verifyRefreshToken(incomingRefreshToken);
  } catch {
    throw buildError("Invalid or expired refresh token", 401);
  }

  const user = await User.findById(decoded.sub).select("+refreshToken");

  if (!user) throw buildError("User not found", 404);

  if (decoded.tv !== user.tokenVersion) {
    throw buildError("Session expired. Please login again.", 401);
  }

  if (user.refreshToken !== hashToken(incomingRefreshToken)) {
    throw buildError("Refresh token mismatch. Please login again.", 401);
  }

  const { accessToken, refreshToken } = generateTokenPair(
    user._id,
    "user",
    user.tokenVersion,
  );
  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    refreshToken: null,
    $inc: { tokenVersion: 1 },
  });
  logger.info(`User logged out: ${userId}`);
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");

  if (!user) throw buildError("User not found", 404);

  if (!(await user.comparePassword(currentPassword))) {
    throw buildError("Current password is incorrect", 400);
  }

  user.password = newPassword;
  user.refreshToken = null;
  user.tokenVersion += 1;
  await user.save();
};

// 🔐 FORGOT PASSWORD (Send Token)
const forgotPassword = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    // don't reveal user existence
    return { message: "If email exists, reset link sent" };
  }

  const resetToken = generateResetToken();
  const hashed = hashToken(resetToken);

  user.resetPasswordToken = hashed;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min

  await user.save({ validateBeforeSave: false });

  // TODO: send email / WhatsApp
  logger.info(`Password reset token generated for ${normalizedEmail}`);

  return { resetToken }; // return only for dev/testing
};

// 🔐 RESET PASSWORD
const resetPassword = async (token, newPassword) => {
  const hashed = hashToken(token);

  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+password tokenVersion");

  if (!user) throw buildError("Invalid or expired reset token", 400);

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // 🔥 logout all sessions
  user.refreshToken = null;
  user.tokenVersion += 1;

  await user.save();
};

module.exports = { register, login, refreshTokens, logout, changePassword };
