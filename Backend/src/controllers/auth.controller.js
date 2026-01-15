import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.model.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

/* ============================================================
   🧾 AUTH CONTROLLER - Registration & Login for All Roles
   ============================================================ */

// ==================== REGISTER ====================
export const register = async (req, res) => {
  try {
    // Validate input
    const { error } = registerValidator.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map((d) => d.message);
      return res.status(400).json({ success: false, error: messages.join(", ") });
    }

    let {
      fullName,
      email,
      password,
      role,
      phone,
      businessName,
      description,
      location,
      licenseUrl,
      contactEmail,
    } = req.body;

    email = email.toLowerCase().trim();
    fullName = fullName.trim();

    // Prevent duplicate email
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ success: false, error: "This email is already registered." });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Build user object
    const userData = { fullName, email, password: hashedPassword, phone, role };

    // Special logic for Camp Managers
    if (role === "manager") {
      userData.businessInfo = { businessName, description, location, licenseUrl, contactEmail, status: "pending" };
    }

    const newUser = await User.create(userData);

    const message =
      role === "manager"
        ? "Registration successful! Await admin approval before accessing manager dashboard."
        : "Registration successful! You can now log in.";

    return res.status(201).json({
      success: true,
      message,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        status: newUser.role === "manager" ? newUser.businessInfo?.status : "active",
      },
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    return res.status(500).json({
      success: false,
      error: "An internal server error occurred during registration.",
    });
  }
};

// ==================== LOGIN ====================
export const login = async (req, res) => {
  try {
    // Validate login credentials
    const { error } = loginValidator.validate(req.body);
    if (error)
      return res.status(400).json({ success: false, error: error.details[0].message });

    let { email, password } = req.body;
    email = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, error: "Invalid email or password." });

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, error: "Invalid email or password." });

    // Enforce password rules per role
    if ((user.role === "admin" || user.role === "superadmin") && password.length < 15) {
      return res.status(403).json({ success: false, error: "Admin or Super Admin passwords must be at least 15 characters long." });
    }

    if (user.role === "manager" && password.length < 12) {
      return res.status(403).json({ success: false, error: "Camp Manager passwords must be at least 12 characters long." });
    }

    // Restrict unapproved camp managers
    if (user.role === "manager" && user.businessInfo?.status !== "approved") {
      return res.status(403).json({ success: false, error: "Your manager account is pending approval. Please wait for admin confirmation." });
    }

    // Check account activity
    if (user.isActive === false) {
      return res.status(403).json({ success: false, error: "Your account has been deactivated. Contact support." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    // NOTE: frontend expects `accessToken` and `refreshToken` keys — provide them for compatibility
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      accessToken: token,
      refreshToken: null,
      role: user.role,
      user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ success: false, error: "An internal server error occurred during login." });
  }
};
