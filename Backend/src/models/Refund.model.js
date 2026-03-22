import mongoose from "mongoose";

const refundSchema = new mongoose.Schema({
  amount: Number,
  status: { type: String, enum: ["pending", "completed"] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Refund", refundSchema);
