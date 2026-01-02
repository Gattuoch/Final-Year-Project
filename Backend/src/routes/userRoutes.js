import express from "express";
import { createInternalUser } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.js";
import { allowRoles } from "../middlewares/role.js";

const router = express.Router();

router.post(
  "/create",
  protect,
  allowRoles("system_admin", "super_admin"),
  createInternalUser
);

export default router;
