import express from "express";
import {
  createCamp,
  listCamps,        // Combined search, list, and getAll
  getCampDetails,   // Replaces getCampById
  updateCamp,       // Replaces editCamp
  deleteCamp,       // Replaces softDeleteCamp
  approveCamp,
} from "../controllers/campController.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ============================================================
    1. PUBLIC ROUTES
   ============================================================ */
// This handles "/" (all camps) AND "/?search=...&location=..."
router.get("/", listCamps);
router.get("/:id", getCampDetails);

/* ============================================================
    2. MANAGER ROUTES
   ============================================================ */
router.post("/", verifyToken, createCamp);
router.patch("/:id", verifyToken, updateCamp);
router.delete("/:id", verifyToken, deleteCamp);

/* ============================================================
    3. ADMIN & MODERATION ROUTES
   ============================================================ */
// To see pending camps, use: GET /api/camps?status=pending
router.patch("/admin/:id/approve", verifyToken, isAdmin, approveCamp);

export default router;