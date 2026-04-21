const { Worker } = require("bullmq");
const logger = require("../utils/logger");
const {
  sendReminderToUser,
  broadcastReminder,
} = require("../main/services/notification.service");
const { getBullMQConnection } = require("../config/redis");

let worker = null;

const startReminderWorker = () => {
  if (worker) return worker;

  worker = new Worker(
    "reminders",
    async (job) => {
      const { name, data } = job;

      if (name === "send-reminder") {
        logger.debug(
          `Processing reminder job: ${data.type} for user ${data.userId}`,
        );
        await sendReminderToUser(data.userId, data.type);
      } else if (name === "broadcast-reminder") {
        logger.info(`Processing broadcast: ${data.type}`);
        await broadcastReminder(data.type);
      }
    },
    {
      connection: getBullMQConnection(),
      concurrency: 10,
      limiter: {
        max: 50,
        duration: 1000,
      },
    },
  );

  worker.on("completed", (job) => {
    logger.debug(`Job ${job.id} (${job.name}) completed`);
  });

  worker.on("failed", (job, err) => {
    logger.error(`Job ${job?.id} (${job?.name}) failed: ${err.message}`);
  });

  worker.on("error", (err) => {
    logger.error(`Worker error: ${err.message}`);
  });

  logger.info("Reminder worker started");
  return worker;
};

const stopReminderWorker = async () => {
  if (worker) {
    await worker.close();
    worker = null;
    logger.info("Reminder worker stopped");
  }
};

module.exports = { startReminderWorker, stopReminderWorker };
