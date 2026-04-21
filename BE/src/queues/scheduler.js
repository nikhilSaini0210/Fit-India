const { default: nodeCron } = require("node-cron");
const { env } = require("../config/env");
const logger = require("../utils/logger");
const { enqueueBroadcast } = require("./reminder.queue");
const { cleanupStaleTokens } = require("../main/services/devicetoken.service");

const scheduledJobs = [];

const startScheduler = () => {
  const { morning, afternoon, evening } = env.reminders;

  const morningJob = nodeCron.schedule(
    `${morning.min} ${morning.hour} * * *`,
    async () => {
      logger.info("Scheduling morning reminders...");
      await enqueueBroadcast("morning");
    },
    { timezone: env.timezone.IST },
  );

  const afternoonJob = nodeCron.schedule(
    `${afternoon.min} ${afternoon.hour} * * *`,
    async () => {
      logger.info("Scheduling afternoon reminders...");
      await enqueueBroadcast("afternoon");
    },
    { timezone: env.timezone.IST },
  );

  const eveningJob = nodeCron.schedule(
    `${evening.min} ${evening.hour} * * *`,
    async () => {
      logger.info("Scheduling evening reminders...");
      await enqueueBroadcast("evening");
    },
    { timezone: env.timezone.IST },
  );

  const cleanupJob = nodeCron.schedule(
    "0 3 * * 0",
    async () => {
      logger.info("Running weekly device token cleanup...");
      await cleanupStaleTokens();
    },
    { timezone: env.timezone.IST },
  );

  scheduledJobs.push(morningJob, afternoonJob, eveningJob, cleanupJob);

  logger.info(
    `Scheduler started → Morning: ${morning.hour}:${String(morning.min).padStart(2, "0")} | ` +
      `Afternoon: ${afternoon.hour}:${String(afternoon.min).padStart(2, "0")} | ` +
      `Evening: ${evening.hour}:${String(evening.min).padStart(2, "0")} IST`,
  );
};

const stopScheduler = () => {
  scheduledJobs.forEach((job) => job.stop());
  scheduledJobs.length = 0;
  logger.info("Scheduler stopped");
};

module.exports = { startScheduler, stopScheduler };
