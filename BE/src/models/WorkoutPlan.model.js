const { default: mongoose } = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    exercise: { type: String, required: true },
    sets: { type: Number },
    reps: { type: String },
    rest: { type: Number }, // seconds
    duration: { type: String },
    notes: { type: String },
    muscle: { type: String },
  },
  { _id: false },
);

const warmupCooldownSchema = new mongoose.Schema(
  {
    exercise: { type: String },
    duration: { type: String },
  },
  { _id: false },
);

const workoutDaySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    date: { type: Date },
    type: { type: String, enum: ["workout", "rest"], default: "workout" },
    focus: {
      type: String,
      enum: [
        "chest",
        "back",
        "legs",
        "shoulders",
        "arms",
        "full_body",
        "cardio",
        "rest",
      ],
    },
    duration: { type: Number, default: 45 }, // minutes
    caloriesBurned: { type: Number, default: 0 },
    warmup: [warmupCooldownSchema],
    exercises: [exerciseSchema],
    cooldown: [warmupCooldownSchema],
    isCompleted: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { _id: false },
);

const workoutPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, default: "My Workout Plan" },
    weeklyPlan: [workoutDaySchema],
    totalDays: { type: Number, default: 7 },
    workoutType: { type: String, enum: ["home", "gym"], default: "home" },
    fitnessLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    goal: { type: String },
    isActive: { type: Boolean, default: true },
    generatedBy: { type: String, enum: ["ai", "template"], default: "ai" },
    startDate: { type: Date, default: Date.now },
    weekNumber: { type: Number, default: 1 },
  },
  { timestamps: true },
);

workoutPlanSchema.index({ userId: 1, isActive: 1 });
workoutPlanSchema.index({ userId: 1, createdAt: -1 });

const WorkoutPlan = mongoose.model("WorkoutPlan", workoutPlanSchema);
module.exports = WorkoutPlan;
