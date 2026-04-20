const { default: axios } = require("axios");
const { env } = require("../../config/env");
const logger = require("../../utils/logger");

const sendWhatsAppMessage = async (toPhone, message) => {
  if (!env.whatsapp.phoneId || !env.whatsapp.accessToken) {
    throw new Error("WhatsApp not configured");
  }

  const phone = toPhone.startsWith("91") ? toPhone : `91${toPhone}`;

  const url = `https://graph.facebook.com/v18.0/${env.whatsapp.phoneId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: phone,
    type: "text",
    text: { body: message },
  };

  const response = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${env.whatsapp.accessToken}`,
      "Content-Type": "application/json",
    },
    timeout: 10000,
  });

  return response.data;
};

const sendSMS = async (toPhone, message) => {
  if (!env.msg91.authKey) {
    throw new Error("MSG91 not configured");
  }

  const phone = toPhone.startsWith("91") ? toPhone : `91${toPhone}`;

  const response = await axios.post(
    "https://api.msg91.com/api/v5/flow/",
    {
      template_id: env.msg91.templateId,
      sender: env.msg91.senderId,
      short_url: "0",
      mobiles: phone,
      VAR1: message,
    },
    {
      headers: {
        authkey: env.msg91.authKey,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    },
  );

  return response.data;
};

const sendNotification = async (user, message) => {
  const phone = user.phone;
  if (!phone) {
    logger.warn(`No phone for user ${user._id}, skipping notification`);
    return { channel: "none", status: "skipped" };
  }

  if (user.notifications?.whatsapp) {
    try {
      const result = await sendWhatsAppMessage(phone, message);
      logger.info(`WhatsApp sent to ${phone}`);
      return {
        channel: "whatsapp",
        status: "sent",
        externalId: result?.messages?.[0]?.id,
      };
    } catch (err) {
      logger.warn(
        `WhatsApp failed for ${phone}: ${err.message}. Trying SMS...`,
      );
    }
  }

  if (user.notifications?.sms) {
    try {
      const result = await sendSMS(phone, message);
      logger.info(`SMS sent to ${phone}`);
      return { channel: "sms", status: "sent", externalId: result?.request_id };
    } catch (err) {
      logger.error(`SMS also failed for ${phone}: ${err.message}`);
      return { channel: "sms", status: "failed", error: err.message };
    }
  }

  return { channel: "none", status: "no_channel_enabled" };
};

module.exports = { sendWhatsAppMessage, sendSMS, sendNotification };
