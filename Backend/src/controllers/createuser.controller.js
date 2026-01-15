import User from "../models/User.model.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const emailNormalized = email ? String(email).toLowerCase().trim() : null;
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL ? String(process.env.SUPER_ADMIN_EMAIL).toLowerCase().trim() : null;
    if (superAdminEmail && emailNormalized === superAdminEmail) {
      return res.status(409).json({ message: "Cannot create user with Super Admin email" });
    }

    const exists = await User.findOne({ email: emailNormalized });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    // create with canonical field names
    const user = await User.create({ fullName: name, email: emailNormalized, role });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
