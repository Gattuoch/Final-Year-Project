import express from "express";
import protect from "../middlewares/auth.js";
import { authorizeRoles, onlySystemAdmin } from "../middlewares/roleMiddleware.js";
import {
  getCampers,
  getManagers,
  createUser,
  updateUserStatus,
  sendWarning,
  updateUserRole,
  updateUserDetails,
  getModerationLogs,
  deleteUser
} from "../controllers/sysadmin.user.controller.js";

const router = express.Router();

// Allow admin variants to access these routes
router.use(protect, authorizeRoles("system_admin", "admin", "super_admin"));

router.get("/campers", getCampers);
router.get("/managers", getManagers);
router.get("/moderation/logs", getModerationLogs);
router.post("/", createUser);
router.put("/:id/status", updateUserStatus);
router.put("/:id/warning", sendWarning);
router.put("/:id/role", updateUserRole);
router.put("/:id", updateUserDetails);
router.delete("/permanent-delete/:id", deleteUser);

export default router;
