const express = require("express");

const workoutController = require("../controllers/workout.controller");
const {
  protect,
  requireCompleteProfile,
} = require("../../middleware/auth.middleware");
const { aiLimiter } = require("../../middleware/rateLimiter.middleware");
const validate = require("../../middleware/validate.middleware");
const {
  generateWorkoutPlanSchema,
  singleWorkoutSchema,
} = require("../validators/workout.validator");

const router = express.Router();

router.use(protect);

router.get("/today", workoutController.getTodaysWorkout);
router.get(
  "/quick",
  validate(singleWorkoutSchema, "query"),
  workoutController.generateSingleWorkout,
); // ?focus=legs&workoutType=home

router.use(requireCompleteProfile);

router.post(
  "/generate",
  aiLimiter,
  validate(generateWorkoutPlanSchema),
  workoutController.generateWorkoutPlan,
);
router.get("/active", workoutController.getActivePlan);
router.patch("/complete", workoutController.markComplete);

module.exports = router;
