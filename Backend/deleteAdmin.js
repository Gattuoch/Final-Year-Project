import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./src/models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await User.deleteMany({ role: "system_admin" });
  console.log("System admins deleted");
  process.exit(0);
});
