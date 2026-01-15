import express from "express";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";
import { 
  getAdminStats, 
  getManagerStats, 
  getCamperStats 
} from "../controllers/dashboardController.js";

const router = express.Router();

// System Admin Dashboard
router.get("/admin", verifyToken, isAdmin, getAdminStats);

// Manager Dashboard
router.get("/manager", verifyToken, getManagerStats);

// Camper Dashboard
router.get("/camper", verifyToken, getCamperStats);

export default router;