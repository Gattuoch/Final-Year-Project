import express from "express";
import { createSystemAdmin } from "../controllers/CreateSystemAdmin.js";
import { protect } from "../middlewares/CreatesystemAdmin.js";
import { onlySuperAdmin } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// SUPER ADMIN ONLY
router.post(
  "/create-system-admin",
  protect,
  onlySuperAdmin,
  createSystemAdmin
);

export default router;
