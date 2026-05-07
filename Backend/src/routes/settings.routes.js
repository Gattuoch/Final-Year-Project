import express from "express";
import protect from "../middlewares/auth.js";
import { onlySystemAdmin } from "../middlewares/roleMiddleware.js";
import { getSettings, updateSettings } from "../controllers/setting.controller.js";

const router = express.Router();

// GET /api/superadmin/settings/
router.get("/", protect, onlySystemAdmin, getSettings);

// PUT /api/superadmin/settings/
router.put("/", protect, onlySystemAdmin, updateSettings);

export default router;
