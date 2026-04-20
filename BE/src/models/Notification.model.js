const { default: mongoose } = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["morning", "afternoon", "evening", "custom", "system"],
      required: true,
    },
    channel: {
      type: String,
      enum: ["whatsapp", "sms", "push"],
      required: true,
    },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "sent", "delivered", "failed"],
      default: "pending",
    },
    scheduledAt: { type: Date, required: true },
    sentAt: { type: Date },
    failureReason: { type: String },
    externalId: { type: String }, // WhatsApp/SMS provider message ID
    retryCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

notificationSchema.index({ userId: 1, scheduledAt: 1 });
notificationSchema.index({ status: 1, scheduledAt: 1 });

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
