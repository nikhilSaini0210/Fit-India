const DeviceToken = require("../../models/DeviceToken.model");
const logger = require("../../utils/logger");

const normalizeToken = (token) => token?.trim();

const registerToken = async (
  userId,
  ip,
  { fcmToken, deviceId, platform, deviceName, appVersion },
) => {
  fcmToken = normalizeToken(fcmToken);

  const token = await DeviceToken.findOneAndUpdate(
    { userId, deviceId },
    {
      userId,
      fcmToken,
      deviceId,
      platform,
      deviceName,
      appVersion,
      lastIp: ip,
      isActive: true,
      lastUsedAt: new Date(),
      failureCount: 0,
      lastFailureAt: null,
      lastFailureReason: null,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  logger.debug(`Device token registered for user ${userId} [${platform}]`);
  return token;
};

const getActiveTokensForUser = async (userId) => {
  const tokens = await DeviceToken.find({ userId, isActive: true })
    .select("fcmToken platform deviceName deviceId lastIp lastUsedAt")
    .lean();
  return tokens;
};

const getFCMTokenStrings = async (userId) => {
  const tokens = await getActiveTokensForUser(userId);
  return tokens.map((t) => t.fcmToken);
};

const removeDevice = async (userId, deviceId) => {
  await DeviceToken.findOneAndUpdate({ userId, deviceId }, { isActive: false });
};

const removeAllDevices = async (userId) => {
  await DeviceToken.updateMany({ userId }, { isActive: false });

  logger.info(`All devices removed for user ${userId}`);
};

const removeToken = async (userId, fcmToken) => {
  await DeviceToken.findOneAndUpdate({ userId, fcmToken }, { isActive: false });
};

const removeAllTokensForUser = async (userId) => {
  await DeviceToken.updateMany({ userId }, { isActive: false });
  logger.info(`All device tokens deactivated for user ${userId}`);
};

const markTokenFailed = async (fcmToken, reason) => {
  fcmToken = normalizeToken(fcmToken);

  const token = await DeviceToken.findOneAndUpdate(
    { fcmToken },
    {
      $inc: { failureCount: 1 },
      lastFailureAt: new Date(),
      lastFailureReason: reason,
    },
    { new: true },
  );

  if (token && token.failureCount >= 3) {
    await DeviceToken.updateOne({ _id: token._id }, { isActive: false });
    logger.warn(
      `Token auto-deactivated after 3 failures: ...${fcmToken.slice(-8)}`,
    );
  }
};

const markMultipleFailed = async (tokens = [], reason) => {
  if (!tokens.length) return;

  await DeviceToken.updateMany(
    { fcmToken: { $in: tokens } },
    {
      $inc: { failureCount: 1 },
      lastFailureAt: new Date(),
      lastFailureReason: reason,
    },
  );
};

const cleanupStaleTokens = async () => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);

  const result = await DeviceToken.deleteMany({
    $or: [
      { isActive: false, updatedAt: { $lt: cutoff } },
      { failureCount: { $gte: 5 } },
    ],
  });

  logger.info(`Cleaned up ${result.deletedCount} stale device tokens`);
  return result.deletedCount;
};

const getUserDevices = async (userId) => {
  return DeviceToken.find({ userId, isActive: true })
    .select("deviceId deviceName platform lastIp lastUsedAt")
    .lean();
};

module.exports = {
  registerToken,
  getActiveTokensForUser,
  getFCMTokenStrings,
  removeDevice,
  removeAllDevices,
  markTokenFailed,
  markMultipleFailed,
  cleanupStaleTokens,
  getUserDevices,
};
