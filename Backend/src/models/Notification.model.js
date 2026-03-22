import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    subject: { type: String },
    body: { type: String },
    meta: { type: mongoose.Schema.Types.Mixed },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
