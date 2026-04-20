const User = require("../../models/User.model");
const { calculateNutritionTargets } = require("../../utils/calorieCalculator");

const buildError = (message, statusCode = 400) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const getUserOrThrow = async (userId, select = "") => {
  const user = await User.findById(userId).select(select).lean();
  if (!user) throw buildError("User not found", 404);
  return user;
};

const getProfile = async (userId) => {
  return await getUserOrThrow(userId);
};

const updateProfile = async (userId, updateData) => {
  const allowedFields = [
    "name",
    "phone",
    "age",
    "gender",
    "weight",
    "height",
    "goal",
    "dietType",
    "activityLevel",
    "fitnessLevel",
    "workoutType",
    "allergies",
    "injuries",
  ];

  const filteredData = Object.keys(updateData)
    .filter((key) => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = updateData[key];
      return obj;
    }, {});

  if (Object.keys(filteredData).length === 0) {
    throw buildError("No valid fields provided for update", 400);
  }

  const user = await User.findById(userId);
  if (!user) throw buildError("User not found", 404);

  Object.assign(user, filteredData);
  await user.save();

  return user;
};

const updateNotificationPreferences = async (userId, prefs) => {
  const allowedFields = ["whatsapp", "sms", "morning", "afternoon", "evening"];

  const filteredPrefs = Object.keys(prefs || {})
    .filter((key) => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[`notifications.${key}`] = prefs[key];
      return obj;
    }, {});

  if (Object.keys(filteredPrefs).length === 0) {
    throw buildError("No valid notification fields provided", 400);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: filteredPrefs },
    { new: true },
  );

  if (!user) throw buildError("User not found", 404);

  return user;
};

const getNutritionTargets = async (userId) => {
  const user = await getUserOrThrow(
    userId,
    "weight height age gender activityLevel goal profileComplete",
  );

  console.log(user);

  if (!user.profileComplete) {
    throw buildError(
      "Complete your profile first to get nutrition targets",
      400,
    );
  }

  return calculateNutritionTargets({
    weight: user.weight,
    height: user.height,
    age: user.age,
    gender: user.gender,
    activityLevel: user.activityLevel,
    goal: user.goal,
  });
};

const deleteAccount = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: false },
    { new: true },
  );

  if (!user) throw buildError("User not found", 404);

  return { success: true };
};

module.exports = {
  getProfile,
  updateProfile,
  updateNotificationPreferences,
  getNutritionTargets,
  deleteAccount,
};
