const { sendCreated, sendSuccess } = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const workoutService = require("../services/workout.service");

const generateWorkoutPlan = asyncHandler(async (req, res) => {
  const { days, useAI, title } = req.body;
  const plan = await workoutService.generateWorkoutPlan(req.user, {
    days,
    useAI,
    title,
  });
  return sendCreated(res, { plan }, "Workout plan generated successfully");
});

const getActivePlan = asyncHandler(async (req, res) => {
  const plan = await workoutService.getActiveWorkoutPlan(req.user._id);
  return sendSuccess(res, { plan }, "Active workout plan fetched");
});

const getTodaysWorkout = asyncHandler(async (req, res) => {
  const workout = await workoutService.getTodaysWorkout(req.user._id);
  return sendSuccess(res, { workout }, "Today's workout fetched");
});

const markComplete = asyncHandler(async (req, res) => {
  const { planId, dayNumber } = req.body;
  const plan = await workoutService.markWorkoutComplete(
    req.user._id,
    planId,
    parseInt(dayNumber),
  );
  return sendSuccess(res, { plan }, "Workout marked as complete 🎉");
});

const generateSingleWorkout = asyncHandler(async (req, res) => {
  const { focus, workoutType } = req.query;
  const workout = await workoutService.generateSingleWorkout(req.user, {
    focus,
    workoutType,
  });
  return sendSuccess(res, { workout }, "Workout generated");
});

module.exports = {
  generateWorkoutPlan,
  getActivePlan,
  getTodaysWorkout,
  markComplete,
  generateSingleWorkout,
};
