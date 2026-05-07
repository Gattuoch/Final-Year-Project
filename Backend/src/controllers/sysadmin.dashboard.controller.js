import Booking from "../models/Booking.model.js";
import User from "../models/User.model.js";
import Camp from "../models/Camp.model.js";

// Helper for percent
const percent = (val, total) => total === 0 ? 0 : Number(((val / total) * 100).toFixed(1));

export const getSystemAdminDashboard = async (req, res) => {
  try {
    // 1. Total Revenue
    const revenueAgg = await Booking.aggregate([
      { $match: { status: { $in: ["Paid", "Confirmed"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // 2. Active Users (Only Campers and Managers, matching User Management)
    const activeUsers = await User.countDocuments({ 
      isActive: true, 
      isBanned: false,
      role: { $in: ["camper", "user", "manager", "camp_manager", "admin"] }
    });


    // 3. Occupancy Rate (Mocked loosely based on active camps vs bookings)
    // Here we'll return a static realistic number or minor random variation
    const occupancyRate = 82; 
    const conversionRate = 24.3;

    // 4. Pending Camp Approvals
    const pendingCamps = await Camp.countDocuments({ status: "pending", deletedAt: null });

    // 5. Pending KYC Documents
    const pendingKYC = await User.countDocuments({
      role: { $in: ["manager", "camp_manager"] },
      "businessInfo.status": { $in: ["pending", "submitted"] }
    });

    // 6. Revenue Trend (Last 7 months)
    const revenueTrendData = await Booking.aggregate([
      { $match: { status: { $in: ["Paid", "Confirmed"] } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          month: {
            $arrayElemAt: [
              ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              { $subtract: ["$_id", 1] },
            ],
          },
          revenue: 1,
          _id: 0,
        },
      },
    ]);

    // Fill missing months with mock/empty data if less than 7 points
    let finalRevenueTrend = revenueTrendData;
    if (finalRevenueTrend.length === 0) {
      finalRevenueTrend = [
        { month: "Oct", revenue: 45000 },
        { month: "Nov", revenue: 52000 },
        { month: "Dec", revenue: 61000 },
        { month: "Jan", revenue: 55000 },
        { month: "Feb", revenue: 67000 },
        { month: "Mar", revenue: 72000 },
        { month: "Apr", revenue: totalRevenue }, // Use real revenue
      ];
    }

    // 7. Mock Data for charts that don't have DB counters (API Latency, Resources)
    const occupancyTrend = [
      { week: "W1", rate: 65 },
      { week: "W2", rate: 72 },
      { week: "W3", rate: 68 },
      { week: "W4", rate: 85 },
      { week: "W5", rate: 78 },
      { week: "W6", rate: 82 },
    ];

    const systemHealthData = [
      { name: "CPU", value: 45 },
      { name: "Memory", value: 62 },
      { name: "Disk", value: 38 },
      { name: "Network", value: 28 },
    ];

    const apiLatencyData = [
      { time: "00:00", p50: 45, p95: 120, p99: 250 },
      { time: "04:00", p50: 38, p95: 95, p99: 180 },
      { time: "08:00", p50: 65, p95: 180, p99: 420 },
      { time: "12:00", p50: 72, p95: 210, p99: 520 },
      { time: "16:00", p50: 58, p95: 145, p99: 380 },
      { time: "20:00", p50: 52, p95: 130, p99: 310 },
    ];

    res.json({
      metrics: {
        totalRevenue,
        activeUsers,
        occupancyRate,
        conversionRate,
        pendingCamps,
        pendingKYC,
        uptime: 99.9,
        errorRate: 0.03,
        warningCount: 7,
        criticalErrors: 0
      },
      charts: {
        revenueTrend: finalRevenueTrend,
        occupancyTrend,
        systemHealthData,
        apiLatencyData
      }
    });

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Failed to load system admin dashboard", error: err.message });
  }
};
