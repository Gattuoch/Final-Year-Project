import express from "express";
import {
  createTent,
  getTentsByCamp,
  updateTent,
  deleteTent,
} from "../controllers/tent.controller.js";
import { verifyToken, isManager, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public: view tents for a camp
router.get("/:campId", getTentsByCamp);

// Manager/Admin routes
// Note: We use 'verifyToken' to get the user, the controller handles specific permission checks
router.post("/:campId", verifyToken, createTent);
router.patch("/:tentId", verifyToken, updateTent);
router.delete("/:tentId", verifyToken, deleteTent);

export default router;