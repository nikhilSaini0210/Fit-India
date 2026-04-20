const { default: mongoose } = require("mongoose");
const {
  buildWorkoutPrompt,
  buildWorkoutSingleDayPrompt,
} = require("../../helpers/promptBuilder");
const {
  WEEKLY_SPLITS,
  getWorkoutTemplate,
} = require("../../helpers/workoutTemplates");
const WorkoutPlan = require("../../models/WorkoutPlan.model");
const logger = require("../../utils/logger");
const { chatCompletionJSON } = require("./openai.service");
const dayjs = require("dayjs");
const { validateWorkoutDay } = require("../../utils/validationAndCalculations");

const generateWorkoutPlan = async (
  user,
  { days = 7, useAI = true, title = "My Workout Plan" },
) => {
  if (days < 1 || days > 30) {
    const err = new Error("Days must be between 1 and 30.");
    err.statusCode = 400;
    throw err;
  }

  const { fitnessLevel = "beginner", workoutType = "home", goal } = user;

  let weeklyPlan = [];
  let generatedBy = "template";

  if (useAI) {
    try {
      const prompt = buildWorkoutPrompt({ user, workoutType, days });
      const aiResult = await chatCompletionJSON(prompt, { maxTokens: 3000 });
      weeklyPlan = (aiResult?.weeklyPlan || []).filter(validateWorkoutDay);
      if (weeklyPlan.length) generatedBy = "ai";
      logger.info(`AI workout plan generated for user ${user._id}`);
    } catch (err) {
      logger.warn(
        `AI workout failed, falling back to templates: ${err.message}`,
      );
    }
  }

  if (!weeklyPlan.length) {
    const split = WEEKLY_SPLITS[fitnessLevel] || WEEKLY_SPLITS.beginner;

    weeklyPlan = split.slice(0, days).map((focus, i) => {
      if (focus.toLowerCase().includes("rest")) {
        return {
          day: i + 1,
          type: "rest",
          focus: "rest",
          exercises: [],
          duration: 0,
          caloriesBurned: 0,
        };
      }

      const focusKey = focus.toLowerCase().replace(" ", "_");
      const template = getWorkoutTemplate(workoutType, fitnessLevel, focusKey);
      const exercises = Array.isArray(template)
        ? template
        : template.main || template.exercises || [];

      return {
        day: i + 1,
        type: "workout",
        focus: focusKey,
        duration: template.duration || 45,
        caloriesBurned: template.caloriesBurned || 300,
        warmup: template.warmup || [],
        exercises,
        cooldown: template.cooldown || [],
      };
    });
  }

  const session = await mongoose.startSession();
  let plan;

  try {
    await session.withTransaction(async () => {
      await WorkoutPlan.updateMany(
        { userId: user._id, isActive: true },
        { isActive: false },
        { session },
      );

      const created = await WorkoutPlan.create(
        [
          {
            title,
            userId: user._id,
            weeklyPlan,
            totalDays: days,
            workoutType,
            fitnessLevel,
            goal,
            generatedBy,
          },
        ],
        { session },
      );

      plan = created[0];
    });
  } finally {
    session.endSession();
  }

  return plan;
};

const getActiveWorkoutPlan = async (userId) => {
  const plan = await WorkoutPlan.findOne({ userId, isActive: true }).sort({
    createdAt: -1,
  });
  if (!plan) {
    const err = new Error("No active workout plan found. Please generate one.");
    err.statusCode = 404;
    throw err;
  }
  return plan;
};

const getTodaysWorkout = async (userId) => {
  const plan = await getActiveWorkoutPlan(userId);
  const today = dayjs().startOf("day");
  const start = dayjs(plan.startDate).startOf("day");

  const diff = today.diff(start, "day");

  const index = Math.max(0, Math.min(diff, plan.weeklyPlan.length - 1));

  return plan.weeklyPlan[index];
};

const markWorkoutComplete = async (userId, planId, dayNumber) => {
  const plan = await WorkoutPlan.findOne({ _id: planId, userId });
  if (!plan) {
    const err = new Error("Workout plan not found");
    err.statusCode = 404;
    throw err;
  }

  const day = plan.weeklyPlan.find((d) => d.day === dayNumber);

  if (!day) {
    const err = new Error("Invalid day number");
    err.statusCode = 400;
    throw err;
  }

  if (day.isCompleted) {
    return plan;
  }

  day.isCompleted = true;
  day.completedAt = new Date();
  await plan.save();

  return plan;
};

const generateSingleWorkout = async (user, { focus, workoutType }) => {
  if (!focus) {
    const err = new Error("Focus is required");
    err.statusCode = 400;
    throw err;
  }

  let workout = null;

  try {
    const prompt = buildWorkoutSingleDayPrompt({ user, focus, workoutType });
    const ai = await chatCompletionJSON(prompt, { maxTokens: 1500 });
    if (validateWorkoutDay(ai)) {
      workout = ai;
    }
  } catch (err) {
    logger.warn(`Single workout AI failed: ${err.message}`);
    const template = getWorkoutTemplate(
      workoutType || user.workoutType,
      user.fitnessLevel,
      focus,
    );
    workout = {
      focus,
      duration: template.duration || 45,
      caloriesBurned: template.caloriesBurned || 300,
      exercises: Array.isArray(template)
        ? template
        : template.main || template.exercises || [],
      warmup: template.warmup || [],
      cooldown: template.cooldown || [],
    };
  }

  return workout;
};

module.exports = {
  generateWorkoutPlan,
  getActiveWorkoutPlan,
  getTodaysWorkout,
  markWorkoutComplete,
  generateSingleWorkout,
};
