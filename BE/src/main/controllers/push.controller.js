const {
  sendError,
  sendCreated,
  sendSuccess,
} = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const deviceTokenService = require("../services/devicetoken.service");
const pushService = require("../services/push.service");

const getIP = (req) =>
  req.headers["x-forwarded-for"]?.split(",")[0] ||
  req.socket?.remoteAddress ||
  req.ip;

const registerToken = asyncHandler(async (req, res) => {
  const { fcmToken, platform, deviceName, appVersion, deviceId } = req.body;

  if (!fcmToken || !platform || !deviceId) {
    return sendError(res, "fcmToken, platform and deviceId are required", 400);
  }

  const ip = getIP(req);

  const token = await deviceTokenService.registerToken(req.user._id, ip, {
    fcmToken,
    platform,
    deviceName,
    appVersion,
    deviceId,
  });

  return sendCreated(
    res,
    { tokenId: token._id },
    "Device registered for push notifications",
  );
});

const removeToken = asyncHandler(async (req, res) => {
  const { fcmToken } = req.body;
  if (!fcmToken) return sendError(res, "fcmToken is required", 400);

  await deviceTokenService.removeToken(req.user._id, fcmToken);
  return sendSuccess(res, {}, "Device token removed");
});

const listDevices = asyncHandler(async (req, res) => {
  const devices = await deviceTokenService.getActiveTokensForUser(req.user._id);
  return sendSuccess(
    res,
    { devices, count: devices.length },
    "Devices fetched",
  );
});

const sendTestPush = asyncHandler(async (req, res) => {
  const {
    title = "Test notification 🔔",
    body = "Push notifications are working!",
  } = req.body;

  const fcmTokens = await deviceTokenService.getFCMTokenStrings(req.user._id);

  if (!fcmTokens.length) {
    return sendError(
      res,
      "No registered devices found. Register a device first.",
      404,
    );
  }

  const result = await pushService.sendToMultipleDevices(fcmTokens, {
    title,
    body,
    data: { screen: "Home", type: "test" },
  });

  return sendSuccess(
    res,
    { sent: result.successCount, failed: result.failureCount },
    `Push sent to ${result.successCount} device(s)`,
  );
});

const sendCustomPush = asyncHandler(async (req, res) => {
  const { userId, title, body, data = {} } = req.body;

  if (!userId || !title || !body) {
    return sendError(res, "userId, title, and body are required", 400);
  }

  const fcmTokens = await deviceTokenService.getFCMTokenStrings(userId);
  if (!fcmTokens.length) {
    return sendError(res, "No active devices for this user", 404);
  }

  const result = await pushService.sendToMultipleDevices(fcmTokens, {
    title,
    body,
    data,
  });

  return sendSuccess(
    res,
    { sent: result.successCount, failed: result.failureCount },
    "Custom push sent",
  );
});

const broadcastPush = asyncHandler(async (req, res) => {
  const { topic = "all_users", title, body, data = {} } = req.body;

  if (!title || !body) {
    return sendError(res, "title and body are required", 400);
  }

  const result = await pushService.sendToTopic(topic, { title, body, data });
  return sendSuccess(res, result, `Broadcast sent to topic: ${topic}`);
});

module.exports = {
  registerToken,
  removeToken,
  listDevices,
  sendTestPush,
  sendCustomPush,
  broadcastPush,
};
