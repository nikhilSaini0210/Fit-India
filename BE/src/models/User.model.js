const { default: mongoose } = require("mongoose");
const { hashPassword, comparePassword } = require("../utils/tokenUtils");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [60, "Name too long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
      type: String,
      match: [/^(\+91)?[6-9]\d{9}$/, "Invalid Indian mobile number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    age: { type: Number, min: 10, max: 100 },
    gender: { type: String, enum: ["male", "female", "other"] },
    weight: { type: Number, min: 20, max: 300 }, // kg
    height: { type: Number, min: 100, max: 250 }, // cm

    goal: {
      type: String,
      enum: ["weight_loss", "weight_gain", "muscle_gain", "maintenance"],
      default: "maintenance",
    },
    dietType: {
      type: String,
      enum: ["veg", "non_veg", "jain", "vegan"],
      default: "veg",
    },
    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate", "active", "very_active"],
      default: "moderate",
    },
    fitnessLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    workoutType: {
      type: String,
      enum: ["home", "gym"],
      default: "home",
    },
    allergies: [{ type: String }],
    injuries: [{ type: String }],

    notifications: {
      whatsapp: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      morning: { type: Boolean, default: true },
      afternoon: { type: Boolean, default: true },
      evening: { type: Boolean, default: true },
    },

    isPremium: { type: Boolean, default: false },
    premiumExpiry: { type: Date },
    plan: { type: String, enum: ["free", "basic", "premium"], default: "free" },

    refreshToken: { type: String, select: false },
    tokenVersion: {
      type: Number,
      default: 0,
    },

    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },

    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },

    profileComplete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        delete ret.password;
        delete ret.refreshToken;
        delete ret.__v;
        return ret;
      },
    },
  },
);

userSchema.pre("save", function () {
  if (this.phone) {
    let phone = this.phone.replace(/\D/g, "");

    if (phone.length === 10) {
      phone = "+91" + phone;
    } else if (phone.length === 12 && phone.startsWith("91")) {
      phone = "+" + phone;
    }

    this.phone = phone;
  }
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await hashPassword(this.password, 12);
});

userSchema.pre("save", function () {
  this.profileComplete = !!(
    this.age &&
    this.gender &&
    this.weight &&
    this.height &&
    this.goal &&
    this.dietType
  );
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await comparePassword(candidatePassword, this.password);
};

userSchema.methods.isPremiumActive = function () {
  return (
    this.isPremium && (!this.premiumExpiry || this.premiumExpiry > new Date())
  );
};

userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });

const User = mongoose.model("User", userSchema);
module.exports = User;
