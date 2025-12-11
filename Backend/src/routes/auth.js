import  express from 'express';
import  bcrypt from 'bcrypt';
import { v4 as uuidv4 } from "uuid";
import User from "../models/User.model.js";
import OTP from "../models/OTP.js";
import nodemailer from "nodemailer";


import  RefreshToken from '../models/RefreshToken.js';
import  { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import  { sendEmail, sendSMS } from '../utils/mailer.js';

const router = express.Router();
const BCRYPT_ROUNDS = 12;

/**
 * Camper signup (public)
 * - allow email OR phone
 * - create user with role 'camper', send verification OTP
 */
// Normalize phone
const normalizePhone = (phone) => {
  if (!phone) return null;
  return phone
    .toString()
    .trim()
    .replace(/\s+/g, '')       // remove spaces
    .replace(/^\+251/, '0');   // convert +251 to 0
};

router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, phone, password, confirmPassword, country } = req.body;

    // ------------------ VALIDATION ------------------
    if (!fullName || !password || (!email && !phone)) {
      return res.status(400).json({
        message: 'fullName, password and (email or phone) required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Normalize phone BEFORE checking or saving
    const normalizedPhone = normalizePhone(phone);

    // ------------------ UNIQUE CHECKS ------------------
    if (email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(409).json({ message: 'Email already used' });
    }

    if (normalizedPhone) {
      const exists = await User.findOne({ phone: normalizedPhone });
      if (exists) return res.status(409).json({ message: 'Phone already used' });
    }

    // ------------------ HASH PASSWORD ------------------
    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const user = await User.create({
      fullName,
      email,
      phone: normalizedPhone,
      passwordHash: hash,
      role: 'camper',
      isInternal: false,
      metadata: { country }
    });

    // ------------------ GENERATE OTP ------------------
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

    await OTP.create({
      target: normalizedPhone || email,
      code,
      type: 'verification',
      expiresAt,
      used: false
    });

    // ------------------ SEND EMAIL OR SMS ------------------
    if (email) {
      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.BREVO_USER,  // must end with @smtp-brevo.com
          pass: process.env.BREVO_PASS,
        },
      });

      await transporter.sendMail({
        from: `"EthioCampGround Support" <${process.env.BREVO_USER}>`,
        to: email,
        subject: "Confirm Your Registration - EthioCampGround",
         html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h2>EthioCampGround - Email Verification</h2>
            <p>Hello ${fullName},</p>
            <p>Thanks for registering at EthioCampGround.</p>
            <p>Your verification code:</p>
            <h1 style="letter-spacing: 2px;">${code}</h1>
            <p>Valid for <strong>15 minutes</strong>.</p>
            <p>If you didn’t request this, ignore this message.</p>
            <p>Regards,<br>EthioCampGround Support Team</p>
          </div>
        `,
      });
    }

    if (normalizedPhone) {
      await sendSMS(
        normalizedPhone,
        `Your EthioCampGround verification code is ${code}`
      );
    }

    // ------------------ SUCCESS ------------------
    return res.status(201).json({
      message: "Account created. Verification code sent."
    });

  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      message: "Server error during signup",
      error: error.message
    });
  }
});



/**
 * Verify OTP (for signup or password reset)
 */
router.post('/verify-otp', async (req, res) => {
  try {
    let { target, code, type } = req.body;

    if (!target || !code || !type) {
      return res.status(400).json({
        message: 'target, code and type are required'
      });
    }

    // Normalize target
    target = target.toString().trim().replace(/\s+/g, '').replace(/^\+251/, '0');

    console.log("NORMALIZED INPUT:", target, code, type);

    // ------------------ DEBUG LOG ------------------
    const lastOtps = await OTP.find().sort({ createdAt: -1 }).limit(5);
    console.log("LATEST OTPs IN DB:", lastOtps);  // <-- PRINTS REAL DB DATA

    // ------------------ FIND OTP ------------------
    const otpRecord = await OTP.findOne({
      target,
      code: code.trim(),
      type,
      used: false
    });

    console.log("FOUND OTP RECORD:", otpRecord);

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    otpRecord.used = true;
    await otpRecord.save();

    const user = await User.findOne({
      $or: [{ email: target }, { phone: target }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found for this target' });
    }

    if (type === 'verification') {
      user.isVerified = true;
      await user.save();
    }

    return res.status(200).json({
      message: 'OTP verified successfully',
      isVerified: user.isVerified
    });

  } catch (err) {
    console.error("OTP Verification Error:", err);
    return res.status(500).json({
      message: 'OTP verification failed',
      error: err.message
    });
  }
});

/**
 * Unified login (email/phone + password)
 * Returns accessToken + refreshToken
 */
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // 1️⃣ Validate input
    if (!identifier || !password) {
      return res.status(400).json({ message: 'identifier and password required' });
    }

    // 2️⃣ Find user by email OR phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3️⃣ Check banned
    if (user.isBanned) {
      return res.status(403).json({ message: 'Account banned' });
    }

    // 4️⃣ Compare passwords
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid   credentials' });
    }

    // 5️⃣ Create tokens
    const accessToken = signAccessToken({ sub: user._id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user._id });

    const expiresAt = new Date(Date.now() + msFromDuration(process.env.REFRESH_TOKEN_EXPIRES || '30d'));

    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
      createdByIp: req.ip,
      expiresAt
    });

    // 6️⃣ Optional Meta (internal users forced reset)
    const meta = {};
    if (user.isInternal && user.mustResetPassword) {
      meta.mustResetPassword = true;
    }

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      role: user.role,
      meta
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: 'Login failed' });
  }
});


/**
 * Refresh tokens
 * - verify refresh token, check not revoked in DB, issue new accessToken (and optionally rotate refresh token)
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'refreshToken required' });

    const tokenDoc = await RefreshToken.findOne({ token: refreshToken, revoked: false });
    if (!tokenDoc) return res.status(401).json({ message: 'Invalid refresh token' });

    // verify token signature
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'Invalid token user' });

    // rotate: create new refresh token, revoke old
    tokenDoc.revoked = true;
    await tokenDoc.save();

    const newRefreshToken = signRefreshToken({ sub: user._id });
    const expiresAt = new Date(Date.now() + msFromDuration(process.env.REFRESH_TOKEN_EXPIRES || '30d'));
    await RefreshToken.create({ user: user._id, token: newRefreshToken, createdByIp: req.ip, expiresAt });

    const accessToken = signAccessToken({ sub: user._id, role: user.role });
    return res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Refresh failed', error: err.message });
  }
});

/**
 * Logout: revoke refresh token
 */
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'refreshToken required' });

    await RefreshToken.updateMany({ token: refreshToken }, { revoked: true });
    return res.json({ message: 'Logged out' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Logout failed' });
  }
});

/**
 * Request password reset (send OTP)
 */
router.post('/request-password-reset', async (req, res) => {
  try {
    const { target } = req.body; // email or phone
    if (!target) return res.status(400).json({ message: 'target required' });

    const user = await User.findOne({ $or: [{ email: target }, { phone: target }] });
    if (!user) return res.status(404).json({ message: 'No user found' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15);
    await OTP.create({ target, code, type: 'password_reset', expiresAt });

    if (user.email === target) await sendEmail(target, 'Password reset code', `Code: ${code}`);
    else await sendSMS(target, `Password reset code: ${code}`);

    return res.json({ message: 'Password reset code sent' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Request reset failed' });
  }
});

/**
 * Perform password reset after OTP verify (this endpoint expects OTP already verified via /verify-otp)
 * - Alternatively you can combine verification + new password in one endpoint by verifying OTP here.
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { target, code, newPassword } = req.body;
    if (!target || !code || !newPassword) return res.status(400).json({ message: 'target,code,newPassword required' });

    const otp = await OTP.findOne({ target, code, type: 'password_reset', used: false });
    if (!otp) return res.status(400).json({ message: 'Invalid or expired OTP' });
    otp.used = true;
    await otp.save();

    const user = await User.findOne({ $or: [{ email: target }, { phone: target }] });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    user.mustResetPassword = false;
    await user.save();

    return res.json({ message: 'Password updated' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Reset failed' });
  }
});

/* --- helpers --- */
function msFromDuration(duration) {
  // Accept formats like '15m', '30d', '3600s'
  const unit = duration.slice(-1);
  const val = parseInt(duration.slice(0, -1), 10);
  if (unit === 'm') return val * 60 * 1000;
  if (unit === 'h') return val * 3600 * 1000;
  if (unit === 'd') return val * 24 * 3600 * 1000;
  if (!isNaN(parseInt(duration))) return parseInt(duration);
  // default 30 days
  return 30 * 24 * 3600 * 1000;
}

const auth = router;

export default auth;
