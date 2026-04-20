const Joi = require("joi");

const generateDietPlanSchema = Joi.object({
  days: Joi.number().integer().min(1).max(30).default(7),
  useAI: Joi.boolean().default(true),
  title: Joi.string().max(100),
});

const saveDietPlanSchema = Joi.object({
  title: Joi.string().max(100),
  days: Joi.array().required(),
  targetCalories: Joi.number(),
  targetProtein: Joi.number(),
  targetCarbs: Joi.number(),
  targetFat: Joi.number(),
});

module.exports = { generateDietPlanSchema, saveDietPlanSchema };
