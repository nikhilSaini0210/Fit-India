const { default: mongoose } = require("mongoose");
const { buildRuleBasedDayPlan } = require("../../helpers/mealTemplates");
const { buildDietPlanPrompt } = require("../../helpers/promptBuilder");
const DietPlan = require("../../models/DietPlan.model");
const { calculateNutritionTargets } = require("../../utils/calorieCalculator");
const logger = require("../../utils/logger");
const {
  validateDayPlan,
  calculateDayTotals,
} = require("../../utils/validationAndCalculations");
const { chatCompletionJSON } = require("./openai.service");
const dayjs = require("dayjs");

const generateDietPlan = async (
  user,
  { days = 7, useAI = true, title = "My diet plan" },
) => {
  if (days < 1 || days > 30) {
    const err = new Error("Days must be between 1 and 30.");
    err.statusCode = 400;
    throw err;
  }

  if (
    !user?.weight ||
    !user?.height ||
    !user?.age ||
    !user.gender ||
    !user.activityLevel ||
    !user.goal
  ) {
    const err = new Error("Complete your profile first to get diet plan.");
    err.statusCode = 400;
    throw err;
  }

  const targets = calculateNutritionTargets({
    weight: user.weight,
    height: user.height,
    age: user.age,
    gender: user.gender,
    activityLevel: user.activityLevel,
    goal: user.goal,
  });

  let planDays = [];
  let generatedBy = "template";

  if (useAI) {
    try {
      const prompt = buildDietPlanPrompt({ user, targets, days });
      const aiResult = await chatCompletionJSON(prompt, { maxTokens: 3000 });
      planDays = (aiResult.days || []).filter(validateDayPlan);
      if (planDays.length) generatedBy = "ai";
      logger.info(`AI diet plan generated for user ${user._id}`);
    } catch (err) {
      logger.warn(`AI diet failed, falling back to templates: ${err.message}`);
    }
  }

  if (!planDays.length) {
    planDays = Array.from({ length: days }, (_, i) => {
      const dayMeals = buildRuleBasedDayPlan(user.dietType);
      const totalCalories =
        (dayMeals.breakfast?.calories || 0) +
        (dayMeals.morningSnack?.calories || 0) +
        (dayMeals.lunch?.calories || 0) +
        (dayMeals.eveningSnack?.calories || 0) +
        (dayMeals.dinner?.calories || 0);

      return {
        day: i + 1,
        totalCalories,
        meals: {
          breakfast: dayMeals.breakfast,
          lunch: dayMeals.lunch,
          snack: dayMeals.eveningSnack,
          dinner: dayMeals.dinner,
        },
      };
    });
  } else {
    planDays = planDays.map((d, i) => {
      const totals = calculateDayTotals(d.meals);
      return { day: i + 1, ...totals, meals: d.meals };
    });
  }

  const session = await mongoose.startSession();

  let created;

  try {
    await session.withTransaction(async () => {
      await DietPlan.updateMany(
        { userId: user._id, isActive: true },
        { isActive: false },
        { session },
      );

      created = await DietPlan.create(
        [
          {
            title: title,
            userId: user._id,
            days: planDays,
            totalDays: days,
            targetCalories: targets.calories,
            targetProtein: targets.protein,
            targetCarbs: targets.carbs,
            targetFat: targets.fat,
            dietType: user.dietType,
            goal: user.goal,
            generatedBy,
          },
        ],
        { session },
      );
    });
  } finally {
    session.endSession();
  }

  return { plan: created[0], targets };
};

const getActiveDietPlan = async (userId) => {
  const plan = await DietPlan.findOne({ userId, isActive: true }).sort({
    createdAt: -1,
  });
  if (!plan) {
    const err = new Error("No active diet plan found. Please generate one.");
    err.statusCode = 404;
    throw err;
  }
  return plan;
};

const getDietPlanById = async (planId, userId) => {
  const plan = await DietPlan.findOne({ _id: planId, userId });
  if (!plan) {
    const err = new Error("Diet plan not found");
    err.statusCode = 404;
    throw err;
  }
  return plan;
};

const getDietPlanHistory = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [plans, total] = await Promise.all([
    DietPlan.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-days"),
    DietPlan.countDocuments({ userId }),
  ]);
  return { plans, total };
};

const getTodaysMeals = async (userId) => {
  const plan = await getActiveDietPlan(userId);
  const today = dayjs().startOf("day");
  const start = dayjs(plan.startDate).startOf("day");

  const diff = today.diff(start, "day");

  const index = Math.max(0, Math.min(diff, plan.days.length - 1));

  return plan.days[index];
};

module.exports = {
  generateDietPlan,
  getActiveDietPlan,
  getDietPlanById,
  getDietPlanHistory,
  getTodaysMeals,
};
