const express = require("express");

const dietController = require("../controllers/diet.controller");
const {
  protect,
  requireCompleteProfile,
} = require("../../middleware/auth.middleware");
const { aiLimiter } = require("../../middleware/rateLimiter.middleware");
const { generateDietPlanSchema } = require("../validators/diet.validator");
const validate = require("../../middleware/validate.middleware");

const router = express.Router();

router.use(protect);

router.get("/today", dietController.getTodaysMeals);

router.use(requireCompleteProfile);

router.post(
  "/generate",
  aiLimiter,
  validate(generateDietPlanSchema),
  dietController.generateDietPlan,
);
router.get("/active", dietController.getActivePlan);
router.get("/history", dietController.getPlanHistory);
router.get("/:id", dietController.getPlanById);

module.exports = router;
