import express from "express";
import {
  createCamp,
  listCamps,
  listAllCamps,
  getCampDetails,
  updateCamp,
  deleteCamp,
  approveCamp,
  rejectCamp,
  getPendingCamps,
} from "../controllers/campController.js";
import adminCampController from "../controllers/adminCamp.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ============================================================
    1. PUBLIC ROUTES
   ============================================================ */
// List/search approved camps (supports query params)
router.get("/", listCamps);
// Full list used by some frontend pages
router.get("/all", listAllCamps);

/* ============================================================
    2. ADMIN ROUTES (place before "/:id" to avoid accidental capture)
   ============================================================ */
router.get("/admin", verifyToken, isAdmin, adminCampController.getAdminCamps);
router.get("/admin/stats", verifyToken, isAdmin, adminCampController.getCampStats);
router.get("/admin/pending", verifyToken, isAdmin, getPendingCamps);
router.patch("/admin/:id/approve", verifyToken, isAdmin, approveCamp);
router.patch("/admin/:id/reject", verifyToken, isAdmin, rejectCamp);
router.patch("/admin/:id/status", verifyToken, isAdmin, adminCampController.updateCampStatus);
router.delete("/admin/:id", verifyToken, isAdmin, adminCampController.adminDeleteCamp);

/* ============================================================
    3. MANAGER / AUTHENTICATED ROUTES
   ============================================================ */
router.post("/", verifyToken, createCamp);
// Accept both PATCH and PUT for updates (frontend sometimes uses PUT)
router.patch("/:id", verifyToken, updateCamp);
router.put("/:id", verifyToken, updateCamp);
router.delete("/:id", verifyToken, deleteCamp);

/* ============================================================
    4. PUBLIC DETAIL ROUTE
   ============================================================ */
router.get("/:id", getCampDetails);

export default router;