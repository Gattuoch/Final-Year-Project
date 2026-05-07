import express from "express";
import protect from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { getSystemAdminDashboard } from "../controllers/sysadmin.dashboard.controller.js";

const router = express.Router();

router.use(protect, authorizeRoles("system_admin", "admin", "super_admin"));

router.get("/", getSystemAdminDashboard);

export default router;
