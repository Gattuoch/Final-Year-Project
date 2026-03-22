import express from "express";
import {
  getPendingManagers,
  approveManager,
  rejectManager,
} from "../controllers/admin.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require admin privileges
router.get("/pending-managers", verifyToken, isAdmin, getPendingManagers);
router.patch("/manager/:id/approve", verifyToken, isAdmin, approveManager);
router.patch("/manager/:id/reject", verifyToken, isAdmin, rejectManager);

export default router;
