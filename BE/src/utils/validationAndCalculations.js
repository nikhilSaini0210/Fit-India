const validateDayPlan = (day) => {
  if (!day?.meals) return false;

  const required = ["breakfast", "lunch", "snack", "dinner"];

  return required.every(
    (m) => day.meals[m] && typeof day.meals[m].name === "string",
  );
};

const validateWorkoutDay = (day) => {
  if (!day) return false;

  if (day.type === "rest") return true;

  return day.focus && Array.isArray(day.exercises) && day.exercises.length > 0;
};

const calculateDayTotals = (meals) => {
  return Object.values(meals).reduce(
    (acc, m) => {
      acc.totalCalories += m?.calories || 0;
      acc.totalProtein += m?.protein || 0;
      acc.totalCarbs += m?.carbs || 0;
      acc.totalFat += m?.fat || 0;
      return acc;
    },
    { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 },
  );
};

const sleep = async (ms) => new Promise((r) => setTimeout(r, ms));

module.exports = { validateDayPlan, calculateDayTotals, validateWorkoutDay, sleep };
