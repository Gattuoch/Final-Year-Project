import CampHome from "../models/Camp.model.js";
import EventVenue from "../models/EventVenue.model.js";
import Booking from "../models/Booking.model.js";
import User from "../models/User.model.js";
import Refund from "../models/Refund.model.js";



/* ================= STATS CARDS ================= */
export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const activeUsers = await User.countDocuments({
      isVerified: true,
      isBanned: { $ne: true },
    });

    const newUsers = await User.countDocuments({
      createdAt: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    });

    const premiumUsers = await User.countDocuments({ role: "premium" });

    const bannedUsers = await User.countDocuments({ isBanned: true });

    res.json({
      totalUsers,
      activeUsers,
      newUsers,
      premiumUsers,
      bannedUsers,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load stats" });
  }
};

/* ================= USER GROWTH ================= */
export const getUserGrowth = async (req, res) => {
  try {
    const data = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          users: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const formatted = months.map((m, i) => ({
      month: m,
      users: data.find(d => d._id === i + 1)?.users || 0,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "Failed to load growth data" });
  }
};

/* ================= USER DISTRIBUTION ================= */
export const getUserDistribution = async (req, res) => {
  try {
    const total = await User.countDocuments();

    const regular = await User.countDocuments({ role: "camper" });
    const premium = await User.countDocuments({ role: "premium" });
    const campOwner = await User.countDocuments({ role: "camp_owner" });
    const banned = await User.countDocuments({ isBanned: true });

    res.json([
      { name: "Regular", value: percent(regular, total) },
      { name: "Premium", value: percent(premium, total) },
      { name: "Camp Owner", value: percent(campOwner, total) },
      { name: "Banned", value: percent(banned, total) },
    ]);
  } catch (err) {
    res.status(500).json({ message: "Failed to load distribution" });
  }
};

const percent = (value, total) =>
  total === 0 ? 0 : Number(((value / total) * 100).toFixed(1));

/* ================= Helper: Pagination ================= */
const getPagination = (page = 1, limit = 10) => {
  const skip = (Number(page) - 1) * Number(limit);
  return { skip, limit: Number(limit) };
};

/* ================= Helper: Async Wrapper ================= */
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ================= USERS TABLE ================= */
export const getUsersTable = asyncHandler(async (req, res) => {
  const { search, status, type, page = 1, limit = 10 } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (status) query.isBanned = status === "banned";
  if (type) query.role = type;

  const { skip } = getPagination(page, limit);

  const users = await User.find(query)
    .select("fullName email role isBanned createdAt")
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(query);

  res.json({
    users,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  });
});

/* ================= DASHBOARD STATS ================= */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [
    totalCamps,
    totalVenues,
    totalBookings,
    activeUsers,
    earningsAgg,
    ticketsAgg,
    todayVisitors,
  ] = await Promise.all([
    CampHome.countDocuments(),
    EventVenue.countDocuments(),
    Booking.countDocuments(),
    User.countDocuments({ isActive: true }),
    Booking.aggregate([
      { $match: { status: { $in: ["Paid", "Confirmed"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Booking.aggregate([
      { $match: { status: { $in: ["Paid", "Confirmed"] } } },
      { $group: { _id: null, tickets: { $sum: "$tickets" } } },
    ]),
    // Count bookings created today so the "Visitors Today" stat matches the
    // dashboard details which list today's bookings.
    Booking.countDocuments({ createdAt: { $gte: todayStart } }),
  ]);

  res.json({
    totalCamps,
    totalVenues,
    totalBookings,
    ticketsSold: ticketsAgg[0]?.tickets || 0,
    todayVisitors,
    totalEarnings: earningsAgg[0]?.total || 0,
    activeUsers,
    systemHealth: "Good",
  });
});

/* ================= REVENUE CHART ================= */
export const getRevenueChart = asyncHandler(async (req, res) => {
  const data = await Booking.aggregate([
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

  res.json(data);
});

/* ================= VISITOR CHART ================= */
export const getVisitorChart = asyncHandler(async (req, res) => {
  const data = await Booking.aggregate([
    {
      $group: {
        _id: { $dayOfWeek: "$createdAt" },
        visitors: { $sum: "$tickets" },
      },
    },
    { $sort: { "_id": 1 } },
    {
      $project: {
        day: {
          $arrayElemAt: [
            ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            { $subtract: ["$_id", 1] },
          ],
        },
        visitors: 1,
        _id: 0,
      },
    },
  ]);

  res.json(data);
});

/* ================= VISITORS LIST (DETAILS) ================= */
export const getVisitors = asyncHandler(async (req, res) => {
  // return a compact list of visitor bookings. Supports ?limit, ?sort, ?today=true
  const { limit = 50, sort = "-createdAt", today } = req.query;

  // build sort object
  let sortObj = { createdAt: -1 };
  if (typeof sort === "string") {
    const field = sort.startsWith("-") ? sort.slice(1) : sort;
    const order = sort.startsWith("-") ? -1 : 1;
    sortObj = { [field]: order };
  }

  const query = {};
  if (today === "true" || today === "1") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    query.createdAt = { $gte: start };
  }

  const docs = await Booking.find(query)
    .populate("camperId", "fullName email")
    .populate("tentId", "name pricePerNight")
    .sort(sortObj)
    .limit(Number(limit))
    .select("camperId tentId guests totalPrice status createdAt");

  res.set("Cache-Control", "no-store");

  const mapped = docs.map((b) => ({
    id: b._id,
    visitor: b.camperId ? b.camperId.fullName : null,
    email: b.camperId ? b.camperId.email : null,
    bookingId: b._id,
    tent: b.tentId ? b.tentId.name : null,
    tickets: b.guests || 0,
    amount: b.totalPrice || 0,
    status: b.status,
    time: b.createdAt,
  }));

  return res.json(mapped);
});

/* ================= BOOKING ACTIVITY ================= */
export const getBookingActivity = asyncHandler(async (req, res) => {
  // Support query params: limit and sort (e.g. ?limit=200&sort=-createdAt)
  // Also support today=true to return only bookings created today
  const { limit = 10, sort = "-createdAt", today } = req.query;

  // parse sort string into a mongoose sort object
  let sortObj = { createdAt: -1 };
  if (typeof sort === "string") {
    const field = sort.startsWith("-") ? sort.slice(1) : sort;
    const order = sort.startsWith("-") ? -1 : 1;
    sortObj = { [field]: order };
  }

  const query = {};
  if (today === "true" || today === "1") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    query.createdAt = { $gte: start };
  }

  const data = await Booking.find(query)
    .populate("camperId", "fullName email")
    .populate("tentId", "name pricePerNight")
    .sort(sortObj)
    .limit(Number(limit))
    .select("camperId tentId guests totalPrice status createdAt");

  // Prevent client-side caching / conditional GETs for dashboard data
  res.set("Cache-Control", "no-store");

  // Map to a compact shape useful for the dashboard UI
  const mapped = data.map((b) => ({
    id: b._id,
    visitor: b.camperId ? b.camperId.fullName : null,
    email: b.camperId ? b.camperId.email : null,
    bookingId: b._id,
    tent: b.tentId ? b.tentId.name : null,
    tickets: b.guests || 0,
    amount: b.totalPrice || 0,
    status: b.status,
    time: b.createdAt,
  }));

  res.json(mapped);
});

/* ================= REFUND SUMMARY ================= */
export const getRefundSummary = asyncHandler(async (req, res) => {
  const data = await Refund.aggregate([
    {
      $group: {
        _id: "$status",
        total: { $sum: "$amount" },
      },
    },
    { $project: { status: "$_id", total: 1, _id: 0 } },
  ]);

  res.json(data);
});

/* ================= PLATFORM ANALYTICS ================= */
export const getPlatformAnalytics = asyncHandler(async (req, res) => {
  // Currently returning mock data specifically aligned with Ethiopian regions.
  // In a full implementation, you'd aggregate real data by filtering bookings
  // and users by created date to match the 'Last 30 Days', 'Last 90 Days', etc.

  const mockData = {
    "Last 30 Days": {
      acquisition: [
        { name: 'Week 1', active: 4000, new: 2400 },
        { name: 'Week 2', active: 3000, new: 1398 },
        { name: 'Week 3', active: 2000, new: 9800 },
        { name: 'Week 4', active: 2780, new: 3908 },
      ],
      demographics: [
        { name: '18-24', value: 400 },
        { name: '25-34', value: 300 },
        { name: '35-44', value: 300 },
        { name: '45+', value: 200 },
      ],
      funnel: [
        { name: 'Site Visit', count: 4000 },
        { name: 'Search', count: 3000 },
        { name: 'Checkout', count: 2000 },
        { name: 'Booking', count: 1500 },
      ],
      regions: [
        { name: 'Addis Ababa', value: 85 },
        { name: 'Oromia', value: 45 },
        { name: 'Amhara', value: 30 },
        { name: 'Tigray', value: 15 },
        { name: 'SNNPR', value: 20 }
      ],
      metrics: [
        { label: "Bounce Rate", value: "32.4%", change: "-2.1%" },
        { label: "Avg Session Duration", value: "4m 12s", change: "+14s" },
        { label: "Pages per Session", value: "4.8", change: "+0.2" },
        { label: "Return Visitor %", value: "45.8%", change: "+5.1%" },
      ]
    },
    "Last 90 Days": {
      acquisition: [
        { name: 'Month 1', active: 12000, new: 7400 },
        { name: 'Month 2', active: 15000, new: 8398 },
        { name: 'Month 3', active: 18000, new: 9800 },
      ],
      demographics: [
        { name: '18-24', value: 1200 },
        { name: '25-34', value: 900 },
        { name: '35-44', value: 700 },
        { name: '45+', value: 500 },
      ],
      funnel: [
        { name: 'Site Visit', count: 12000 },
        { name: 'Search', count: 8000 },
        { name: 'Checkout', count: 6000 },
        { name: 'Booking', count: 4500 },
      ],
      regions: [
        { name: 'Addis Ababa', value: 220 },
        { name: 'Oromia', value: 120 },
        { name: 'Amhara', value: 80 },
        { name: 'Tigray', value: 40 },
        { name: 'SNNPR', value: 50 }
      ],
      metrics: [
        { label: "Bounce Rate", value: "30.1%", change: "-4.4%" },
        { label: "Avg Session Duration", value: "5m 02s", change: "+1m 04s" },
        { label: "Pages per Session", value: "5.2", change: "+0.6" },
        { label: "Return Visitor %", value: "48.2%", change: "+7.5%" },
      ]
    },
    "This Year": {
      acquisition: [
        { name: 'Q1', active: 30000, new: 15000 },
        { name: 'Q2', active: 35000, new: 18000 },
        { name: 'Q3', active: 42000, new: 22000 },
        { name: 'Q4', active: 50000, new: 28000 },
      ],
      demographics: [
        { name: '18-24', value: 4000 },
        { name: '25-34', value: 3500 },
        { name: '35-44', value: 2500 },
        { name: '45+', value: 1500 },
      ],
      funnel: [
        { name: 'Site Visit', count: 50000 },
        { name: 'Search', count: 32000 },
        { name: 'Checkout', count: 24000 },
        { name: 'Booking', count: 18000 },
      ],
      regions: [
        { name: 'Addis Ababa', value: 800 },
        { name: 'Oromia', value: 400 },
        { name: 'Amhara', value: 250 },
        { name: 'Tigray', value: 100 },
        { name: 'SNNPR', value: 150 }
      ],
      metrics: [
        { label: "Bounce Rate", value: "28.5%", change: "-6.0%" },
        { label: "Avg Session Duration", value: "5m 45s", change: "+1m 47s" },
        { label: "Pages per Session", value: "6.1", change: "+1.5" },
        { label: "Return Visitor %", value: "55.0%", change: "+14.3%" },
      ]
    },
    "All Time": {
      acquisition: [
        { name: '2022', active: 100000, new: 80000 },
        { name: '2023', active: 150000, new: 90000 },
        { name: '2024', active: 250000, new: 120000 },
        { name: '2025', active: 350000, new: 150000 },
      ],
      demographics: [
        { name: '18-24', value: 12000 },
        { name: '25-34', value: 10000 },
        { name: '35-44', value: 8000 },
        { name: '45+', value: 5000 },
      ],
      funnel: [
        { name: 'Site Visit', count: 150000 },
        { name: 'Search', count: 90000 },
        { name: 'Checkout', count: 60000 },
        { name: 'Booking', count: 45000 },
      ],
      regions: [
        { name: 'Addis Ababa', value: 2500 },
        { name: 'Oromia', value: 1200 },
        { name: 'Amhara', value: 800 },
        { name: 'Tigray', value: 300 },
        { name: 'SNNPR', value: 400 }
      ],
      metrics: [
        { label: "Bounce Rate", value: "29.2%", change: "--" },
        { label: "Avg Session Duration", value: "5m 10s", change: "--" },
        { label: "Pages per Session", value: "5.5", change: "--" },
        { label: "Return Visitor %", value: "50.5%", change: "--" },
      ]
    }
  };

  res.json(mockData);
});

/* ================= EXPORT DEFAULT ================= */
export default {
  getUsersTable,
  getDashboardStats,
  getRevenueChart,
  getVisitorChart,
  getBookingActivity,
  getRefundSummary,
  getPlatformAnalytics,
};


