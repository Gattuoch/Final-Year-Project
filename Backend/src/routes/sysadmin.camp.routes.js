import express from "express";
import protect from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  getPendingCamps,
  getActiveCamps,
  updateCampStatus,
  sendCampWarning,
  getKYCQueue,
  updateKYCStatus,
  getCampLogs
} from "../controllers/sysadmin.camp.controller.js";

const router = express.Router();

router.use(protect, authorizeRoles("system_admin", "admin", "super_admin"));

router.get("/pending", getPendingCamps);
router.get("/active", getActiveCamps);
router.get("/logs", getCampLogs);
router.put("/:id/status", updateCampStatus);
router.put("/:id/warning", sendCampWarning);

router.get("/kyc", getKYCQueue);
router.put("/kyc/:id/status", updateKYCStatus);

export default router;
