import express from "express";
import {
  resetPassword,
  togglePremium,
  toggleBan,
  updateUser,
  deleteUser,
  invalidateTempPassword,
} from "../controllers/admin.user.controller.js";

import protect from "../middlewares/auth.js";
import { onlySuperAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/:id/reset-password", protect, onlySuperAdmin, resetPassword);
router.delete("/:id/temp-password", protect, onlySuperAdmin, invalidateTempPassword);
router.put("/:id/premium", protect, onlySuperAdmin, togglePremium);
router.put("/:id/ban", protect, onlySuperAdmin, toggleBan);
router.put("/:id", protect, onlySuperAdmin, updateUser);
router.delete("/:id", protect, onlySuperAdmin, deleteUser);

export default router;
