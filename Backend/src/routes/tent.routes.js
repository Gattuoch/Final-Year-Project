import express from "express";
import {
  createTent,
  getTentsByCamp,
  updateTent,
  deleteTent,
} from "../controllers/tent.controller.js";
import { verifyToken, isManager } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public: view tents for a camp
router.get("/:campId", getTentsByCamp);

// Manager routes
router.post("/:campId", verifyToken, isManager, createTent);
router.patch("/:tentId", verifyToken, isManager, updateTent);
router.delete("/:tentId", verifyToken, isManager, deleteTent);

export default router;
