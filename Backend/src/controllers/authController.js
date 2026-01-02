import  jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const generateToken = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "30d" }
  );

  return { accessToken, refreshToken };
};

// Camper signup (public)
exports.signupCamper = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const exists = await User.findOne({ email });

    if (exists) return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: "camper",
      isInternal: false,
    });

    res.status(201).json({ message: "Signup successful, verify email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Unified Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const valid = await user.comparePassword(password);

    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isActive)
      return res.status(403).json({ message: "Account disabled" });

    const tokens = generateToken(user);

    res.json({
      message: "Login successful",
      role: user.role,
      mustResetPassword: user.mustResetPassword,
      ...tokens,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// INTERNAL USER CREATION
exports.createInternalUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const tempPassword = Math.random().toString(36).slice(-10);

    await User.create({
      name,
      email,
      password: tempPassword,
      role,
      isInternal: true,
      mustResetPassword: true,
    });

    res.json({
      message: "Internal user created",
      tempPassword,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

