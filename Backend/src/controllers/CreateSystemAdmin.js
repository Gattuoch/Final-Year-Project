import bcrypt from "bcryptjs";
import User from "../models/User.model.js";

export const createSystemAdmin = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const systemAdmin = await User.create({
      fullName,
      email,
      passwordHash: hashedPassword,
      role: "system_admin",
      isInternal: true,
      mustResetPassword: true,
      isVerified: true,
    });

    res.status(201).json({
      message: "System Admin created successfully",
      user: {
        id: systemAdmin._id,
        fullName: systemAdmin.fullName,
        email: systemAdmin.email,
        role: systemAdmin.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
