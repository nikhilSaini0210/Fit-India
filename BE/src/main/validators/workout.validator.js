const Joi = require("joi");

const generateWorkoutPlanSchema = Joi.object({
  days: Joi.number().integer().min(1).max(30).default(7),
  useAI: Joi.boolean().default(true),
  title: Joi.string().max(100),
});

const singleWorkoutSchema = Joi.object({
  focus: Joi.string().valid(
    "chest",
    "back",
    "legs",
    "shoulders",
    "arms",
    "full_body",
    "cardio",
  ),
  workoutType: Joi.string().valid("home", "gym"),
});

module.exports = { generateWorkoutPlanSchema, singleWorkoutSchema };
