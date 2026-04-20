const {
  getStartOfWeekIST,
  getStartOfMonthIST,
  getISTDay,
  getNow,
  getAnyMonths,
  getAnyYears,
} = require("../../helpers/dateHelper");
const { calculateStreak } = require("../../helpers/streakCalculator");
const ProgressLog = require("../../models/ProgressLog.model");
const { env } = require("../../config/env");

const logProgress = async (userId, data) => {
  const logDate = data.logDate ? new Date(data.logDate) : new Date();
  const logDay = getISTDay(logDate);

  const log = await ProgressLog.findOneAndUpdate(
    { userId, logDay },
    { ...data, userId, logDate, logDay },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return log;
};

const getProgressHistory = async (
  userId,
  { period = "month", page = 1, limit = 30 } = {},
) => {
  let startDate;

  switch (period) {
    case "week":
      startDate = getStartOfWeekIST();
      break;
    case "month":
      startDate = getStartOfMonthIST();
      break;
    case "3months":
      startDate = getAnyMonths(3);
      break;
    case "year":
      startDate = getAnyYears(1);
      break;
  }

  const query = { userId };
  if (startDate) query.logDate = { $gte: startDate };

  const safePage = Math.max(1, parseInt(page));
  const safeLimit = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (safePage - 1) * safeLimit;
  const [logs, total] = await Promise.all([
    ProgressLog.find(query)
      .sort({ logDate: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    ProgressLog.countDocuments(query),
  ]);

  return { logs, total, page: safePage, limit: safeLimit };
};

const getStreak = async (userId) => {
  const logs = await ProgressLog.find({ userId })
    .select("logDate logDay")
    .sort({ logDate: -1 })
    .limit(365)
    .lean();

  if (!logs.length) {
    return { current: 0, longest: 0 };
  }

  const dates = logs.map((l) => l.logDate);
  return calculateStreak(dates);
};

const getProgressSummary = async (userId) => {
  const logs = await ProgressLog.find({ userId })
    .sort({ logDate: 1 })
    .select("weight logDate")
    .lean();

  if (!logs.length) return null;

  const first = logs[0];
  const latest = logs[logs.length - 1];
  const weightChange = parseFloat((latest.weight - first.weight).toFixed(1));

  const streak = await getStreak(userId);

  return {
    totalLogs: logs.length,
    startWeight: first.weight,
    currentWeight: latest.weight,
    weightChange,
    weightTrend:
      weightChange < 0 ? "loss" : weightChange > 0 ? "gain" : "maintained",
    streak,
    lastLogDate: latest.logDate,
  };
};

const getLatestLog = async (userId) => {
  return ProgressLog.findOne({ userId }).sort({ logDate: -1 }).lean();
};

module.exports = {
  logProgress,
  getProgressHistory,
  getStreak,
  getProgressSummary,
  getLatestLog,
};
