const HOME_WORKOUTS = {
  beginner: {
    warmup: [
      { exercise: "Jumping Jacks", sets: 2, reps: "20", rest: 30 },
      { exercise: "Arm Circles", sets: 2, reps: "15 each side", rest: 20 },
      { exercise: "Leg Swings", sets: 2, reps: "10 each leg", rest: 20 },
    ],
    main: [
      {
        exercise: "Wall Push-ups",
        sets: 3,
        reps: "12-15",
        rest: 60,
        muscle: "chest",
      },
      {
        exercise: "Bodyweight Squats",
        sets: 3,
        reps: "15",
        rest: 60,
        muscle: "legs",
      },
      {
        exercise: "Glute Bridges",
        sets: 3,
        reps: "15",
        rest: 60,
        muscle: "glutes",
      },
      {
        exercise: "Modified Plank",
        sets: 3,
        reps: "20 sec",
        rest: 45,
        muscle: "core",
      },
      {
        exercise: "Standing Calf Raises",
        sets: 3,
        reps: "20",
        rest: 45,
        muscle: "calves",
      },
    ],
    cooldown: [
      { exercise: "Child's Pose", duration: "30 sec" },
      { exercise: "Seated Hamstring Stretch", duration: "30 sec each leg" },
      { exercise: "Shoulder Stretch", duration: "20 sec each side" },
    ],
    duration: 30,
    caloriesBurned: 150,
  },

  intermediate: {
    warmup: [
      { exercise: "High Knees", sets: 2, reps: "30 sec", rest: 20 },
      { exercise: "Hip Circles", sets: 2, reps: "10 each direction", rest: 20 },
      { exercise: "Dynamic Lunges", sets: 2, reps: "10 each leg", rest: 30 },
    ],
    main: [
      {
        exercise: "Push-ups",
        sets: 4,
        reps: "12-15",
        rest: 60,
        muscle: "chest",
      },
      {
        exercise: "Jump Squats",
        sets: 3,
        reps: "15",
        rest: 60,
        muscle: "legs",
      },
      {
        exercise: "Pike Push-ups",
        sets: 3,
        reps: "10",
        rest: 60,
        muscle: "shoulders",
      },
      {
        exercise: "Reverse Lunges",
        sets: 3,
        reps: "12 each leg",
        rest: 60,
        muscle: "legs",
      },
      { exercise: "Plank", sets: 3, reps: "45 sec", rest: 45, muscle: "core" },
      {
        exercise: "Tricep Dips (chair)",
        sets: 3,
        reps: "12",
        rest: 60,
        muscle: "triceps",
      },
      {
        exercise: "Superman Hold",
        sets: 3,
        reps: "10, hold 3 sec",
        rest: 45,
        muscle: "back",
      },
    ],
    cooldown: [
      { exercise: "Downward Dog", duration: "45 sec" },
      { exercise: "Pigeon Pose", duration: "45 sec each side" },
      { exercise: "Cat-Cow Stretch", duration: "1 min" },
    ],
    duration: 45,
    caloriesBurned: 280,
  },

  advanced: {
    warmup: [
      { exercise: "Burpees (slow)", sets: 3, reps: "5", rest: 30 },
      { exercise: "Inchworms", sets: 2, reps: "8", rest: 30 },
      { exercise: "Bear Crawl", sets: 2, reps: "10 steps", rest: 30 },
    ],
    main: [
      {
        exercise: "Decline Push-ups",
        sets: 4,
        reps: "15",
        rest: 45,
        muscle: "chest",
      },
      {
        exercise: "Pistol Squat (assisted)",
        sets: 3,
        reps: "8 each leg",
        rest: 90,
        muscle: "legs",
      },
      {
        exercise: "Diamond Push-ups",
        sets: 4,
        reps: "12",
        rest: 45,
        muscle: "triceps",
      },
      {
        exercise: "Bulgarian Split Squat",
        sets: 3,
        reps: "12 each leg",
        rest: 60,
        muscle: "legs",
      },
      {
        exercise: "Handstand Wall Hold",
        sets: 3,
        reps: "20 sec",
        rest: 60,
        muscle: "shoulders",
      },
      { exercise: "V-ups", sets: 4, reps: "15", rest: 45, muscle: "core" },
      {
        exercise: "Archer Push-ups",
        sets: 3,
        reps: "8 each side",
        rest: 60,
        muscle: "chest",
      },
      {
        exercise: "Burpees",
        sets: 3,
        reps: "10",
        rest: 60,
        muscle: "full_body",
      },
    ],
    cooldown: [
      { exercise: "Full Body Stretch", duration: "2 min" },
      { exercise: "Hip Flexor Stretch", duration: "45 sec each" },
      { exercise: "Thoracic Rotation", duration: "30 sec each side" },
    ],
    duration: 60,
    caloriesBurned: 420,
  },
};

