import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./src/models/User.js";
import bcrypt from "bcryptjs";

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const email = String(process.env.SUPER_ADMIN_EMAIL).toLowerCase().trim();
  const password = String(process.env.SUPER_ADMIN_PASSWORD);
  
  console.log("Testing login for:", email);
  
  const user = await User.findOne({ email });
  if (!user) {
    console.log("❌ User not found!");
    process.exit(1);
  }
  
  console.log("User found. ID:", user._id);
  console.log("User Role:", user.role);
  console.log("User isVerified:", user.isVerified);
  
  const isMatch = await user.matchPassword(password);
  console.log("Password Match result:", isMatch);
  
  if (!isMatch) {
    console.log("Let's test manual bcrypt compare:");
    const manualMatch = await bcrypt.compare(password, user.password);
    console.log("Manual compare result:", manualMatch);
  }

  process.exit(0);
});
