const { env } = require("../../config/env");
const { getNow } = require("../../helpers/dateHelper");
const MESSAGE_TEMPLATES = require("../../helpers/notificationTemplate");
const Notification = require("../../models/Notification.model");
const User = require("../../models/User.model");
const logger = require("../../utils/logger");
const { sleep } = require("../../utils/validationAndCalculations");
const {
  getFCMTokenStrings,
  markTokenFailed,
} = require("./devicetoken.service");
const { getTodaysMeals } = require("./diet.service");
const { sendToMultipleDevices } = require("./push.service");
const { sendNotification } = require("./whatsapp.service");

const IST = env.timezone.IST;

const sendReminderToUser = async (userId, type) => {
  const user = await User.findById(userId);
  if (!user || !user.isActive) return;
  if (!user.notifications?.[type]) return;

  let meals = null;

  if (type === "morning" || type === "afternoon") {
    try {
      meals = await getTodaysMeals(userId);
    } catch {
      // Plan may not exist yet; proceed without meal detail
    }
  }

  const message =
    MESSAGE_TEMPLATES[type]?.(user, meals) ||
    `Hi ${user.name}! Don't forget your ${type} routine 💪`;

  const scheduledAt = getNow().toDate();

  const notification = await Notification.create({
    userId,
    type,
    channel: user.notifications?.whatsapp ? "whatsapp" : "sms",
    message,
    scheduledAt,
    status: "pending",
  });

  const pushSent = false;

  try {
    const fcmTokens = await getFCMTokenStrings(userId);
    if (fcmTokens.length > 0) {
      const pushPayload = buildPushPayload(type, message, user);

      const result = await sendToMultipleDevices(fcmTokens, pushPayload);

      if (result.failures?.length) {
        await Promise.allSettled(
          result.failures.map((f) => markTokenFailed(f.token, f.error)),
        );
      }

      if (result.successCount > 0) {
        pushSent = true;
        await Notification.findByIdAndUpdate(notification._id, {
          status: "sent",
          sentAt: new Date(),
          channel: "push",
        });

        logger.info(
          `Push sent to ${result.successCount} device(s) for user ${userId}`,
        );
      }
    }
  } catch (err) {
    logger.warn(`Push failed for user ${userId}: ${err.message}`);
  }

  if (!pushSent) {
    try {
      const result = await sendNotification(user, message);

      await Notification.findByIdAndUpdate(notification._id, {
        status: result.status === "sent" ? "sent" : "failed",
        sentAt: new Date(),
        channel: result.channel,
        externalId: result.externalId,
        failureReason: result.error,
      });
      logger.info(
        `${type} reminder ${result.status} for user ${userId} via ${result.channel}`,
      );
    } catch (err) {
      await Notification.findByIdAndUpdate(notification._id, {
        status: "failed",
        failureReason: err.message,
      });
      logger.error(`All channels failed for user ${userId}: ${err.message}`);
    }
  }
};

const broadcastReminder = async (type) => {
  const users = await User.find({
    isActive: true,
    [`notifications.${type}`]: true,
    $or: [{ "notifications.whatsapp": true }, { "notifications.sms": true }],
    phone: { $exists: true, $ne: null },
  }).select("_id");

  logger.info(`Broadcasting ${type} reminders to ${users.length} users`);

  const batchSize = 50;

  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);

    await Promise.allSettled(batch.map((u) => sendReminderToUser(u._id, type)));
    if (i + batchSize < users.length) {
      await sleep(2000);
    }
  }
};

const getNotificationHistory = async (userId, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [notifications, total] = await Promise.all([
    Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments({ userId }),
  ]);
  return { notifications, total };
};

const buildPushPayload = (type, message, user) => {
  const configs = {
    morning: {
      title: `Good morning, ${user.name.split(" ")[0]}! 🌅`,
      body: "Your breakfast plan and today's goals are ready.",
      data: { screen: "DietToday", type: "morning" },
    },
    afternoon: {
      title: "Lunch time! 🥗",
      body: "Check today's lunch plan and stay on track.",
      data: { screen: "DietToday", type: "afternoon" },
    },
    evening: {
      title: "Workout time! 💪",
      body: "Your evening workout is waiting. Let's go!",
      data: { screen: "WorkoutToday", type: "evening" },
    },
    custom: {
      title: `${user.name.split(" ")[0]}, you have a new update`,
      body: message,
      data: { screen: "Home", type: "custom" },
    },
  };

  return configs[type] || configs.custom;
};

module.exports = {
  sendReminderToUser,
  broadcastReminder,
  getNotificationHistory,
};
