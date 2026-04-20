const { default: mongoose } = require("mongoose");

const mealItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    prepTime: { type: Number, default: 0 }, // minutes
    ingredients: [{ type: String }],
  },
  {
    _id: false,
  },
);

const dayPlanSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true },
    date: { type: Date },
    totalCalories: { type: Number, default: 0 },
    totalProtein: { type: Number, default: 0 },
    totalCarbs: { type: Number, default: 0 },
    totalFat: { type: Number, default: 0 },
    meals: {
      breakfast: mealItemSchema,
      lunch: mealItemSchema,
      snack: mealItemSchema,
      dinner: mealItemSchema,
    },
  },
  { _id: false },
);

const dietPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, default: "My Diet Plan" },
    days: [dayPlanSchema],
    totalDays: { type: Number, default: 7 },
    targetCalories: { type: Number },
    targetProtein: { type: Number },
    targetCarbs: { type: Number },
    targetFat: { type: Number },
    dietType: {
      type: String,
      enum: ["veg", "non_veg", "jain", "vegan"],
      default: "veg",
    },
    goal: { type: String },
    isActive: { type: Boolean, default: true },
    generatedBy: {
      type: String,
      enum: ["ai", "template", "manual"],
      default: "ai",
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
  },
  { timestamps: true },
);

dietPlanSchema.pre("save", function () {
  if (this.startDate && this.totalDays && !this.endDate) {
    const end = new Date(this.startDate);
    end.setDate(end.getDate() + this.totalDays - 1);
    this.endDate = end;
  }
});

dietPlanSchema.index({ userId: 1, isActive: 1 });
dietPlanSchema.index({ userId: 1, createdAt: -1 });

const DietPlan = mongoose.model("DietPlan", dietPlanSchema);
module.exports = DietPlan;
