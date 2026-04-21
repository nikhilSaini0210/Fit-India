const { env } = require("../../config/env");
const { sendSuccess, sendPaginated } = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const notificationService = require("../services/notification.service");

const sendTestReminder = asyncHandler(async (req, res) => {
  const { type = "morning" } = req.body;
  await notificationService.sendReminderToUser(req.user._id, type);
  return sendSuccess(res, {}, `Test ${type} reminder sent`);
});

const getHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const { notifications, total } =
    await notificationService.getNotificationHistory(
      req.user._id,
      parseInt(page),
      parseInt(limit),
    );
  return sendPaginated(
    res,
    notifications,
    total,
    page,
    limit,
    "Notification history fetched",
  );
});

const verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === env.whatsapp.verifyToken) {
    return res.status(200).send(challenge);
  }
  return res
    .status(403)
    .json({ success: false, message: "Verification failed" });
};

const handleWebhook = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true });

  const body = req.body;
  if (body.object === "whatsapp_business_account") {
    const messages = body.entry?.[0]?.changes?.[0]?.value?.messages || [];
    for (const msg of messages) {
      const from = msg.from;
      const text = msg.text?.body?.toLowerCase() || "";
    }
  }
});

module.exports = { sendTestReminder, getHistory, verifyWebhook, handleWebhook };
