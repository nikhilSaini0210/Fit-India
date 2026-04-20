const { sendCreated, sendSuccess } = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const authService = require("../services/auth.service");

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return sendCreated(res, result, "Account created successfully");
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return sendSuccess(res, result, "Login successful");
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshTokens(refreshToken);
  return sendSuccess(res, tokens, "Tokens refreshed");
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);
  return sendSuccess(res, {}, "Logged out successfully");
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user._id, currentPassword, newPassword);
  return sendSuccess(res, {}, "Password changed successfully");
});

const getMe = asyncHandler(async (req, res) => {
  return sendSuccess(res, { user: req.user }, "Profile fetched");
});

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  changePassword,
  getMe,
};
