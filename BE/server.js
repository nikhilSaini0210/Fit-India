require("dotenv").config();

const { connectDB, disconnectDB } = require("./src/config/db");
const { validateEnv, env } = require("./src/config/env");
const { connectRedis, disconnectRedis } = require("./src/config/redis");
const logger = require("./src/utils/logger");
const app = require("./src/app");
const {
  startReminderWorker,
  stopReminderWorker,
} = require("./src/queues/reminder.processor");
const { startScheduler, stopScheduler } = require("./src/queues/scheduler");

let server;

const start = async () => {
  validateEnv();

  await connectDB();

  try {
    await connectRedis();
  } catch (error) {
    logger.warn(
      `Redis unavailable: ${err.message}. Queues/reminders disabled.`,
    );
  }

  try {
    startReminderWorker();
    startScheduler();
  } catch (err) {
    logger.warn(`Queue/scheduler init failed: ${err.message}`);
  }

  server = app.listen(env.port, () => {
    logger.info(`🚀 FitIndia API running on port ${env.port} [${env.nodeEnv}]`);
  });
};

const shutdown = async (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);

  stopScheduler();
  await stopReminderWorker();

  if (server) {
    server.close(async () => {
      await disconnectDB();
      await disconnectRedis();
      logger.info("Server closed cleanly");
      process.exit(0);
    });

    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  logger.error(`Unhandled rejection: ${reason}`);
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (err) => {
  logger.error(`Uncaught exception: ${err.message}`);
  shutdown("uncaughtException");
});

start();
