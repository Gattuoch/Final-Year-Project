import User from "../models/User.model.js";
import bcrypt from "bcrypt";

export const createInternalUser = async (req, res) => {
  try {
  const { name, email, role } = req.body;
    const emailNormalized = email ? String(email).toLowerCase().trim() : null;

    // Protect super-admin email from being created/overwritten via this endpoint
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL ? String(process.env.SUPER_ADMIN_EMAIL).toLowerCase().trim() : null;
    if (superAdminEmail && emailNormalized === superAdminEmail) {
      return res.status(409).json({ message: "Cannot create or modify the Super Admin account via this endpoint" });
    }

    // Map frontend role values to backend role enum
    const roleMap = {
      user: "camper",
      admin: "camp_manager",
      system_admin: "system_admin",
    };

    const mappedRole = roleMap[role] || "camper";

    const tempPassword = "Temp@123";
    const hash = await bcrypt.hash(String(tempPassword), 10);

    const user = await User.create({
      fullName: name,
      email: emailNormalized,
      role: mappedRole,
      passwordHash: hash,
      mustResetPassword: true,
      isInternal: true,
    });

    // Don't return passwordHash in response
    const userSafe = user.toObject();
    delete userSafe.passwordHash;

    res.status(201).json({
      message: "Internal user created",
      tempPassword,
      user: userSafe,
    });
  } catch (err) {
    console.error("createInternalUser error:", err?.message || err);
    // Duplicate key (email) - Mongo error code 11000
    if (err && err.code === 11000) {
      const dupField = err.keyValue ? Object.keys(err.keyValue)[0] : null;
      const dupVal = err.keyValue ? err.keyValue[dupField] : null;
      const msg = dupField ? `${dupField} '${dupVal}' already exists` : 'Duplicate key error';
      return res.status(409).json({ message: msg });
    }
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Failed to create internal user" });
  }
};
