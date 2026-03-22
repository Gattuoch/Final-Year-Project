import mongoose from "mongoose";

const SupportMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const SupportMessage = mongoose.model("SupportMessage", SupportMessageSchema);
export default SupportMessage;
