import express from "express";
import { 
  createInternalUser,
  getDashboardStats,    
  getRevenueData,       
  getVisitorData,       
  getBookingsData,      
  getRefundsData,       
  getAllUsers           
} from "../controllers/user.controller.js";
import protect from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/role.js";
import User from "../models/User.model.js"; // adjust path as needed

const router = express.Router();

// ==========================================
// 1. YOUR EXISTING USER CREATION
// ==========================================
router.post(
  "/create",
  protect,
  allowRoles("system_admin", "super_admin"),
  createInternalUser
);

// ==========================================
// 2. DASHBOARD ROUTES (existing)
// ==========================================
router.get("/super-admin/dashboard/stats", protect, allowRoles("system_admin", "super_admin"), getDashboardStats);
router.get("/super-admin/dashboard/revenue", protect, allowRoles("system_admin", "super_admin"), getRevenueData);
router.get("/super-admin/dashboard/visitors", protect, allowRoles("system_admin", "super_admin"), getVisitorData);
router.get("/super-admin/dashboard/bookings", protect, allowRoles("system_admin", "super_admin"), getBookingsData);
router.get("/super-admin/dashboard/refunds", protect, allowRoles("system_admin", "super_admin"), getRefundsData);
router.get("/super-admin/dashboard/users", protect, allowRoles("system_admin", "super_admin"), getAllUsers);

// ==========================================
// 3. USER PROFILE UPDATE ROUTES (ADD THIS)
// ==========================================

// Update current user (using token) – frontend will call /api/users/me
router.patch("/me", protect, async (req, res) => {
  try {
    const user = req.user; // attached by protect middleware
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only allow specific fields to be updated (security)
    const allowedUpdates = ['fullName', 'email', 'avatar', 'metadata'];
    const requestedUpdates = Object.keys(req.body);
    const isValidOperation = requestedUpdates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: "Invalid update fields" });
    }

    // Apply updates (merge metadata instead of overwriting)
    requestedUpdates.forEach(update => {
      if (update === 'metadata' && req.body.metadata) {
        user.metadata = { ...user.metadata, ...req.body.metadata };
      } else {
        user[update] = req.body[update];
      }
    });

    await user.save();

    // Sanitize response (remove sensitive fields)
    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.passwordHash;
    delete userObj.__v;

    res.set("Cache-Control", "no-store");
    return res.json({ message: "Profile updated", user: userObj });
  } catch (err) {
    console.error("PATCH /me error:", err);
    return res.status(500).json({ message: "Failed to update profile" });
  }
});

// Fallback: update user by ID (optional, but keeps your frontend fallback working)
router.patch("/:id", protect, async (req, res) => {
  try {
    // Permission check: users can only update themselves (unless admin)
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'system_admin') {
      return res.status(403).json({ message: "Forbidden" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allowedUpdates = ['fullName', 'email', 'avatar', 'metadata'];
    const requestedUpdates = Object.keys(req.body);
    const isValidOperation = requestedUpdates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: "Invalid update fields" });
    }

    requestedUpdates.forEach(update => {
      if (update === 'metadata' && req.body.metadata) {
        user.metadata = { ...user.metadata, ...req.body.metadata };
      } else {
        user[update] = req.body[update];
      }
    });

    await user.save();

    const userObj = user.toObject();
    delete userObj.passwordHash;
    delete userObj.__v;

    res.set("Cache-Control", "no-store");
    return res.json({ message: "Profile updated", user: userObj });
  } catch (err) {
    console.error("PATCH /:id error:", err);
    return res.status(500).json({ message: "Failed to update profile" });
  }
});

export default router;