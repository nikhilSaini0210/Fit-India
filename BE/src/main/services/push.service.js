const { default: axios } = require("axios");
const { env } = require("../../config/env");
const crypto = require("crypto");
const logger = require("../../utils/logger");

let _cachedAccessToken = null;
let _tokenExpiry = null;

const getFCMAccessToken = async () => {
  if (_cachedAccessToken && _tokenExpiry && Date.now() < _tokenExpiry) {
    return _cachedAccessToken;
  }

  const serviceAccount = JSON.parse(env.fcm.serviceAccountJson);

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
  };

  const jwt = buildJWT(payload, serviceAccount.private_key);

  const response = await axios.post("https://oauth2.googleapis.com/token", {
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: jwt,
  });

  _cachedAccessToken = response.data.access_token;
  _tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;

  return _cachedAccessToken;
};

const buildJWT = (payload, privateKey) => {
  const header = { alg: "RS256", type: "JWT" };
  const encode = (obj) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");

  const signingInput = `${encode(header)}.${encode(payload)}`;

  const sign = crypto.createSign("RSA-SHA256");
  sign.update(signingInput);
  const signature = sign.sign(privateKey, "base64url");

  return `${signingInput}.${signature}`;
};

const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const sendToDevice = async (
  getFCMAccessToken,
  { title, body, data = {}, imageUrl = null } = {},
) => {
  if (!env.fcm.projectId || !env.fcm.serviceAccountJson) {
    throw new Error(
      "FCM not configured — set FCM_PROJECT_ID and FCM_SERVICE_ACCOUNT_JSON in .env",
    );
  }

  const accessToken = await getFCMAccessToken();
  const url = `https://fcm.googleapis.com/v1/projects/${env.fcm.projectId}/messages:send`;

  const message = {
    token: fcmToken,
    notification: {
      title,
      body,
      ...(imageUrl && { image: imageUrl }),
    },
    data: Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, String(v)]),
    ),
    android: {
      priority: "high",
      notification: {
        channel_id: "fitindia_reminders",
        click_action: "FLUTTER_NOTIFICATION_CLICK",
        sound: "default",
      },
    },
    apns: {
      payload: {
        aps: {
          alert: { title, body },
          badge: 1,
          sound: "default",
          "content-available": 1,
        },
      },
      headers: {
        "apns-priority": "10",
        "apns-push-type": "alert",
      },
    },
  };

  const response = await axios.post(
    url,
    { message },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    },
  );

  logger.debug(
    `FCM sent to token ...${fcmToken.slice(-8)}: ${response.data.name}`,
  );
  return { success: true, messageId: response.data.name };
};

const sendToMultipleDevices = async (fcmTokens, notification) => {
  if (!fcmTokens?.length) return { successCount: 0, failureCount: 0 };

  const chunks = chunkArray(fcmTokens, 500);
  let totalSuccess = 0;
  let totalFailure = 0;
  const failures = [];

  for (const chunk of chunks) {
    const results = await Promise.allSettled(
      chunk.map((token) => sendToDevice(token, notification)),
    );

    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        totalSuccess++;
      } else {
        totalFailure++;
        failures.push({ token: chunk[i], error: result.reason?.message });
      }
    });
  }

  if (failures.length) {
    logger.warn(`FCM batch: ${totalFailure} failures`, {
      failures: failures.slice(0, 5),
    });
  }

  return { successCount: totalSuccess, failureCount: totalFailure, failures };
};

const sendToTopic = async (topic, notification) => {
  if (!env.fcm.projectId || !env.fcm.serviceAccountJson) {
    throw new Error("FCM not configured");
  }

  const accessToken = await getFCMAccessToken();
  const url = `https://fcm.googleapis.com/v1/projects/${env.fcm.projectId}/messages:send`;

  const { title, body, data = {}, imageUrl = null } = notification;

  const message = {
    topic,
    notification: {
      title,
      body,
      ...(imageUrl && { image: imageUrl }),
    },
    data: Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, String(v)]),
    ),
    android: { priority: "high" },
    apns: { payload: { aps: { sound: "default", badge: 1 } } },
  };

  const response = await axios.post(
    url,
    { message },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    },
  );

  return { success: true, messageId: response.data.name };
};

module.exports = {
  sendToDevice,
  sendToMultipleDevices,
  sendToTopic,
};
