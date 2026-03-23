import express from "express";
import { 
  createInternalUser,
  // New Dashboard Functions
  getDashboardStats,    
  getRevenueData,       
  getVisitorData,       
  getBookingsData,      
  getRefundsData,       
  getAllUsers           
} from "../controllers/user.controller.js";
import protect from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/role.js";

const router = express.Router();

// ==========================================
// 1. YOUR EXISTING USER CREATION (SAFE)
// ==========================================
router.post(
  "/create",
  protect,
  allowRoles("system_admin", "super_admin"),
  createInternalUser
);

// ==========================================
// 2. NEW DASHBOARD ROUTES (FIXES THE 404 ERRORS)
// ==========================================
router.get("/super-admin/dashboard/stats", protect, allowRoles("system_admin", "super_admin"), getDashboardStats);
router.get("/super-admin/dashboard/revenue", protect, allowRoles("system_admin", "super_admin"), getRevenueData);
router.get("/super-admin/dashboard/visitors", protect, allowRoles("system_admin", "super_admin"), getVisitorData);
router.get("/super-admin/dashboard/bookings", protect, allowRoles("system_admin", "super_admin"), getBookingsData);
router.get("/super-admin/dashboard/refunds", protect, allowRoles("system_admin", "super_admin"), getRefundsData);
router.get("/super-admin/dashboard/users", protect, allowRoles("system_admin", "super_admin"), getAllUsers);

export default router;