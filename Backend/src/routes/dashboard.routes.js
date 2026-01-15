import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  getUserStats,
  getUserGrowth,
  getUserDistribution,
  getUsersTable,
} from "../controllers/dashboard.controller.js";
import {
  getDashboardStats,
  getRevenueChart,
  getVisitorChart,
  getBookingActivity,
  getRefundSummary,
} from "../controllers/dashboard.controller.js";
import { getVisitors } from "../controllers/dashboard.controller.js";
import { adminOnly } from "../middlewares/auth.middleware.js";


const router = express.Router();

// 🔐 SUPER ADMIN ONLY
router.use(protect,authorizeRoles("super_admin"));

router.get("/stats", getUserStats);
router.get("/growth", getUserGrowth);
router.get("/distribution", getUserDistribution);
router.get("/users", getUsersTable);
// 
router.get("/statsstat", protect, adminOnly, getDashboardStats);
router.get("/revenue", protect, adminOnly, getRevenueChart);
// Visitors list (details) - returns mapped visitor bookings (supports ?today=true)
router.get("/visitors", protect, adminOnly, getVisitors);
// Visitor chart data (kept under /visitors/chart)
router.get("/visitors/chart", protect, adminOnly, getVisitorChart);
router.get("/bookings", protect, adminOnly, getBookingActivity);
router.get("/refunds", protect, adminOnly, getRefundSummary);


export default router;
