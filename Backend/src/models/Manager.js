import mongoose from "mongoose";

const managerSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  password: String,
  govId: String,
  businessLicense: String,
});

export default mongoose.model("Manager", managerSchema);
