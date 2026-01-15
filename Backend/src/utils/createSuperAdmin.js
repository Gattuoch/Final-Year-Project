import User from "../models/User.model.js";
import bcrypt from "bcryptjs";

const createSuperAdmin = async () => {
  try {
    if (!process.env.SUPER_ADMIN_EMAIL || !process.env.SUPER_ADMIN_PASSWORD) {
      console.error("❌ Missing SUPER_ADMIN_EMAIL or SUPER_ADMIN_PASSWORD in .env");
      return;
    }
    const emailNormalized = String(process.env.SUPER_ADMIN_EMAIL).toLowerCase().trim();
    const passwordHash = await bcrypt.hash(String(process.env.SUPER_ADMIN_PASSWORD), 10);

    // Try to find by role first, then by email
    let exists = await User.findOne({ role: "super_admin" });
    if (!exists) exists = await User.findOne({ email: emailNormalized });

    if (exists) {
      // Do NOT modify existing super-admin record. Respect DB state and avoid overwriting credentials.
      console.log("Super admin already exists - leaving existing credentials unchanged");
      return;
    }

    await User.create({
      fullName: "Platform Super Admin",
      email: emailNormalized,
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
