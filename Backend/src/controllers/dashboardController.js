import Camp from "../models/Camp.model.js";
import User from "../models/User.model.js";
import Booking from "../models/Booking.model.js";

// ✅ 1. SYSTEM ADMINISTRATOR STATS
export const getAdminStats = async (req, res) => {
  try {
    const totalCamps = await Camp.countDocuments({ deletedAt: null });
    const pendingCamps = await Camp.countDocuments({ status: "pending", deletedAt: null });
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    
    const totalRevenueAgg = await Booking.aggregate([
      { $match: { status: "confirmed" } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    res.json({
      success: true,
      role: "admin",
      stats: { totalCamps, pendingCamps, totalUsers, totalBookings, totalRevenue: totalRevenueAgg[0]?.total || 0 }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ 2. CAMP MANAGER STATS
export const getManagerStats = async (req, res) => {
  try {
    const managerId = req.user.id;
    // Find camps owned by this manager
    const myCamps = await Camp.find({ managerId, deletedAt: null }).select('_id');
    const campIds = myCamps.map(c => c._id);

    const totalMyCamps = myCamps.length;
    const activeBookings = await Booking.countDocuments({ tentId: { $in: campIds }, status: "confirmed" });


const router = express.Router();

// GET dashboard stats (SUPER ADMIN ONLY)
router.get(
  "/",
  protect,
  authorizeRoles("super_admin"),
  async (req, res) => {
    try {
      const totalCamps = await Camp.countDocuments();
      const activeCamps = await Camp.countDocuments({ status: "Active" });
      const pendingCamps = await Camp.countDocuments({ status: "Pending" });

      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({ isEmailVerified: true });

      const totalBookings = await Booking.countDocuments();
      const totalRevenueAgg = await Booking.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]);

      res.json({
        totalCamps,
        activeCamps,
        pendingCamps,
        totalUsers,
        activeUsers,
        totalBookings,
        totalRevenue: totalRevenueAgg[0]?.total || 0,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

    res.json({
      success: true,
      role: "manager",
      stats: { totalMyCamps, activeBookings }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ 3. CAMPER STATS
export const getCamperStats = async (req, res) => {
  try {
    const camperId = req.user.id;
    const myTotalBookings = await Booking.countDocuments({ camperId });
    const upcomingBookings = await Booking.countDocuments({ camperId, startDate: { $gte: new Date() } });

    res.json({
      success: true,
      role: "camper",
      stats: { myTotalBookings, upcomingBookings }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};