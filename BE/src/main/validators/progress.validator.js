const Joi = require("joi");

const logProgressSchema = Joi.object({
  weight: Joi.number().min(20).max(300).required(),
  bodyFat: Joi.number().min(1).max(70),
  chest: Joi.number().min(30).max(200),
  waist: Joi.number().min(30).max(200),
  hips: Joi.number().min(30).max(200),
  arms: Joi.number().min(10).max(100),
  thighs: Joi.number().min(20).max(120),
  notes: Joi.string().max(300),
  mood: Joi.string().valid("great", "good", "okay", "tired", "bad"),
  logDate: Joi.date().max("now"),
});

module.exports = { logProgressSchema };
