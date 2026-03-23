import mongoose from "mongoose";
import User from "./src/models/User.model.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/final-year-project", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  const user = await User.findOne({ email: "gchambang56@mail.com" }).select("+passwordHash");
  if (!user) {
    console.log("User not found.");
  } else {
    console.log("User found:");
    console.log("Role:", user.role);
    console.log("mustResetPassword:", user.mustResetPassword);
    
    // Check if password matches Temp@123
    const isMatch = await user.comparePassword("Temp@123");
    console.log("Password matches Temp@123:", isMatch);
  }
  mongoose.disconnect();
})
.catch(console.error);
