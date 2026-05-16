import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./src/models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log("Connected to MongoDB");
    console.log("Looking for SUPER_ADMIN_EMAIL:", process.env.SUPER_ADMIN_EMAIL);

    const allAdmins = await User.find({ role: { $in: ['system_admin', 'super_admin'] } });
    console.log(`Found ${allAdmins.length} admins:`);
    allAdmins.forEach(a => {
        console.log(`- Email: ${a.email}, Role: ${a.role}, ID: ${a._id}`);
    });

    const targetUser = await User.findOne({ email: process.env.SUPER_ADMIN_EMAIL });
    if (targetUser) {
        console.log("Target user found by email!");
    } else {
        console.log("Target user NOT found by email.");
    }

    process.exit(0);
});
