import express from "express";
// Use the unified auth middleware implementation to avoid conflicts between
// `authMiddleware.js` and `auth.middleware.js` (they previously exported
// different `protect` implementations which caused inconsistent 401s).
import { authenticateJWT } from "../middlewares/auth.middleware.js";
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


const router = express.Router();

// 🔐 SUPER ADMIN ONLY
// Authenticate JWT for all routes under this router and require super_admin role
router.use(authenticateJWT, authorizeRoles("super_admin"));

router.get("/stats", getUserStats);
router.get("/growth", getUserGrowth);
router.get("/distribution", getUserDistribution);
router.get("/users", getUsersTable);
// The router already enforces authentication + super_admin role above.
// Individual routes only need to call their handlers.
router.get("/statsstat", getDashboardStats);
router.get("/revenue", getRevenueChart);
// Visitors list (details) - returns mapped visitor bookings (supports ?today=true)
router.get("/visitors", getVisitors);
// Visitor chart data (kept under /visitors/chart)
router.get("/visitors/chart", getVisitorChart);
router.get("/bookings", getBookingActivity);
router.get("/refunds", getRefundSummary);


export default router;
