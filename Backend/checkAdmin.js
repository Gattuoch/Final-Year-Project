import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./src/models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const emailNormalized = String(process.env.SUPER_ADMIN_EMAIL).toLowerCase().trim();
  const user = await User.findOne({ email: emailNormalized });
  console.log("Found user by email:", user ? user.toJSON() : null);
  
  if (user) {
    user.password = String(process.env.SUPER_ADMIN_PASSWORD);
    await user.save();
    console.log("Force updated password for user via models/User.js save hook!");
  }
  process.exit(0);
});
