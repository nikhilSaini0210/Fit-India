const { default: mongoose } = require("mongoose");

const progressLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    weight: { type: Number, required: true, min: 20, max: 300 }, // kg
    bodyFat: { type: Number, min: 1, max: 70 }, // optional %
    chest: { type: Number }, // cm measurements
    waist: { type: Number },
    hips: { type: Number },
    arms: { type: Number },
    thighs: { type: Number },
    notes: { type: String, maxlength: 300 },
    mood: {
      type: String,
      enum: ["great", "good", "okay", "tired", "bad"],
    },
    logDate: {
      type: Date,
      required: true,
      index: true,
    },
    logDay: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

progressLogSchema.index({ userId: 1, logDay: 1 }, { unique: true });

const ProgressLog = mongoose.model("ProgressLog", progressLogSchema);

module.exports = ProgressLog;
