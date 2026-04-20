const {
  sendCreated,
  sendPaginated,
  sendSuccess,
} = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const progressService = require("../services/progress.service");

const logProgress = asyncHandler(async (req, res) => {
  const log = await progressService.logProgress(req.user._id, req.body);
  return sendCreated(res, { log }, "Progress logged successfully");
});

const getHistory = asyncHandler(async (req, res) => {
  const { period = "month", page = 1, limit = 30 } = req.query;
  const { logs, total } = await progressService.getProgressHistory(
    req.user._id,
    {
      period,
      page: parseInt(page),
      limit: parseInt(limit),
    },
  );
  return sendPaginated(
    res,
    logs,
    total,
    page,
    limit,
    "Progress history fetched",
  );
});

const getSummary = asyncHandler(async (req, res) => {
  const summary = await progressService.getProgressSummary(req.user._id);
  return sendSuccess(res, { summary }, "Progress summary fetched");
});

const getStreak = asyncHandler(async (req, res) => {
  const streak = await progressService.getStreak(req.user._id);
  return sendSuccess(res, { streak }, "Streak fetched");
});

const getLatest = asyncHandler(async (req, res) => {
  const log = await progressService.getLatestLog(req.user._id);
  return sendSuccess(res, { log }, "Latest log fetched");
});

module.exports = { logProgress, getHistory, getSummary, getStreak, getLatest };
