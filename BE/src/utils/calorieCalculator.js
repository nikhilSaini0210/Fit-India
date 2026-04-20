const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2, // Little or no exercise
  light: 1.375, // Light exercise 1-3 days/week
  moderate: 1.55, // Moderate exercise 3-5 days/week
  active: 1.725, // Hard exercise 6-7 days/week
  very_active: 1.9, // Very hard exercise, physical job
};

const GOAL_ADJUSTMENTS = {
  weight_loss: -500, // 500 kcal deficit
  weight_gain: +500, // 500 kcal surplus
  muscle_gain: +300, // Lean bulk
  maintenance: 0,
};

//  Calculate BMR using Mifflin-St Jeor equation
const calculateBMR = (weight, height, age, gender) => {
  // weight in kg, height in cm
  const base = 10 * weight + 6.25 * height - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
};

//  Calculate Total Daily Energy Expenditure
const calculateTDEE = (bmr, activityLevel) => {
  const multiplier =
    ACTIVITY_MULTIPLIERS[activityLevel] || ACTIVITY_MULTIPLIERS.moderate;
  return Math.round(bmr * multiplier);
};

//  Calculate target calories based on goal
const calculateTargetCalories = (tdee, goal) => {
  const adjustment = GOAL_ADJUSTMENTS[goal] || 0;
  return Math.max(1200, tdee + adjustment);
};

//  * Calculate macro split in grams
//  * Protein: 0.8-1g per lb bodyweight, Fat: 25-30% calories, Carbs: remainder
const calculateMacros = (targetCalories, weight, goal) => {
  const weightInLbs = weight * 2.205;

  let proteinGrams;
  if (goal === "muscle_gain" || goal === "weight_loss") {
    proteinGrams = Math.round(weightInLbs * 1.0);
  } else {
    proteinGrams = Math.round(weightInLbs * 0.8);
  }

  const proteinCalories = proteinGrams * 4;
  const fatCalories = Math.round(targetCalories * 0.27);
  const fatGrams = Math.round(fatCalories / 9);
  const carbCalories = targetCalories - proteinCalories - fatCalories;
  const carbGrams = Math.round(carbCalories / 4);

  return {
    calories: targetCalories,
    protein: proteinGrams,
    carbs: carbGrams,
    fat: fatGrams,
  };
};

// Full calculation pipeline
const calculateNutritionTargets = ({
  weight,
  height,
  age,
  gender,
  activityLevel,
  goal,
}) => {
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const targetCalories = calculateTargetCalories(tdee, goal);
  const macros = calculateMacros(targetCalories, weight, goal);

  return {
    bmr: Math.round(bmr),
    tdee,
    ...macros,
  };
};

module.exports = {
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  calculateMacros,
  calculateNutritionTargets,
};
