import express from "express";
import {
  resetPassword,
  togglePremium,
  toggleBan,
  updateUser,
  deleteUser,
  invalidateTempPassword,
  updateStatus,
} from "../controllers/admin.user.controller.js";

import protect from "../middlewares/auth.js";
import { onlySystemAdmin, authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/:id/reset-password", protect, onlySystemAdmin, resetPassword);
router.delete("/:id/temp-password", protect, onlySystemAdmin, invalidateTempPassword);
router.put("/:id/premium", protect, onlySystemAdmin, togglePremium);
router.put("/:id/ban", protect, onlySystemAdmin, toggleBan);
// New route for managers and admins to change user status (Active/Inactive/Banned)
router.put("/:id/status", protect, authorizeRoles("system_admin", "system_admin", "manager", "camp_manager"), updateStatus);
router.put("/:id", protect, onlySystemAdmin, updateUser);
router.delete("/:id", protect, onlySystemAdmin, deleteUser);

export default router;
