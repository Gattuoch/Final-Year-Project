import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import * as emailService from "../services/email.service.js";
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

    // Do not pre-hash here; store the raw password into `passwordHash`
    // so the User model's pre-save hook performs a single hash operation.
    const userData = {
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      passwordHash: password,
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

    if (normalizedEmail) {
      try { await emailService.sendVerificationEmail(normalizedEmail, code); } catch (e) { console.error("Email send failed", e); }
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

  // include both `id` and `sub` for compatibility with different middlewares
  const accessToken = jwt.sign({ id: user._id, sub: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  const refreshToken = jwt.sign({ id: user._id, sub: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
const tokenHash = crypto
  .createHash("sha256")
  .update(refreshToken)
  .digest("hex");

await RefreshToken.create({
  user: user._id,
  tokenHash,
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

    try {
      if (user?.email) await emailService.sendMail({
        to: user.email,
        subject: "Email verified - EthioCamp",
        html: `<p>Hello ${user.fullName || ''}, your email has been verified successfully.</p>`,
      });
    } catch (e) { console.error("Verification email failed", e); }

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
    // Store plain temporary password; User model will hash it on save
    const user = await User.create({
      fullName, email: email.toLowerCase().trim(),
      passwordHash: tempPassword, role, isInternal: true, mustResetPassword: true, isActive: true, isVerified: true
    });

    // send account creation email with temporary password
    if (user.email) {
      try { await emailService.sendAccountCreated(user.email, tempPassword); } catch (e) { console.error("Account created email failed", e); }
    }

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

// ✅ REFRESH ACCESS TOKEN
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, error: "Refresh token required" });

    // verify token signature
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (e) {
      return res.status(401).json({ success: false, error: "Invalid refresh token" });
    }

    const stored = await RefreshToken.findOne({ token: refreshToken, user: payload.id, revoked: { $ne: true } });
    if (!stored) return res.status(401).json({ success: false, error: "Refresh token revoked or not found" });
    if (stored.expiresAt && stored.expiresAt < new Date()) {
      return res.status(401).json({ success: false, error: "Refresh token expired" });
    }

    // Issue new access token and rotate refresh token
  // include both `id` and `sub` to make the new tokens compatible
  const accessToken = jwt.sign({ id: payload.id || payload.sub, sub: payload.id || payload.sub, role: payload.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  const newRefresh = jwt.sign({ id: payload.id || payload.sub, sub: payload.id || payload.sub }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });

    // mark old refresh token revoked and save new one
    stored.revoked = true;
    await stored.save();

   const tokenHash = crypto
  .createHash("sha256")
  .update(refreshToken)
  .digest("hex");

await RefreshToken.create({
  user: user._id,
  tokenHash,
  expiresAt: new Date(Date.now() + msFromDuration("30d")),
  createdByIp: req.ip,
});


    return res.json({ success: true, accessToken, refreshToken: newRefresh });
  } catch (err) {
    console.error("Refresh Error:", err);
    return res.status(500).json({ success: false, error: "Refresh failed" });
  }
};

// ---------------- PASSWORD RESET (REQUEST) ----------------
export const requestPasswordReset = async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) return res.status(400).json({ success: false, error: 'Identifier required' });

    const target = normalizeIdentifier(identifier);
    const user = await User.findOne({ $or: [{ email: target }, { phone: target }] });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({ target, code, type: 'password_reset', expiresAt: new Date(Date.now() + 15 * 60 * 1000) });

    // Email or SMS the code
    if (user.email) {
      try {
        await emailService.sendMail({
          to: user.email,
          subject: 'Password reset code - EthioCamp',
          html: `<p>Your password reset code is <strong>${code}</strong>. It expires in 15 minutes.</p>`,
        });
      } catch (e) { console.error('Password reset email failed', e); }
    }
    if (user.phone) {
      try { await sendSMS(user.phone, `Your reset code: ${code}`); } catch (e) { console.error('Password reset SMS failed', e); }
    }

    return res.json({ success: true, message: 'Password reset code sent' });
  } catch (err) {
    console.error('requestPasswordReset error:', err);
    return res.status(500).json({ success: false, error: 'Failed to request password reset' });
  }
};

// ---------------- PASSWORD RESET (PERFORM) ----------------
export const performPasswordReset = async (req, res) => {
  try {
    let { identifier, code, newPassword } = req.body;
    if (!identifier || !code || !newPassword) return res.status(400).json({ success: false, error: 'identifier, code and newPassword required' });

    const target = normalizeIdentifier(identifier);
    const otp = await OTP.findOne({ target, code: code.trim(), type: 'password_reset', used: false });
    if (!otp || otp.expiresAt < new Date()) return res.status(400).json({ success: false, error: 'Invalid or expired code' });

    const user = await User.findOne({ $or: [{ email: target }, { phone: target }] });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    // mark OTP used
    otp.used = true; await otp.save();

    // store plain password so model pre-save will hash
    user.passwordHash = newPassword;
    user.mustResetPassword = false;
    await user.save();

    return res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error('performPasswordReset error:', err);
    return res.status(500).json({ success: false, error: 'Failed to reset password' });
  }
};
