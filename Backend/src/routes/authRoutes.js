import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { 
  register, 
  login, 
  verifyOTP, 
  createInternalUser, 
  logout,
  refresh,
} from "../controllers/authController.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.js"; 

const router = express.Router();

// ✅ Use .fields to accept both "license" and "govId"
router.post("/register", upload.fields([
  { name: "license", maxCount: 1 },
  { name: "govId", maxCount: 1 }
]), register);

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/verify-otp", verifyOTP);
router.post("/create-internal", verifyToken, isAdmin, createInternalUser);
router.post("/logout", verifyToken, logout);

// Debug: decode token payload when DEBUG_AUTH=true
router.post("/debug/decode-token", async (req, res) => {
  if (process.env.DEBUG_AUTH !== "true") return res.status(403).json({ message: "Debug disabled" });
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(400).json({ message: "Provide Authorization: Bearer <token> header" });
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ decoded });
  } catch (err) {
    return res.status(400).json({ message: "Failed to decode token", error: err.message });
  }
});

// ---------------- PROFILE ----------------
// Return current authenticated user's profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: "User not found" });

    // remove sensitive fields
    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.passwordHash;

    // Prevent client-side caching
    res.set("Cache-Control", "no-store");

    return res.json({ message: "Profile fetched", user: userObj });
  } catch (err) {
    console.error("/profile error:", err);
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// Simple profile update endpoint
router.patch("/profile", verifyToken, async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: "User not found" });

    const { fullName, email, avatar } = req.body;
    if (typeof fullName === "string") user.fullName = fullName;
    if (typeof email === "string") user.email = email;
    if (typeof avatar === "string") user.avatar = avatar;

    await user.save();

    const userObj = user.toObject();
    delete userObj.passwordHash;
    res.set("Cache-Control", "no-store");

    return res.json({ message: "Profile updated", user: userObj });
  } catch (err) {
    console.error("/profile PATCH error:", err);
    return res.status(500).json({ message: "Failed to update profile" });
  }
});

export default router;