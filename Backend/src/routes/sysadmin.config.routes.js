import express from "express";
import protect from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import { getSystemConfig, saveConfig, testConnection } from "../controllers/sysadmin.config.controller.js";

const router = express.Router();

router.use(protect, authorizeRoles("system_admin", "admin", "super_admin"));

router.get("/", getSystemConfig);
router.post("/save", saveConfig);
router.post("/test-connection", testConnection);

export default router;
