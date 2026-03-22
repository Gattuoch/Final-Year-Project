import express from "express";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

import User from "../models/User.model.js";
import OTP from "../models/OTP.js";
import RefreshToken from "../models/RefreshToken.js";

import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

import { protect } from "../middlewares/authMiddleware.js";

import { sendEmail, sendSMS } from "../utils/mailer.js";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();
const BCRYPT_ROUNDS = 12;

/* ---------------- HELPERS ---------------- */

const normalizePhone = (phone) => {
  if (!phone) return null;
  return phone.toString().trim().replace(/\s+/g, "").replace(/^\+251/, "0");
};

const normalizeIdentifier = (identifier) => {
  if (!identifier) return null;
  identifier = identifier.toString().trim();
  if (identifier.includes("@")) return identifier.toLowerCase();
  return normalizePhone(identifier);
};

const msFromDuration = (duration = "30d") => {
  const unit = duration.slice(-1);
  const val = parseInt(duration.slice(0, -1), 10);
  if (unit === "m") return val * 60 * 1000;
  if (unit === "h") return val * 3600 * 1000;
  if (unit === "d") return val * 24 * 3600 * 1000;
  if (!isNaN(parseInt(duration))) return parseInt(duration);
  return 30 * 24 * 3600 * 1000;
};

/* ---------------- SIGNUP ---------------- */

router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, phone, password, confirmPassword, country } =
      req.body;

    if (!fullName || !password || (!email && !phone)) {
      return res
        .status(400)
        .json({ message: "fullName, password and email or phone required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const normalizedPhone = normalizePhone(phone);
    const emailNormalized = email ? email.toLowerCase().trim() : null;

    if (emailNormalized && (await User.findOne({ email: emailNormalized }))) {
      return res.status(409).json({ message: "Email already used" });
    }

    if (normalizedPhone && (await User.findOne({ phone: normalizedPhone }))) {
      return res.status(409).json({ message: "Phone already used" });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const user = await User.create({
      fullName,
      email: emailNormalized,
      phone: normalizedPhone,
      passwordHash,
      role: "camper",
      isVerified: false,
      isInternal: false,
      metadata: { country },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await OTP.create({
      target: normalizedPhone || email,
      code,
      type: "verification",
      expiresAt,
      used: false,
    });

    if (email) {
      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.BREVO_USER,
          pass: process.env.BREVO_PASS,
        },
      });

      await transporter.sendMail({
        from: `"EthioCampGround" <${process.env.BREVO_USER}>`,
        to: email,
        subject: "Verify your account",
        html: `<h2>Your verification code</h2><h1>${code}</h1>`,
      });
    }

    if (normalizedPhone) {
      await sendSMS(
        normalizedPhone,
        `Your EthioCampGround verification code is ${code}`
      );
    }

    return res
      .status(201)
      .json({ message: "Account created. Verification code sent." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Signup failed" });
  }
});

/* ---------------- VERIFY OTP ---------------- */

router.post("/verify-otp", async (req, res) => {
  try {
    let { target, code, type } = req.body;
    if (!target || !code || !type)
      return res.status(400).json({ message: "Invalid request" });

    target = normalizeIdentifier(target);

    const otp = await OTP.findOne({
      target,
      code: code.trim(),
      type,
      used: false,
    });

    if (!otp || otp.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    otp.used = true;
    await otp.save();

    const user = await User.findOne({
      $or: [{ email: target }, { phone: target }],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (type === "verification") {
      user.isVerified = true;
      await user.save();
    }

    return res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "OTP verification failed" });
  }
});

/* ---------------- LOGIN (FIXED) ---------------- */

router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password)
      return res
        .status(400)
        .json({ message: "identifier and password required" });

    const normalized = normalizeIdentifier(identifier);

    const user = await User.findOne({
      $or: [{ email: normalized }, { phone: normalized }],
    });

    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    if (user.isBanned)
      return res.status(403).json({ message: "Account banned" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = signAccessToken({
      sub: user._id,
      role: user.role,
    });

    const refreshToken = signRefreshToken({ sub: user._id });
    const expiresAt = new Date(
      Date.now() + msFromDuration(process.env.REFRESH_TOKEN_EXPIRES)
    );

    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
      expiresAt,
      createdByIp: req.ip,
    });

    return res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Login failed" });
  }
});

