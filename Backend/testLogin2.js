import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./src/models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const identifier = "super@system.com";
  const password = "ChangeThisNow!123";
  
  const user = await User.findOne({
    $or: [{ email: identifier }, { phone: identifier }]
  });

  if (!user) {
    console.log("No user found");
  } else {
    console.log("User password field:", user.password ? "EXISTS" : "MISSING");
    const isMatch = await user.matchPassword(password);
    console.log("Match:", isMatch);
  }
  process.exit(0);
});
