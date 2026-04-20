const { sendSuccess } = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const userService = require("../services/user.service");

const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user._id);
  return sendSuccess(res, { user }, "Profile fetched");
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  return sendSuccess(res, { user }, "Profile updated successfully");
});

const updateNotifications = asyncHandler(async (req, res) => {
  const user = await userService.updateNotificationPreferences(
    req.user._id,
    req.body,
  );
  return sendSuccess(
    res,
    { notifications: user.notifications },
    "Notification preferences updated",
  );
});

const getNutritionTargets = asyncHandler(async (req, res) => {
  const targets = await userService.getNutritionTargets(req.user._id);
  return sendSuccess(res, { targets }, "Nutrition targets calculated");
});

const deleteAccount = asyncHandler(async (req, res) => {
  await userService.deleteAccount(req.user._id);
  return sendSuccess(res, {}, "Account deactivated");
});

module.exports = {
  getProfile,
  updateProfile,
  updateNotifications,
  getNutritionTargets,
  deleteAccount,
};
