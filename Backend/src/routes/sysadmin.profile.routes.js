import express from "express";
import { 
  getProfile, 
  updateProfile, 
  updateSecurity, 
  updatePreferences, 
  getActivityLog 
} from "../controllers/sysadmin.profile.controller.js";
import protect from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.use((req, res, next) => {
  console.log(`[ProfileRouter] ${req.method} ${req.url}`);
  next();
});

const sysAdminAuth = [protect, authorizeRoles("system_admin", "admin", "super_admin")];

router.get("/profile", sysAdminAuth, getProfile);
router.patch("/profile", sysAdminAuth, updateProfile);
router.patch("/profile/security", sysAdminAuth, updateSecurity);
router.patch("/profile/preferences", sysAdminAuth, updatePreferences);
router.get("/profile/activity", sysAdminAuth, getActivityLog);

export default router;
