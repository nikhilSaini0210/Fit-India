const Joi = require("joi");

const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(60),
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .allow("")
    .optional(),
  age: Joi.number().integer().min(10).max(100),
  gender: Joi.string().valid("male", "female", "other"),
  weight: Joi.number().min(20).max(300),
  height: Joi.number().min(100).max(250),
  goal: Joi.string().valid(
    "weight_loss",
    "weight_gain",
    "muscle_gain",
    "maintenance",
  ),
  dietType: Joi.string().valid("veg", "non_veg", "jain", "vegan"),
  activityLevel: Joi.string().valid(
    "sedentary",
    "light",
    "moderate",
    "active",
    "very_active",
  ),
  fitnessLevel: Joi.string().valid("beginner", "intermediate", "advanced"),
  workoutType: Joi.string().valid("home", "gym"),
  allergies: Joi.array().items(Joi.string()).max(10),
  injuries: Joi.array().items(Joi.string()).max(10),
});

const updateNotificationsSchema = Joi.object({
  whatsapp: Joi.boolean(),
  sms: Joi.boolean(),
  morning: Joi.boolean(),
  afternoon: Joi.boolean(),
  evening: Joi.boolean(),
});

module.exports = { updateProfileSchema, updateNotificationsSchema };
