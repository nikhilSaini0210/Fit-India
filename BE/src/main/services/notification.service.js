const { env } = require("../../config/env");
const { getNow } = require("../../helpers/dateHelper");
const MESSAGE_TEMPLATES = require("../../helpers/notificationTemplate");
const Notification = require("../../models/Notification.model");
const User = require("../../models/User.model");
const { getTodaysMeals } = require("./diet.service");

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

  if(!pushSent) {
    try {
        
    } catch (error) {
        
    }
  }
};
