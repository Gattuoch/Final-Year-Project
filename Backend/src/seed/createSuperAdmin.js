import User from "../models/User.js";
import bcrypt from "bcryptjs";

const createSuperAdmin = async () => {
  try {
    const exists = await User.findOne({ role: "super_admin" });

    if (exists) {
      console.log("Super admin already exists");
      return;
    }

    if (!process.env.SUPER_ADMIN_EMAIL || !process.env.SUPER_ADMIN_PASSWORD) {
      console.error("❌ Missing SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD in .env");
      return;
    }

    const passwordHash = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10);

    await User.create({
      fullName: "Platform Super Admin",
      email: process.env.SUPER_ADMIN_EMAIL,
      passwordHash,
      role: "super_admin",
      isInternal: true,
      isEmailVerified: true,
      mustResetPassword: true,
    });

    console.log("✅ Super admin created");
  } catch (err) {
    console.error("❌ Super admin creation failed:", err.message);
  }
};

export default createSuperAdmin;
