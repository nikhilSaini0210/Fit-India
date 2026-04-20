const BREAKFAST = {
  veg: [
    {
      name: "Poha",
      calories: 250,
      protein: 5,
      carbs: 45,
      fat: 6,
      prepTime: 15,
    },
    {
      name: "Upma",
      calories: 280,
      protein: 8,
      carbs: 48,
      fat: 7,
      prepTime: 20,
    },
    {
      name: "Idli Sambar (4 pieces)",
      calories: 320,
      protein: 10,
      carbs: 60,
      fat: 4,
      prepTime: 10,
    },
    {
      name: "Besan Chilla (2 pieces)",
      calories: 290,
      protein: 14,
      carbs: 38,
      fat: 8,
      prepTime: 15,
    },
    {
      name: "Moong Dal Cheela",
      calories: 260,
      protein: 16,
      carbs: 35,
      fat: 5,
      prepTime: 20,
    },
    {
      name: "Oats Upma",
      calories: 240,
      protein: 9,
      carbs: 40,
      fat: 5,
      prepTime: 10,
    },
    {
      name: "Paratha (1) + Curd",
      calories: 380,
      protein: 10,
      carbs: 55,
      fat: 14,
      prepTime: 20,
    },
    {
      name: "Dosa + Sambar",
      calories: 300,
      protein: 9,
      carbs: 52,
      fat: 6,
      prepTime: 10,
    },
    {
      name: "Uttapam (2)",
      calories: 330,
      protein: 10,
      carbs: 58,
      fat: 7,
      prepTime: 15,
    },
    {
      name: "Sprouted Moong Salad",
      calories: 180,
      protein: 12,
      carbs: 28,
      fat: 2,
      prepTime: 10,
    },
  ],
  non_veg: [
    {
      name: "Egg Bhurji (3 eggs) + Toast",
      calories: 360,
      protein: 22,
      carbs: 35,
      fat: 16,
      prepTime: 10,
    },
    {
      name: "Boiled Eggs (3) + Poha",
      calories: 400,
      protein: 24,
      carbs: 40,
      fat: 14,
      prepTime: 15,
    },
    {
      name: "Omelette (2 egg) + Roti",
      calories: 370,
      protein: 20,
      carbs: 40,
      fat: 14,
      prepTime: 10,
    },
    {
      name: "Chicken Sandwich",
      calories: 420,
      protein: 30,
      carbs: 42,
      fat: 10,
      prepTime: 10,
    },
  ],
  jain: [
    {
      name: "Poha (no onion)",
      calories: 220,
      protein: 4,
      carbs: 42,
      fat: 5,
      prepTime: 15,
    },
    {
      name: "Sabudana Khichdi",
      calories: 300,
      protein: 5,
      carbs: 58,
      fat: 7,
      prepTime: 20,
    },
    {
      name: "Makhana Kheer",
      calories: 260,
      protein: 8,
      carbs: 46,
      fat: 5,
      prepTime: 15,
    },
    {
      name: "Fruit Salad + Milk",
      calories: 220,
      protein: 7,
      carbs: 40,
      fat: 4,
      prepTime: 5,
    },
  ],
};

const LUNCH = {
  veg: [
    {
      name: "2 Roti + Dal Tadka + Sabzi",
      calories: 480,
      protein: 18,
      carbs: 72,
      fat: 12,
      prepTime: 30,
    },
    {
      name: "Rajma Chawal",
      calories: 520,
      protein: 20,
      carbs: 88,
      fat: 8,
      prepTime: 30,
    },
    {
      name: "Chole + 2 Roti",
      calories: 500,
      protein: 18,
      carbs: 78,
      fat: 12,
      prepTime: 30,
    },
    {
      name: "Dal Makhani + Rice + Salad",
      calories: 560,
      protein: 18,
      carbs: 84,
      fat: 16,
      prepTime: 30,
    },
    {
      name: "Palak Paneer + 2 Roti",
      calories: 520,
      protein: 22,
      carbs: 55,
      fat: 22,
      prepTime: 30,
    },
    {
      name: "Mixed Veg Curry + Rice",
      calories: 440,
      protein: 12,
      carbs: 76,
      fat: 10,
      prepTime: 25,
    },
    {
      name: "Kadhi Chawal",
      calories: 460,
      protein: 12,
      carbs: 80,
      fat: 10,
      prepTime: 30,
    },
    {
      name: "Baingan Bharta + Roti",
      calories: 420,
      protein: 10,
      carbs: 62,
      fat: 14,
      prepTime: 30,
    },
  ],
  non_veg: [
    {
      name: "Chicken Curry + 2 Roti + Salad",
      calories: 580,
      protein: 38,
      carbs: 52,
      fat: 20,
      prepTime: 35,
    },
    {
      name: "Egg Curry + Rice",
      calories: 520,
      protein: 28,
      carbs: 72,
      fat: 16,
      prepTime: 25,
    },
    {
      name: "Fish Fry + Dal + Rice",
      calories: 560,
      protein: 40,
      carbs: 68,
      fat: 16,
      prepTime: 30,
    },
    {
      name: "Mutton Curry + Rice",
      calories: 620,
      protein: 42,
      carbs: 70,
      fat: 22,
      prepTime: 45,
    },
  ],
  jain: [
    {
      name: "2 Roti + Dal + Capsicum Sabzi",
      calories: 460,
      protein: 16,
      carbs: 70,
      fat: 11,
      prepTime: 30,
    },
    {
      name: "Paneer Bhurji + Roti",
      calories: 500,
      protein: 24,
      carbs: 52,
      fat: 20,
      prepTime: 20,
    },
    {
      name: "Khichdi + Ghee",
      calories: 420,
      protein: 14,
      carbs: 72,
      fat: 12,
      prepTime: 25,
    },
  ],
};

