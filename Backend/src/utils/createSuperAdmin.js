import bcrypt from "bcryptjs";
import User from "../models/User.model.js";

export const createSuperAdmin = async () => {
  try {
    // Check if a Super Admin already exists
    const existing = await User.findOne({ role: "superadmin" });
    if (existing) {
      console.log("✅ Super Admin already exists.");
      return;
    }

    // Define default Super Admin credentials
    const superAdminData = {
      fullName: "Mr SuperAdmin",
      email: "superadmin@gmail.com",
      password: await bcrypt.hash("MrSuperAdminpassw0rd@", 12),
      role: "superadmin",
      status: "active",
    };

    // Create Super Admin
    await User.create(superAdminData);
    console.log("🚀 Super Admin created successfully:");
    console.log("   Email: superadmin@gmail.com");
    console.log("   Password: MrSuperAdminpassw0rd@");
  } catch (err) {
    console.error("❌ Error creating Super Admin:", err);
  }
};
