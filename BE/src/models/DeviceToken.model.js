const { default: mongoose } = require("mongoose");

const deviceTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fcmToken: {
      type: String,
      required: true,
      unique: true,
    },
    deviceId: {
      type: String,
      required: true,
      trim: true,
    },
    platform: {
      type: String,
      enum: ["android", "ios", "web"],
      required: true,
    },
    deviceName: {
      type: String,
      maxlength: 100,
    },
    appVersion: {
      type: String,
    },
    lastIp: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
    failureCount: {
      type: Number,
      default: 0,
    },
    lastFailureAt: {
      type: Date,
    },
    lastFailureReason: {
      type: String,
    },
  },
  { timestamps: true },
);

deviceTokenSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

deviceTokenSchema.index({ userId: 1, fcmToken: 1 }, { unique: true });

deviceTokenSchema.index({ userId: 1, isActive: 1 });

const DeviceToken = mongoose.model("DeviceToken", deviceTokenSchema);
module.exports = DeviceToken;