const GYM_WORKOUTS = {
  beginner: {
    chest: [
      { exercise: "Chest Press Machine", sets: 3, reps: "12", rest: 90 },
      { exercise: "Pec Deck (Butterfly)", sets: 3, reps: "12", rest: 90 },
      { exercise: "Incline Dumbbell Press", sets: 3, reps: "10", rest: 90 },
    ],
    back: [
      { exercise: "Lat Pulldown", sets: 3, reps: "12", rest: 90 },
      { exercise: "Seated Cable Row", sets: 3, reps: "12", rest: 90 },
      { exercise: "Back Extension", sets: 3, reps: "12", rest: 60 },
    ],
    legs: [
      { exercise: "Leg Press", sets: 3, reps: "15", rest: 90 },
      { exercise: "Leg Extension", sets: 3, reps: "15", rest: 60 },
      { exercise: "Lying Leg Curl", sets: 3, reps: "15", rest: 60 },
    ],
    shoulders: [
      { exercise: "Shoulder Press Machine", sets: 3, reps: "12", rest: 90 },
      { exercise: "Lateral Raise (light DB)", sets: 3, reps: "15", rest: 60 },
    ],
    arms: [
      { exercise: "Bicep Curl Machine", sets: 3, reps: "12", rest: 60 },
      { exercise: "Tricep Pushdown", sets: 3, reps: "12", rest: 60 },
    ],
    caloriesBurned: 300,
    duration: 60,
  },

  intermediate: {
    chest: [
      { exercise: "Flat Bench Press", sets: 4, reps: "10-12", rest: 90 },
      { exercise: "Incline Dumbbell Press", sets: 4, reps: "10", rest: 90 },
      { exercise: "Cable Crossover", sets: 3, reps: "12", rest: 60 },
      { exercise: "Dips", sets: 3, reps: "10-12", rest: 90 },
    ],
    back: [
      { exercise: "Deadlift", sets: 4, reps: "8", rest: 120 },
      { exercise: "Pull-ups", sets: 4, reps: "8-10", rest: 90 },
      { exercise: "Bent-Over Barbell Row", sets: 4, reps: "10", rest: 90 },
      { exercise: "Face Pulls", sets: 3, reps: "15", rest: 60 },
    ],
    legs: [
      { exercise: "Barbell Squat", sets: 4, reps: "10", rest: 120 },
      { exercise: "Romanian Deadlift", sets: 3, reps: "12", rest: 90 },
      { exercise: "Walking Lunges", sets: 3, reps: "12 each", rest: 90 },
      { exercise: "Calf Raises", sets: 4, reps: "20", rest: 60 },
    ],
    caloriesBurned: 450,
    duration: 75,
  },

  advanced: {
    chest: [
      { exercise: "Weighted Dips", sets: 4, reps: "8-10", rest: 120 },
      { exercise: "Flat Bench Press (heavy)", sets: 5, reps: "5", rest: 180 },
      { exercise: "Incline Dumbbell Flyes", sets: 4, reps: "12", rest: 90 },
      { exercise: "Decline Bench Press", sets: 3, reps: "10", rest: 90 },
    ],
    back: [
      { exercise: "Conventional Deadlift", sets: 5, reps: "5", rest: 180 },
      { exercise: "Weighted Pull-ups", sets: 4, reps: "8", rest: 120 },
      { exercise: "T-Bar Row", sets: 4, reps: "10", rest: 90 },
      { exercise: "Meadows Row", sets: 3, reps: "12", rest: 90 },
    ],
    legs: [
      { exercise: "Barbell Back Squat (heavy)", sets: 5, reps: "5", rest: 180 },
      {
        exercise: "Bulgarian Split Squat (weighted)",
        sets: 4,
        reps: "10 each",
        rest: 90,
      },
      { exercise: "Hack Squat", sets: 4, reps: "12", rest: 90 },
      { exercise: "Seated Calf Raises", sets: 5, reps: "15", rest: 60 },
    ],
    caloriesBurned: 550,
    duration: 90,
  },
};

const WEEKLY_SPLITS = {
  beginner: [
    "Full Body",
    "Rest",
    "Full Body",
    "Rest",
    "Full Body",
    "Light Walk",
    "Rest",
  ],
  intermediate: ["Push", "Pull", "Legs", "Rest", "Push", "Pull", "Legs"],
  advanced: ["Chest", "Back", "Legs", "Shoulders", "Arms", "Full Body", "Rest"],
};

const getWorkoutTemplate = (
  type = "home",
  level = "beginner",
  focus = null,
) => {
  if (type === "home") {
    return HOME_WORKOUTS[level] || HOME_WORKOUTS.beginner;
  }
  const gymLevel = GYM_WORKOUTS[level] || GYM_WORKOUTS.beginner;
  if (focus && gymLevel[focus]) {
    return {
      exercises: gymLevel[focus],
      caloriesBurned: gymLevel.caloriesBurned,
      duration: gymLevel.duration,
    };
  }

  return gymLevel;
};

module.exports = {
  HOME_WORKOUTS,
  GYM_WORKOUTS,
  WEEKLY_SPLITS,
  getWorkoutTemplate,
};
