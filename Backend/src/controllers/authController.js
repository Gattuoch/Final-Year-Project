import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import User from "../models/User.model.js";
import OTP from "../models/OTP.js";
import RefreshToken from "../models/RefreshToken.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { sendSMS } from "../utils/mailer.js";

dotenv.config();

/* ---------------- HELPERS ---------------- */

const normalizePhone = (phone) => {
  if (!phone) return null;
  // STRICT UPDATE: replace(/\D/g, "") removes everything that is not a digit
  return phone.toString().trim().replace(/\D/g, "").replace(/^251/, "0");
};

const normalizeIdentifier = (identifier) => {
  if (!identifier) return null;
  const id = identifier.toString().trim();
  if (id.includes("@")) return id.toLowerCase();
  return normalizePhone(id);
};

const msFromDuration = (duration = "30d") => {
  const unit = duration.slice(-1);
  const val = parseInt(duration.slice(0, -1), 10);
  if (unit === "m") return val * 60 * 1000;
  if (unit === "h") return val * 3600 * 1000;
  if (unit === "d") return val * 24 * 3600 * 1000;
  return 30 * 24 * 3600 * 1000;
};

/* ---------------- AUTH CONTROLLER ---------------- */

// ✅ REGISTER
export const register = async (req, res) => {
  try {
    // 1. Manually inject Multer file paths into req.body so the Validator can see them
    if (req.files) {
      if (req.files['license']) {
        req.body.licenseUrl = req.files['license'][0].path;
      }
      if (req.files['govId']) {
        req.body.govIdUrl = req.files['govId'][0].path;
      }
    }

    // 2. Validate req.body (now includes the file paths)
    const { error } = registerValidator.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ 
      success: false, 
      error: error.details.map(d => d.message).join(", ") 
    });

    let { 
      fullName, email, password, role, phone, 
      businessName, description, location, 
      licenseUrl, govIdUrl, contactEmail, country 
    } = req.body;

    const normalizedPhone = normalizePhone(phone);
    const normalizedEmail = email?.toLowerCase().trim();

    const exists = await User.findOne({ $or: [{ email: normalizedEmail }, { phone: normalizedPhone }] });
    if (exists) return res.status(400).json({ success: false, error: "Email or Phone already registered." });

    const hashedPassword = await bcrypt.hash(password, 12);
    
    const userData = {
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      passwordHash: hashedPassword,
      role: role || "camper",
      isVerified: false,
      isInternal: false,
      isActive: true,
      metadata: { country }
    };

    // ✅ Attach Business Info if Manager
    if (role === "camp_manager") {
      userData.businessInfo = { 
        businessName, 
        description, 
        location, 
        licenseUrl, // Saved path from Multer
        govIdUrl,    // Saved path from Multer
        contactEmail: contactEmail || normalizedEmail, 
        status: "pending" 
      };
    }

    await User.create(userData);

    // --- OTP Generation ---
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({
      target: normalizedPhone || normalizedEmail,
      code,
      type: "verification",
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    // --- Email Notification ---
    if (normalizedEmail && process.env.BREVO_USER) {
      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com", port: 587, secure: false,
        auth: { user: process.env.BREVO_USER, pass: process.env.BREVO_PASS }
      });
      await transporter.sendMail({
        from: `"EthioCampGround" <${process.env.BREVO_USER}>`,
        to: normalizedEmail,
        subject: "Verify your account",
        html: `<h2>Verification code: ${code}</h2>`
      });
    }
    
    // --- SMS Notification ---
    if (normalizedPhone) {
      try { await sendSMS(normalizedPhone, `Your EthioCampGround code is ${code}`); } 
      catch (e) { console.error("SMS Failed", e); }
    }

    return res.status(201).json({ success: true, message: "Registration successful! Verification code sent." });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  try {
    const { error } = loginValidator.validate(req.body);
    if (error) return res.status(400).json({ success: false, error: error.details[0].message });

    const { identifier, password } = req.body;
    const normalized = normalizeIdentifier(identifier);

    const user = await User.findOne({ 
      $or: [{ email: normalized }, { phone: normalized }] 
    }).select("+passwordHash");
    
    if (!user) return res.status(401).json({ success: false, error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ success: false, error: "Invalid credentials" });

    if (user.isBanned || user.isActive === false) {
        return res.status(403).json({ success: false, error: "Account disabled/banned" });
    }

    // Role Specific Security
    if ((user.role === "admin" || user.role === "super_admin") && password.length < 15) {
      return res.status(403).json({ success: false, error: "Admin passwords must be 15+ chars." });
    }
    if (user.role === "camp_manager") {
      if (password.length < 12) return res.status(403).json({ success: false, error: "Manager passwords must be 12+ chars." });
      if (user.businessInfo?.status !== "approved") return res.status(403).json({ success: false, error: "Manager account pending approval." });
    }

    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });

    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + msFromDuration("30d")),
      createdByIp: req.ip,
    });

    return res.json({
      success: true,
      accessToken,
      refreshToken,
      user: { id: user._id, fullName: user.fullName, role: user.role, isVerified: user.isVerified }
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ success: false, error: "Login failed" });
  }
};

// ✅ VERIFY OTP
export const verifyOTP = async (req, res) => {
  try {
    let { target, code, type } = req.body;
    if (!target || !code) return res.status(400).json({ success: false, error: "Target and code required" });

    target = normalizeIdentifier(target);
    const otp = await OTP.findOne({ target, code: code.trim(), type, used: false });
    
    if (!otp || otp.expiresAt < new Date()) return res.status(400).json({ success: false, error: "Invalid/Expired OTP" });

    otp.used = true;
    await otp.save();

    let user = await User.findOneAndUpdate(
        { $or: [{ email: target }, { phone: target }] }, 
        { isVerified: true },
        { new: true }
      );

    return res.json({ 
      success: true, 
      message: "OTP verified successfully",
      role: user ? user.role : null 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Verification failed" });
  }
};

// ✅ CREATE INTERNAL USER
export const createInternalUser = async (req, res) => {
  try {
    const { fullName, email, role } = req.body;
    const tempPassword = Math.random().toString(36).slice(-10) + "A1!";
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    const user = await User.create({
      fullName, email: email.toLowerCase().trim(),
      passwordHash: hashedPassword, role, isInternal: true, mustResetPassword: true, isActive: true, isVerified: true
    });

    res.json({ success: true, message: "Internal user created", tempPassword, user: { id: user._id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ LOGOUT
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, error: "Refresh token required" });
    await RefreshToken.findOneAndUpdate({ token: refreshToken }, { revoked: true });
    return res.json({ success: true, message: "Logged out" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Logout failed" });
  }
};