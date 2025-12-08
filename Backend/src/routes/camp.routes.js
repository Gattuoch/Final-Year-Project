import express from "express";
import {
  createCamp,
  getAllApprovedCamps,
  getCampById,
  editCamp,
  softDeleteCamp,
  getPendingCamps,
  approveCamp,
  rejectCamp,
} from "../controllers/camp.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ===== PUBLIC ROUTES =====
router.get("/", getAllApprovedCamps);
router.get("/:id", getCampById);

// ===== MANAGER ROUTES =====
router.post("/", verifyToken, createCamp);
router.patch("/:id", verifyToken, editCamp);
router.delete("/:id", verifyToken, softDeleteCamp);

// ===== ADMIN ROUTES =====
router.get("/admin/pending", verifyToken, isAdmin, getPendingCamps);
router.patch("/admin/:id/approve", verifyToken, isAdmin, approveCamp);
router.patch("/admin/:id/reject", verifyToken, isAdmin, rejectCamp);

export default router;
