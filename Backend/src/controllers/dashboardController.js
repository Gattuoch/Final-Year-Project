import express from "express";
import Camp from "../models/Camp.js";
import User from "../models/User.model.js";
import Booking from "../models/Booking.js"; // Assuming you have a Booking model
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET dashboard stats
router.get("/", authMiddleware("super_admin"), async (req, res) => {
  try {
    const totalCamps = await Camp.countDocuments();
    const activeCamps = await Camp.countDocuments({ status: "Active" });
    const pendingCamps = await Camp.countDocuments({ status: "Pending" });
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isEmailVerified: true });
    const totalBookings = await Booking.countDocuments();
    const totalRevenueAgg = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({
      totalCamps,
      activeCamps,
      pendingCamps,
      totalUsers,
      activeUsers,
      totalBookings,
      totalRevenue: totalRevenueAgg[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
