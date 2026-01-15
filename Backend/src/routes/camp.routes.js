import express from "express";
import {
  createCamp,
  listCamps,        // Combined search, list, and getAll
  getCampDetails,   // Replaces getCampById
  updateCamp,       // Replaces editCamp
  deleteCamp,       // Replaces softDeleteCamp
  approveCamp,
<<<<<<< HEAD
} from "../controllers/campController.js";
=======
  rejectCamp,
} from "../controllers/camp.controller.js";
import adminCampController from "../controllers/adminCamp.controller.js";
>>>>>>> all change here
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

<<<<<<< HEAD
/* ============================================================
    1. PUBLIC ROUTES
   ============================================================ */
// This handles "/" (all camps) AND "/?search=...&location=..."
router.get("/", listCamps);
router.get("/:id", getCampDetails);
=======
// ===== PUBLIC ROUTES =====
router.get("/", getAllApprovedCamps);

// ===== ADMIN ROUTES (place before "/:id" to avoid accidental capture) =====
// admin list with filters, pagination
router.get("/admin", verifyToken, isAdmin, adminCampController.getAdminCamps);
router.get("/admin/stats", verifyToken, isAdmin, adminCampController.getCampStats);
// existing admin helpers
router.get("/admin/pending", verifyToken, isAdmin, getPendingCamps);
router.patch("/admin/:id/approve", verifyToken, isAdmin, approveCamp);
router.patch("/admin/:id/reject", verifyToken, isAdmin, rejectCamp);
// admin status update and permanent delete
router.patch("/admin/:id/status", verifyToken, isAdmin, adminCampController.updateCampStatus);
router.delete("/admin/:id", verifyToken, isAdmin, adminCampController.adminDeleteCamp);
>>>>>>> all change here

/* ============================================================
    2. MANAGER ROUTES
   ============================================================ */
router.post("/", verifyToken, createCamp);
router.patch("/:id", verifyToken, updateCamp);
router.delete("/:id", verifyToken, deleteCamp);

<<<<<<< HEAD
/* ============================================================
    3. ADMIN & MODERATION ROUTES
   ============================================================ */
// To see pending camps, use: GET /api/camps?status=pending
router.patch("/admin/:id/approve", verifyToken, isAdmin, approveCamp);
=======
// ===== PUBLIC DETAIL ROUTE =====
router.get("/:id", getCampById);
>>>>>>> all change here

export default router;