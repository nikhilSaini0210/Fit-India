const { Queue } = require("bullmq");
const { getBullMQConnection } = require("../config/redis");
const logger = require("../utils/logger");

let reminderQueue = null;

const getReminderQueue = () => {
  if (reminderQueue) return reminderQueue;

  reminderQueue = new Queue("reminders", {
    connection: getBullMQConnection(),
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: { count: 500 },
      removeOnFail: { count: 200 },
    },
  });

  reminderQueue.on("error", (err) => {
    logger.error(`Reminder queue error: ${err.message}`);
  });

  logger.info("Reminder queue initialised");
  return reminderQueue;
};

const enqueueReminder = async (userId, type, delay = 0) => {
  const queue = getReminderQueue();
  const jobId = `${type}-${userId}-${Date.now()}`;
  await queue.add(
    "send-reminder",
    { userId: userId.toString(), type },
    { jobId, delay },
  );
};

const enqueueBroadcast = async (type) => {
  const queue = getReminderQueue();
  await queue.add(
    "broadcast-reminder",
    { type },
    {
      jobId: `broadcast-${type}-${Date.now()}`,
    },
  );
};

module.exports = { getReminderQueue, enqueueReminder, enqueueBroadcast };
