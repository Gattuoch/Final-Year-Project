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
  requestPasswordReset,
  performPasswordReset,
} from "../controllers/authController.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.js"; 
import uploadProfile from "../middlewares/uploadProfile.js";

const router = express.Router();

// ✅ Use .fields to accept both "license" and "govId"
router.post("/register", upload.fields([
  { name: "license", maxCount: 1 },
  { name: "govId", maxCount: 1 }
]), register);

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/verify-otp", verifyOTP);
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", performPasswordReset);
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

import User from "../models/User.model.js";

// ---------------- PROFILE ----------------
// Return current authenticated user's profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    // The user is already attached to req.user by verifyToken middleware
    const user = req.user;
    if (!user) return res.status(404).json({ message: "User not found" });

    // Convert Mongoose doc to plain object and strip sensitive data
    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.passwordHash;
    delete userObj.__v;

    // Set headers to prevent caching sensitive profile data
    res.set("Cache-Control", "no-store");
    
    return res.json({ 
      success: true, 
      user: userObj // Frontend uses: const { user } = res.data;
    });
  } catch (err) {
    console.error("/profile error:", err);
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
});

// Advanced Profile update endpoint for Camper Dashboards and standard updates
router.patch("/profile", verifyToken, uploadProfile.fields([{ name: "profilePicture", maxCount: 1 }, { name: "coverPicture", maxCount: 1 }]), async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: "User not found" });

    const { firstName, lastName, phoneNumber, gender, dateOfBirth, fullName, email, avatar, metadata, currentPassword, newPassword } = req.body;
    
    // Existing fields
    if (typeof fullName === "string") user.fullName = fullName;
    if (typeof email === "string") user.email = email;
    if (typeof avatar === "string") user.avatar = avatar;

    // Password Update Logic
    if (currentPassword && newPassword) {
      const fullUser = await User.findById(user._id).select("+passwordHash");
      const isMatch = await fullUser.comparePassword(currentPassword);
      if (!isMatch) {
         return res.status(401).json({ message: "Current password is incorrect.", success: false });
      }
      user.passwordHash = newPassword; // Will be hashed via pre-save hook
    }

    // Metadata Merging (for Notification Preferences)
    if (metadata && typeof metadata === "object") {
      user.metadata = { ...user.metadata, ...metadata };
    }

    // Camper Dashboard Fields
    if (typeof firstName === "string") user.firstName = firstName;
    if (typeof lastName === "string") user.lastName = lastName;
    // Both phone and phoneNumber exist depending on route, normalizing here:
    if (typeof phoneNumber === "string") user.phone = phoneNumber; 
    if (typeof gender === "string") user.gender = gender;
    if (typeof dateOfBirth === "string") user.dateOfBirth = dateOfBirth;

    if (user.firstName && user.lastName) {
      user.fullName = `${user.firstName} ${user.lastName}`;
    }

    // Process files if present
    if (req.files) {
      if (req.files.profilePicture) {
        // Construct standard static URL matching server.js serving pattern
        user.profilePicture = `http://localhost:5000/uploads/avatars/${req.files.profilePicture[0].filename}`;
        user.avatar = user.profilePicture; 
      }
      if (req.files.coverPicture) {
        user.coverPicture = `http://localhost:5000/uploads/covers/${req.files.coverPicture[0].filename}`;
      }
    }

    await user.save();

    const userObj = user.toObject();
    delete userObj.passwordHash;
    res.set("Cache-Control", "no-store");

    return res.json({ message: "Profile updated successfully", user: userObj, success: true });
  } catch (err) {
    console.error("/profile PATCH error:", err);
    return res.status(500).json({ message: "Failed to update profile", success: false, error: err.message });
  }
});

export default router;