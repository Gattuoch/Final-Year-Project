import express from "express";
import protect from "../middlewares/auth.js";
import { onlySuperAdmin } from "../middlewares/roleMiddleware.js";
import { getSettings, updateSettings } from "../controllers/setting.controller.js";

const router = express.Router();

// GET /api/superadmin/settings/
router.get("/", protect, onlySuperAdmin, getSettings);

// PUT /api/superadmin/settings/
router.put("/", protect, onlySuperAdmin, updateSettings);

export default router;
