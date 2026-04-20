const buildDietPlanPrompt = ({ user, targets, days = 7 }) => {
  const {
    age,
    gender,
    weight,
    height,
    goal,
    dietType,
    activityLevel,
    allergies = [],
  } = user;
  const { calories, protein, carbs, fat } = targets;

  const allergyNote =
    allergies.length > 0 ? `Allergies/Avoid: ${allergies.join(", ")}.` : "";

  const goalLabels = {
    weight_loss: "fat loss",
    weight_gain: "weight gain",
    muscle_gain: "muscle building",
    maintenance: "maintenance",
  };

  return `Generate a ${days}-day Indian ${dietType} diet plan.
 
    User: ${age}yr ${gender}, ${weight}kg, ${height}cm, goal: ${goalLabels[goal] || goal}, activity: ${activityLevel}.
    Daily targets: ${calories} kcal | Protein: ${protein}g | Carbs: ${carbs}g | Fat: ${fat}g.
    ${allergyNote}
    
    Rules:
    - Use common Indian ingredients (roti, dal, paneer, rice, sabzi, etc.)
    - Budget-friendly meals (under ₹150/meal)
    - Include meal timings: Breakfast (7-8am), Lunch (12-1pm), Snack (4pm), Dinner (7-8pm)
    - Each meal must show: name, calories, protein(g), carbs(g), fat(g), prep time (minutes)
    - Vary meals across days, no repetition within 3 days
    
    Return ONLY valid JSON, no explanation:
    {
    "days": [
        {
        "day": 1,
        "totalCalories": 0,
        "meals": {
            "breakfast": { "name": "", "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "prepTime": 0, "ingredients": [] },
            "lunch": { "name": "", "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "prepTime": 0, "ingredients": [] },
            "snack": { "name": "", "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "prepTime": 0, "ingredients": [] },
            "dinner": { "name": "", "calories": 0, "protein": 0, "carbs": 0, "fat": 0, "prepTime": 0, "ingredients": [] }
        }
        }
    ]
  }`;
};

const buildWorkoutPrompt = ({ user, workoutType = "home", days = 7 }) => {
  const {
    age,
    gender,
    weight,
    goal,
    fitnessLevel = "beginner",
    injuries = [],
  } = user;

  const injuryNote =
    injuries.length > 0 ? `Injuries/avoid: ${injuries.join(", ")}.` : "";

  return `Generate a ${days}-day Indian fitness workout plan.
 
    User: ${age}yr ${gender}, ${weight}kg, goal: ${goal}, level: ${fitnessLevel}, type: ${workoutType}.
    ${injuryNote}
    
    Rules:
    - ${workoutType === "home" ? "No equipment. Bodyweight only." : "Standard gym equipment."}
    - Include rest days (at least 2 per week)
    - Provide sets, reps, rest time for each exercise
    - Add warm-up and cooldown for each workout day
    - Estimate calories burned per session
    
    Return ONLY valid JSON:
    {
    "weeklyPlan": [
        {
        "day": 1,
        "type": "workout|rest",
        "focus": "legs|chest|back|shoulders|arms|full_body|cardio|rest",
        "duration": 45,
        "caloriesBurned": 300,
        "warmup": [{ "exercise": "", "duration": "" }],
        "exercises": [{ "exercise": "", "sets": 3, "reps": "12", "rest": 60, "notes": "" }],
        "cooldown": [{ "exercise": "", "duration": "" }]
        }
    ]
  }`;
};

const buildWorkoutSingleDayPrompt = ({ user, focus, workoutType = "home" }) => {
  const { fitnessLevel = "beginner", injuries = [] } = user;
  const injuryNote =
    injuries.length > 0 ? `Avoid: ${injuries.join(", ")}.` : "";

  return `Generate a single ${focus} workout session.
    Level: ${fitnessLevel}, type: ${workoutType}. ${injuryNote}
    ${workoutType === "home" ? "Bodyweight only." : "Gym equipment allowed."}
    
    Return ONLY valid JSON:
    {
    "focus": "${focus}",
    "duration": 45,
    "caloriesBurned": 300,
    "warmup": [{ "exercise": "", "duration": "" }],
    "exercises": [{ "exercise": "", "sets": 3, "reps": "12", "rest": 60, "notes": "" }],
    "cooldown": [{ "exercise": "", "duration": "" }]
  }`;
};

const buildMorningReminderPrompt = ({ userName, dietPlan }) => {
  const breakfast =
    dietPlan?.meals?.breakfast?.name || "a healthy Indian breakfast";
  return `Good morning ${userName}! 🌅 Start your day right with ${breakfast}. Don't forget to drink 2 glasses of water first. Today's plan is ready for you! 💪`;
};

module.exports = {
  buildDietPlanPrompt,
  buildWorkoutPrompt,
  buildWorkoutSingleDayPrompt,
  buildMorningReminderPrompt,
};
