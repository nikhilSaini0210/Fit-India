const requiredEnvVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "OPENAI_API_KEY",
];

const validateEnv = () => {
  const missing = requiredEnvVars.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
};

module.exports = {
  validateEnv,
  env: {
    port: parseInt(process.env.PORT) || 5000,
    nodeEnv: process.env.NODE_ENV || "development",
    isProduction: process.env.NODE_ENV === "production",

    mongoUri: process.env.MONGO_URI,

    redis: {
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      url: process.env.REDIS_URL,
    },

    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
    },

    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
      baseUrl: process.env.OPENAI_BASE_URL,
    },

    whatsapp: {
      phoneId: process.env.WHATSAPP_PHONE_ID,
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
      verifyToken: process.env.WHATSAPP_VERIFY_TOKEN,
    },

    msg91: {
      authKey: process.env.MSG91_AUTH_KEY,
      senderId: process.env.MSG91_SENDER_ID || "FITAPP",
      templateId: process.env.MSG91_TEMPLATE_ID,
    },

    appName: process.env.APP_NAME || "FitIndia",
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

    reminders: {
      morning: {
        hour: parseInt(process.env.MORNING_REMINDER_HOUR) || 7,
        min: parseInt(process.env.MORNING_REMINDER_MIN) || 0,
      },
      afternoon: {
        hour: parseInt(process.env.AFTERNOON_REMINDER_HOUR) || 13,
        min: parseInt(process.env.AFTERNOON_REMINDER_MIN) || 0,
      },
      evening: {
        hour: parseInt(process.env.EVENING_REMINDER_HOUR) || 18,
        min: parseInt(process.env.EVENING_REMINDER_MIN) || 0,
      },
    },

    timezone: {
      IST: process.env.IST,
    },

    fcm: {
      projectId: process.env.FCM_PROJECT_ID,
      serviceAccountJson: process.env.FCM_SERVICE_ACCOUNT_JSON,
    },
  },
};
