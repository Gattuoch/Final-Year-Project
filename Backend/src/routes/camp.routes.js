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
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ============================================================
   1. PUBLIC ROUTES (Search & Details)
   ============================================================ */
// List approved camps (with filters)
router.get("/", listCamps);

// Get specific camp details (For Booking Page)
router.get("/:id", getCampDetails);

// Full list (Internal use/Frontend cache)
router.get("/list/all", listAllCamps);


/* ============================================================
   2. MANAGER / AUTHENTICATED ROUTES (Create & Edit)
   ============================================================ */
// Create a new camp (Requires login)
router.post("/", verifyToken, createCamp);

// Update/Edit camp (Manager or Admin)
router.patch("/:id", verifyToken, updateCamp);
router.put("/:id", verifyToken, updateCamp);

// Delete (Soft delete)
router.delete("/:id", verifyToken, deleteCamp);


/* ============================================================
   3. ADMIN ROUTES (Approval Flow)
   ============================================================ */
// Get all pending camps
router.get("/admin/pending", verifyToken, isAdmin, getPendingCamps);

// Approve a camp
router.patch("/admin/:id/approve", verifyToken, isAdmin, approveCamp);

// Reject a camp
router.patch("/admin/:id/reject", verifyToken, isAdmin, rejectCamp);

export default router;