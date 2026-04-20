const {
  sendCreated,
  sendSuccess,
  sendPaginated,
} = require("../../utils/apiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const dietService = require("../services/diet.service");

const generateDietPlan = asyncHandler(async (req, res) => {
  const { days, useAI, title } = req.body;
  const result = await dietService.generateDietPlan(req.user, {
    days,
    useAI,
    title,
  });
  return sendCreated(res, result, "Diet plan generated successfully");
});

const getActivePlan = asyncHandler(async (req, res) => {
  const plan = await dietService.getActiveDietPlan(req.user._id);
  return sendSuccess(res, { plan }, "Active diet plan fetched");
});

const getPlanById = asyncHandler(async (req, res) => {
  const plan = await dietService.getDietPlanById(req.params.id, req.user._id);
  return sendSuccess(res, { plan }, "Diet plan fetched");
});

const getPlanHistory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { plans, total } = await dietService.getDietPlanHistory(
    req.user._id,
    page,
    limit,
  );
  return sendPaginated(
    res,
    plans,
    total,
    page,
    limit,
    "Diet plan history fetched",
  );
});

const getTodaysMeals = asyncHandler(async (req, res) => {
  const meals = await dietService.getTodaysMeals(req.user._id);
  return sendSuccess(res, { meals }, "Today's meals fetched");
});

module.exports = {
  generateDietPlan,
  getActivePlan,
  getPlanById,
  getPlanHistory,
  getTodaysMeals,
};
