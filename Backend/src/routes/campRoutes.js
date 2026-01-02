import express from "express";
import {
  getAllCamps,
  createCamp,
  updateCamp,
  deleteCamp,
} from "../controllers/campController.js";
import { protect, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// GET all camps
router.get(
  "/",
  protect,
  authorizeRoles("super_admin"),
  getAllCamps
);

// CREATE camp
router.post(
  "/",
  protect,
  authorizeRoles("super_admin"),
  createCamp
);

// UPDATE camp
router.patch(
  "/:id",
  protect,
  authorizeRoles("super_admin"),
  updateCamp
);

// DELETE camp
router.delete(
  "/:id",
  protect,
  authorizeRoles("super_admin"),
  deleteCamp
);

export default router;
