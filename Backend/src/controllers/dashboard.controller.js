import CampHome from "../models/Camp.js";
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
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec",
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

/* ================= EXPORT DEFAULT ================= */
export default {
  getUsersTable,
  getDashboardStats,
  getRevenueChart,
  getVisitorChart,
  getBookingActivity,
  getRefundSummary,
};