/* ---------------- REFRESH ---------------- */

router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "refreshToken required" });

    const doc = await RefreshToken.findOne({
      token: refreshToken,
      revoked: false,
    });
    if (!doc) return res.status(401).json({ message: "Invalid refresh token" });

  const payload = verifyRefreshToken(refreshToken);
  const userId = payload.id || payload.sub;
  const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: "Invalid token user" });

    doc.revoked = true;
    await doc.save();

    const newRefreshToken = signRefreshToken({ sub: user._id });
    await RefreshToken.create({
      user: user._id,
      token: newRefreshToken,
      expiresAt: new Date(Date.now() + msFromDuration()),
    });

    const accessToken = signAccessToken({
      sub: user._id,
      role: user.role,
    });

    return res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return res.status(401).json({ message: "Refresh failed" });
  }
});

/* ---------------- LOGOUT ---------------- */

router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;
  await RefreshToken.updateMany({ token: refreshToken }, { revoked: true });
  return res.json({ message: "Logged out" });
});

// ---------------- PROFILE ----------------
// Protected route to return current authenticated user's profile
router.get("/profile", protect, async (req, res) => {
  try {
    // req.user is populated by protect middleware and already excludes sensitive fields
    const user = req.user;
    if (!user) return res.status(404).json({ message: "User not found" });

    // Prevent client-side caching and conditional GETs (avoid 304 responses with empty body)
    // This ensures API always returns the latest user data and a JSON body.
    res.set("Cache-Control", "no-store");

    return res.json({ message: "Profile fetched", user });
  } catch (err) {
    console.error("/profile error:", err);
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// Avatar upload endpoint (multipart/form-data: field name = 'avatar')
// Saves into ./public/images/avatars and returns a public URL
const avatarStoragePath = path.resolve(process.cwd(), "public/images/avatars");
// ensure folder exists
if (!fs.existsSync(avatarStoragePath)) fs.mkdirSync(avatarStoragePath, { recursive: true });

const avatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, avatarStoragePath);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || "";
    cb(null, `${unique}${ext}`);
  },
});

const avatarUpload = multer({ storage: avatarStorage });

router.post("/profile/avatar", protect, avatarUpload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const filename = req.file.filename;
    const url = `${req.protocol}://${req.get("host")}/images/avatars/${filename}`;

    // optional: attach to user record immediately
    const user = req.user;
    if (user) {
      user.avatar = url;
      await user.save();
    }

    // prevent caching
    res.set("Cache-Control", "no-store");

    return res.json({ message: "Upload successful", url });
  } catch (err) {
    console.error("avatar upload error:", err);
    return res.status(500).json({ message: "Upload failed" });
  }
});

// Update current authenticated user's profile
router.patch("/profile", protect, async (req, res) => {
  try {
    const user = req.user; // populated by protect middleware
    if (!user) return res.status(404).json({ message: "User not found" });

    const { fullName, email, avatar } = req.body;

    // Simple updates - you can add validation/duplication checks later
    if (typeof fullName === "string") user.fullName = fullName;
    if (typeof email === "string") user.email = email;
    if (typeof avatar === "string") user.avatar = avatar;

    await user.save();

    // Return the updated user without passwordHash
    const userObj = user.toObject();
    delete userObj.passwordHash;

    // Ensure no caching for profile responses
    res.set("Cache-Control", "no-store");

    return res.json({ message: "Profile updated", user: userObj });
  } catch (err) {
    console.error("/profile PATCH error:", err);
    return res.status(500).json({ message: "Failed to update profile" });
  }
});

export default router;