const DINNER = {
  veg: [
    {
      name: "Khichdi + Curd",
      calories: 380,
      protein: 14,
      carbs: 66,
      fat: 8,
      prepTime: 25,
    },
    {
      name: "Dal Soup + 1 Roti",
      calories: 300,
      protein: 14,
      carbs: 48,
      fat: 6,
      prepTime: 20,
    },
    {
      name: "Paneer Bhurji + 1 Roti",
      calories: 420,
      protein: 20,
      carbs: 40,
      fat: 20,
      prepTime: 20,
    },
    {
      name: "Moong Dal + Rice",
      calories: 360,
      protein: 16,
      carbs: 62,
      fat: 6,
      prepTime: 25,
    },
    {
      name: "Lauki Sabzi + 2 Roti",
      calories: 340,
      protein: 10,
      carbs: 58,
      fat: 8,
      prepTime: 25,
    },
    {
      name: "Vegetable Soup + Multigrain Roti",
      calories: 280,
      protein: 8,
      carbs: 48,
      fat: 6,
      prepTime: 20,
    },
  ],
  non_veg: [
    {
      name: "Grilled Chicken + Salad",
      calories: 380,
      protein: 40,
      carbs: 15,
      fat: 16,
      prepTime: 30,
    },
    {
      name: "Egg Bhurji + 1 Roti",
      calories: 380,
      protein: 22,
      carbs: 40,
      fat: 16,
      prepTime: 15,
    },
    {
      name: "Fish Tikka + Salad",
      calories: 340,
      protein: 36,
      carbs: 12,
      fat: 14,
      prepTime: 30,
    },
  ],
  jain: [
    {
      name: "Khichdi + Curd",
      calories: 360,
      protein: 12,
      carbs: 62,
      fat: 8,
      prepTime: 25,
    },
    {
      name: "Lauki Soup + Roti",
      calories: 280,
      protein: 8,
      carbs: 48,
      fat: 6,
      prepTime: 20,
    },
    {
      name: "Sabudana Khichdi",
      calories: 300,
      protein: 5,
      carbs: 58,
      fat: 7,
      prepTime: 20,
    },
  ],
};

const SNACKS = {
  veg: [
    { name: "Roasted Chana", calories: 150, protein: 8, carbs: 20, fat: 3 },
    {
      name: "Makhana (Fox nuts)",
      calories: 120,
      protein: 4,
      carbs: 20,
      fat: 1,
    },
    {
      name: "Banana + Peanut Butter",
      calories: 200,
      protein: 6,
      carbs: 30,
      fat: 8,
    },
    { name: "Curd + Fruits", calories: 180, protein: 8, carbs: 28, fat: 3 },
    { name: "Sprouts Chaat", calories: 160, protein: 10, carbs: 24, fat: 2 },
    { name: "Buttermilk (Chaas)", calories: 80, protein: 4, carbs: 10, fat: 2 },
  ],
  non_veg: [
    { name: "Boiled Egg (2)", calories: 140, protein: 12, carbs: 1, fat: 10 },
    {
      name: "Chicken Tikka (small)",
      calories: 200,
      protein: 24,
      carbs: 5,
      fat: 8,
    },
  ],
  jain: [
    { name: "Makhana", calories: 120, protein: 4, carbs: 20, fat: 1 },
    { name: "Dry Fruits Mix", calories: 180, protein: 5, carbs: 15, fat: 12 },
  ],
};

const getRandomMeal = (mealType, dietType = "veg") => {
  const templates = {
    breakfast: BREAKFAST,
    lunch: LUNCH,
    dinner: DINNER,
    snack: SNACKS,
  };

  const mealGroup = templates[mealType];
  if (!mealGroup) {
    return null;
  }

  const options = mealGroup[dietType] || mealGroup.veg;

  return options[Math.floor(Math.random() * options.length)];
};

const buildRuleBasedDayPlan = (dietType = "veg") => {
  return {
    breakfast: getRandomMeal("breakfast", dietType),
    morningSnack: getRandomMeal("snack", dietType),
    lunch: getRandomMeal("lunch", dietType),
    eveningSnack: getRandomMeal("snack", dietType),
    dinner: getRandomMeal("dinner", dietType),
  };
};

module.exports = {
  BREAKFAST,
  LUNCH,
  DINNER,
  SNACKS,
  getRandomMeal,
  buildRuleBasedDayPlan,
};
